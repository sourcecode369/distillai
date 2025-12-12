
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('downloads-desc');
  const [filters, setFilters] = useState({}); // { access: [], context: [], params: [], pricing: [] }
  const [showFilters, setShowFilters] = useState(false);

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState(['All']);

  const [selectedModel, setSelectedModel] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('ai_models')
        .select('category');

      if (data) {
        const uniqueCats = ['All', ...new Set(data.map(m => m.category).filter(Boolean))].sort();
        setCategories(uniqueCats);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Models with Filters
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);

      try {
        let query = supabase
          .from('ai_models')
          .select('*', { count: 'exact' });

        // 1. Text Search
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
        }

        // 2. Category Filter
        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        // 3. Advanced Filters

        // Access Type (OSS vs API)
        if (filters.access?.length > 0) {
          const conditions = [];
          if (filters.access.includes('open_source')) conditions.push('is_open_source.eq.true');
          if (filters.access.includes('api')) conditions.push('is_api_only.eq.true');
          if (conditions.length > 0) query = query.or(conditions.join(','));
        }

        // Context Window
        if (filters.context?.length > 0) {
          const conditions = [];
          // 4k: < 8000
          // 8k: 8000-32000
          // 32k: 32000-128000
          // 128k: > 128000
          if (filters.context.includes('4k')) conditions.push('context_window.lt.8000');
          if (filters.context.includes('8k')) conditions.push('and(context_window.gte.8000,context_window.lt.32000)');
          if (filters.context.includes('32k')) conditions.push('and(context_window.gte.32000,context_window.lt.128000)');
          if (filters.context.includes('128k')) conditions.push('context_window.gte.128000');

          if (conditions.length > 0) query = query.or(conditions.join(','));
        }

        // Parameters
        if (filters.params?.length > 0) {
          const conditions = [];
          // xs: < 7B (7e9)
          // s: 7B - 13B (13e9)
          // m: 14B - 34B (34e9)
          // l: 35B - 70B (70e9)
          // xl: > 70B
          if (filters.params.includes('xs')) conditions.push('parameters.lt.7000000000');
          if (filters.params.includes('s')) conditions.push('and(parameters.gte.7000000000,parameters.lt.14000000000)');
          if (filters.params.includes('m')) conditions.push('and(parameters.gte.14000000000,parameters.lt.35000000000)');
          if (filters.params.includes('l')) conditions.push('and(parameters.gte.35000000000,parameters.lt.70000000000)');
          if (filters.params.includes('xl')) conditions.push('parameters.gte.70000000000');

          if (conditions.length > 0) query = query.or(conditions.join(','));
        }

        // Pricing (Simple approximation)
        if (filters.pricing?.length > 0) {
          const conditions = [];
          // Free implies open source usually, or price=0. 
          // Paid implies is_api_only usually.
          if (filters.pricing.includes('free')) conditions.push('is_open_source.eq.true');
          if (filters.pricing.includes('paid')) conditions.push('is_api_only.eq.true');

          if (conditions.length > 0) query = query.or(conditions.join(','));
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
  }, [page, searchQuery, selectedCategory, sortBy, filters]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, sortBy, filters]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setPanelOpen(true);
  };

  const activeFiltersCount = Object.values(filters).reduce((acc, curr) => acc + (curr?.length || 0), 0);

  return (
    <div className="min-h-screen relative z-10 pb-20">
      <SEO
        title="AI Models Directory"
        description="Comprehensive directory of open-source and API-based AI models, featuring LLMs, vision models, and more with technical benchmarks and insights."
      />

      <Hero
        title="AI Models Directory"
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
                  { value: 'downloads-desc', label: '⬇️ Most Downloads' },
                  { value: 'likes-desc', label: '❤️ Most Likes' },
                  { value: 'newest', label: '🆕 Newest' },
                  { value: 'name-asc', label: '🔤 Name (A-Z)' },
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
            {Object.entries(filters).flatMap(([key, values]) =>
              values.map(val => (
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
              ))
            )}
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
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setFilters({}); }}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && models.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-3">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                    Page <span className="text-indigo-600 dark:text-indigo-400">{page}</span> of {totalPages}
                  </div>
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800"
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
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Details Panel */}
      <ModelDetailsPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        model={selectedModel}
      />
    </div>
  );
};

export default ModelsDirectoryPage;
