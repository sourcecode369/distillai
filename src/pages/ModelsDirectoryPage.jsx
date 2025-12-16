
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Sliders, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import ModelCard from '../components/ModelCard';
import ModelFilters from '../components/ModelFilters';
import ModelDetailsPanel from '../components/ModelDetailsPanel';
import Skeleton from '../components/Skeleton';
import CustomDropdown from '../components/CustomDropdown';

const PAGE_SIZE = 24;

const ModelsDirectoryPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('downloads-desc');
  const [filters, setFilters] = useState({}); // { categories: [], access: [], tier: [], organizations: [], downloads: {}, parameters: {}, likes: {} }
  const [showFilters, setShowFilters] = useState(false);

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [selectedModel, setSelectedModel] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState({ loading: false, data: null, error: null });

  // Fetch Categories and Organizations
  useEffect(() => {
    const fetchFiltersData = async () => {
      // Fetch distinct categories using raw SQL
      const { data: catData, error: catError } = await supabase
        .rpc('get_distinct_categories');

      if (catError) {
        console.error('Error fetching categories:', catError);
        // Fallback to manual query if RPC doesn't exist
        const { data: fallbackCats } = await supabase
          .from('models_catalog')
          .select('category')
          .limit(10000);

        if (fallbackCats) {
          const uniqueCats = ['All', ...new Set(fallbackCats.map(m => m.category).filter(Boolean))].sort();
          console.log('Fetched categories (fallback):', uniqueCats);
          setCategories(uniqueCats);
        }
      } else if (catData) {
        const uniqueCats = ['All', ...catData.map(row => row.category).filter(Boolean).sort()];
        console.log('Fetched categories:', uniqueCats);
        setCategories(uniqueCats);
      }

      // Fetch distinct organizations using raw SQL
      const { data: orgData, error: orgError } = await supabase
        .rpc('get_distinct_publishers');

      if (orgError) {
        console.error('Error fetching organizations:', orgError);
        // Fallback to manual query if RPC doesn't exist
        const { data: fallbackOrgs } = await supabase
          .from('models_catalog')
          .select('publisher')
          .limit(10000);

        if (fallbackOrgs) {
          // Normalize organization names and sort case-insensitively
          const uniqueOrgs = [...new Set(fallbackOrgs.map(m => m.publisher).filter(Boolean))]
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          console.log('Fetched organizations (fallback):', uniqueOrgs.length, 'total');
          setOrganizations(uniqueOrgs);
        }
      } else if (orgData) {
        // Normalize organization names and sort case-insensitively
        const uniqueOrgs = orgData
          .map(row => row.publisher)
          .filter(Boolean)
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        console.log('Fetched organizations:', uniqueOrgs.length, 'total');
        setOrganizations(uniqueOrgs);
      }
    };
    fetchFiltersData();
  }, []);

  // Fetch Models with Filters
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);

      try {
        let query = supabase
          .from('models_catalog')
          .select('*', { count: 'exact' });

        // 1. Text Search
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
        }

        // 2. Categories Filter (multi-select)
        if (filters.categories?.length > 0) {
          const conditions = filters.categories.map(cat => `category.eq.${cat}`);
          query = query.or(conditions.join(','));
        }

        // 3. Access Type Filter (access_type is now an array, use contains operator)
        if (filters.access?.length > 0) {
          const conditions = filters.access.map(type => `access_type.cs.{${type}}`);
          query = query.or(conditions.join(','));
        }

        // 4. Tier Filter
        if (filters.tier?.length > 0) {
          const conditions = filters.tier.map(t => `tier.eq.${t}`);
          query = query.or(conditions.join(','));
        }

        // 5. Organizations Filter
        if (filters.organizations?.length > 0) {
          const conditions = filters.organizations.map(org => `publisher.eq.${org}`);
          query = query.or(conditions.join(','));
        }

        // 6. Downloads Range
        if (filters.downloads?.min) {
          query = query.gte('downloads', filters.downloads.min);
        }
        if (filters.downloads?.max) {
          query = query.lte('downloads', filters.downloads.max);
        }

        // 7. Likes Range
        if (filters.likes?.min) {
          query = query.gte('likes', filters.likes.min);
        }
        if (filters.likes?.max) {
          query = query.lte('likes', filters.likes.max);
        }

        // 8. Parameters Range (in billions)
        if (filters.parameters?.min) {
          query = query.gte('parameters', filters.parameters.min * 1000000000);
        }
        if (filters.parameters?.max) {
          query = query.lte('parameters', filters.parameters.max * 1000000000);
        }

        // Sorting
        if (sortBy === 'name-asc') {
          query = query.order('name', { ascending: true });
        } else if (sortBy === 'name-desc') {
          query = query.order('name', { ascending: false });
        } else if (sortBy === 'downloads-desc') {
          query = query.order('downloads', { ascending: false, nullsFirst: false });
        } else if (sortBy === 'likes-desc') {
          query = query.order('likes', { ascending: false, nullsFirst: false });
        } else if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        }

        // Pagination
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) throw error;

        setModels(data || []);
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchModels();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, searchQuery, sortBy, filters]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, filters]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModelClick = async (model) => {
    setSelectedModel(model);
    setPanelOpen(true);
    setAiInsights({ loading: true, data: null, error: null });

    try {
      console.log('Calling edge function with model:', model.model_id);
      const response = await supabase.functions.invoke('model-details', {
        body: { modelId: model.model_id }
      });

      console.log('Full response:', response);

      if (response.error) {
        console.error('Edge function error:', response.error);
        console.error('Response data:', response.data);

        // When edge function returns 500, the error JSON is in response.data if it was successfully parsed
        // Otherwise, we need to manually fetch the error from the response
        let errorMessage = 'Failed to generate insights. Please try again.';

        if (response.data?.error) {
          // Error message is in response.data.error
          errorMessage = response.data.error;
        } else if (response.error.message) {
          errorMessage = response.error.message;
        } else if (response.error.context?.body) {
          // Try to parse error from response body
          try {
            const errorBody = JSON.parse(response.error.context.body);
            errorMessage = errorBody.error || errorMessage;
          } catch (e) {
            // If parsing fails, use the default message
          }
        }

        throw new Error(errorMessage);
      }

      setAiInsights({ loading: false, data: response.data, error: null });

      // Refetch the model data to get updated pricing, context_window, and max_output_tokens
      // that were saved by the edge function
      const { data: updatedModel, error: modelError } = await supabase
        .from('models_catalog')
        .select('*')
        .eq('model_id', model.model_id)
        .single();

      if (!modelError && updatedModel) {
        console.log('Updated model data:', updatedModel);
        setSelectedModel(updatedModel);
      }
    } catch (err) {
      console.error('Error fetching model insights:', err);
      setAiInsights({
        loading: false,
        data: null,
        error: err.message || 'Failed to generate insights. Please try again.'
      });
    }
  };

  const activeFiltersCount =
    (filters.categories?.length || 0) +
    (filters.access?.length || 0) +
    (filters.tier?.length || 0) +
    (filters.organizations?.length || 0) +
    (filters.downloads?.min || filters.downloads?.max ? 1 : 0) +
    (filters.parameters?.min || filters.parameters?.max ? 1 : 0) +
    (filters.likes?.min || filters.likes?.max ? 1 : 0);

  return (
    <div className="min-h-screen relative z-10 pb-20">
      <SEO
        title="AI Models Catalog"
        description="Comprehensive catalog of open-source and API-based AI models, featuring LLMs, vision models, and more with technical benchmarks and insights."
      />

      <Hero
        title="AI Models Catalog"
        subtitle="Explore the universe of AI models. From open-source LLMs to proprietary APIs, analyze specifications and performance benchmarks."
        icon={<Sliders size={24} className="text-white" />}
      />

      {/* Simplified Filter Bar - Only Buttons */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Search */}
          <div className="relative w-full md:flex-1 group order-2 md:order-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search models (e.g. Llama 3, GPT-4, Mistral)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm group-hover:shadow-md text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 input-enhanced"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto order-1 md:order-2 justify-between md:justify-end">
            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm whitespace-nowrap border ${activeFiltersCount > 0
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700 hover:border-indigo-700'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
            >
              <Sliders size={18} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="w-56">
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: 'downloads-desc', label: 'Most Downloads' },
                  { value: 'likes-desc', label: 'Most Likes' },
                  { value: 'newest', label: 'Newest' },
                  { value: 'name-asc', label: 'Name (A-Z)' },
                ]}
                icon={null}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Pills */}
        {activeFiltersCount > 0 && (
          <div className="max-w-7xl mx-auto mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
            {Object.entries(filters).flatMap(([key, values]) => {
              // Handle array filters (categories, access, tier, organizations)
              if (Array.isArray(values)) {
                return values.map(val => (
                  <button
                    key={`${key}-${val}`}
                    onClick={() => {
                      const newValues = filters[key].filter(v => v !== val);
                      setFilters({ ...filters, [key]: newValues });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    <span className="capitalize">{val.replace(/_/g, ' ')}</span>
                    <X size={14} />
                  </button>
                ));
              }
              // Handle range filters (downloads, parameters, likes)
              if (values && typeof values === 'object' && (values.min || values.max)) {
                const label = key === 'parameters' ? 'Params' : key.charAt(0).toUpperCase() + key.slice(1);
                const rangeText = values.min && values.max
                  ? `${values.min}-${values.max}${key === 'parameters' ? 'B' : ''}`
                  : values.min
                    ? `>${values.min}${key === 'parameters' ? 'B' : ''}`
                    : `<${values.max}${key === 'parameters' ? 'B' : ''}`;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      const newFilters = { ...filters };
                      delete newFilters[key];
                      setFilters(newFilters);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    <span className="capitalize">{label}: {rangeText}</span>
                    <X size={14} />
                  </button>
                );
              }
              return [];
            })}
            <button
              onClick={() => setFilters({})}
              className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model, idx) => (
                <ModelCard
                  key={model.id || idx}
                  model={model}
                  onClick={() => handleModelClick(model)}
                />
              ))}
            </div>

            {!loading && models.length === 0 && (
              <div className="max-w-md mx-auto py-20 px-4 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-elegant rotate-3">
                  <Search className="text-slate-300 dark:text-slate-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No models found</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  We couldn't find any models matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setFilters({}); }}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && models.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show a window of pages around current page
                    let p = i + 1;
                    if (totalPages > 5) {
                      if (page > 3) p = page - 2 + i;
                      if (p > totalPages) p = totalPages - 4 + i;
                    }
                    if (p > totalPages) return null;

                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${page === p
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Sidebar */}
      <ModelFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        organizations={organizations}
      />

      {/* Details Panel */}
      <ModelDetailsPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        model={selectedModel}
        aiInsights={aiInsights}
      />
    </div>
  );
};

export default ModelsDirectoryPage;
