import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Cpu, Code, Database, Globe, Zap, Layers, Box, Terminal, Star, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import { FeatureCard } from '../components/Card';
import ToolDetailsPanel from '../components/ToolDetailsPanel';
import Skeleton from '../components/Skeleton';
import CustomDropdown from '../components/CustomDropdown';

// Helper to map categories to icons
const getIconForCategory = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('framework')) return <Cpu size={24} />;
  if (cat.includes('orchestration') || cat.includes('agent')) return <Layers size={24} />;
  if (cat.includes('library')) return <Globe size={24} />;
  if (cat.includes('data') || cat.includes('vector')) return <Database size={24} />;
  if (cat.includes('model') || cat.includes('api')) return <Zap size={24} />;
  if (cat.includes('sdk')) return <Code size={24} />;
  if (cat.includes('inference') || cat.includes('local')) return <Terminal size={24} />;
  return <Box size={24} />;
};

const PAGE_SIZE = 24;

const ToolsDirectoryPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [detailsState, setDetailsState] = useState({ loading: false, data: null, error: null });

  // Tools state
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState(['All']);
  const [sortBy, setSortBy] = useState('stars-desc');

  // Fetch Categories once
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('ai_tools')
        .select('category');

      if (data) {
        const uniqueCats = ['All', ...new Set(data.map(t => t.category).filter(Boolean))].sort();
        setCategories(uniqueCats);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Tools
  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);

      try {
        // When sorting by stars, we need to fetch ALL matching results to sort globally
        // For name sorting, we can use efficient database pagination
        const isStarSort = sortBy === 'stars-desc' || sortBy === 'stars-asc';

        let query = supabase
          .from('ai_tools')
          .select('name, category, short_description, github_stars', { count: 'exact' });

        // Apply filters
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        // For name sorting, do it in DB and paginate efficiently
        if (sortBy === 'name-asc') {
          query = query.order('name', { ascending: true })
            .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
        } else if (sortBy === 'name-desc') {
          query = query.order('name', { ascending: false })
            .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
        } else if (isStarSort) {
          // For star sorting, fetch ALL results (no .range())
          // We'll sort and paginate client-side
        }

        const { data, count, error } = await query;

        if (error) throw error;

        let finalData = data || [];
        let finalCount = count || 0;

        // Client-side sorting and pagination for stars
        if (isStarSort && finalData.length > 0) {
          // Sort all results
          const sorted = [...finalData].sort((a, b) => {
            const starsA = parseInt(a.github_stars) || 0;
            const starsB = parseInt(b.github_stars) || 0;
            return sortBy === 'stars-desc' ? (starsB - starsA) : (starsA - starsB);
          });

          // Manually paginate
          const startIdx = (page - 1) * PAGE_SIZE;
          const endIdx = page * PAGE_SIZE;
          finalData = sorted.slice(startIdx, endIdx);
        }

        setTools(finalData);
        setTotalCount(finalCount);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchTools();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, searchQuery, selectedCategory, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToolClick = async (tool) => {
    setSelectedTool(tool);
    setPanelOpen(true);
    setDetailsState({ loading: true, data: null, error: null });

    try {
      const { data, error } = await supabase.functions.invoke('tool-details', {
        body: { toolName: tool.name }
      });

      if (error) throw error;

      setDetailsState({ loading: false, data, error: null });
    } catch (err) {
      console.error('Error fetching tool details:', err);
      setDetailsState({
        loading: false,
        data: null,
        error: err.message || 'Failed to generate insights. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen relative z-10 pb-20">
      <SEO
        title="AI Tools Directory"
        description="Comprehensive directory of AI tools, frameworks, and libraries with auto-generated technical insights."
      />

      <Hero
        title="AI Tools Directory"
        subtitle="Explore the ecosystem of AI frameworks, libraries, and tools. Click on any tool to generate real-time technical insights powered by Gemini."
        icon={<Box size={24} className="text-white" />}
      />

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-5 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          {/* Expanded Search */}
          <div className="relative w-full md:flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search AI tools, frameworks, libraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm group-hover:shadow-md text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>

          {/* Category Dropdown */}
          <CustomDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories.map(cat => ({ value: cat, label: cat }))}
            icon={Filter}
            className="w-full md:w-64"
          />

          {/* Sort Dropdown */}
          <CustomDropdown
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'stars-desc', label: '⭐ Most Stars' },
              { value: 'stars-asc', label: '⭐ Least Stars' },
              { value: 'name-asc', label: '🔤 Name (A-Z)' },
              { value: 'name-desc', label: '🔤 Name (Z-A)' },
            ]}
            icon={ArrowUpDown}
            className="w-full md:w-56"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="w-12 h-6 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <div className="flex-1"></div>
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool, idx) => (
                <FeatureCard
                  key={idx}
                  onClick={() => handleToolClick(tool)}
                  className="flex flex-col h-full text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="w-full flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                      {getIconForCategory(tool.category)}
                    </div>
                    {tool.github_stars && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800/50">
                        <Star size={10} fill="currentColor" />
                        {tool.github_stars}
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {tool.name}
                  </h3>

                  {tool.short_description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed flex-grow">
                      {tool.short_description}
                    </p>
                  )}

                  <div className="mt-auto">
                    <span className="inline-block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100 dark:bg-slate-800/70 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors">
                      {tool.category}
                    </span>
                  </div>
                </FeatureCard>
              ))}
            </div>

            {!loading && tools.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No tools found matching your search.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && tools.length > 0 && totalPages > 1 && (
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

      {/* Details Panel */}
      <ToolDetailsPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        tool={selectedTool ? { ...selectedTool, icon: getIconForCategory(selectedTool.category) } : null}
        isLoading={detailsState.loading}
        error={detailsState.error}
        details={detailsState.data}
      />
    </div >
  );
};

export default ToolsDirectoryPage;
