import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Cpu, Layers, Zap, Filter, Building2, TrendingUp, Heart, ChevronDown, ChevronUp } from 'lucide-react';

const ModelFilters = ({
  filters,
  onFilterChange,
  isOpen,
  onClose,
  counts,
  searchQuery,
  setSearchQuery,
  categories = [],
  organizations = []
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    access: false,
    tier: false,
    organizations: false,
    downloads: false,
    parameters: false,
    likes: false
  });

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    handleChange(key, updated);
  };

  const handleRangeChange = (key, field, value) => {
    const numValue = value === '' ? null : parseInt(value);
    const currentRange = filters[key] || {};
    handleChange(key, { ...currentRange, [field]: numValue });
  };

  if (!isOpen) return null;

  const activeFiltersCount =
    (filters.categories?.length || 0) +
    (filters.access?.length || 0) +
    (filters.tier?.length || 0) +
    (filters.organizations?.length || 0) +
    (filters.downloads?.min || filters.downloads?.max ? 1 : 0) +
    (filters.likes?.min || filters.likes?.max ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="relative w-full max-w-md h-screen bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">

        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Filter className="text-indigo-600 dark:text-indigo-400" size={22} fill="currentColor" fillOpacity={0.2} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Refine your model search</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 rotate-0 hover:rotate-90"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 pb-24 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">

          {/* Category Section - Multi-select */}
          <section>
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Layers size={14} /> Category
                {filters.categories?.length > 0 && (
                  <span className="text-indigo-600 dark:text-indigo-400">({filters.categories.length})</span>
                )}
              </h3>
              {expandedSections.categories ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections.categories && (
              <div className="grid grid-cols-2 gap-2">
                {categories.filter(cat => cat !== 'All').map(cat => {
                  const isActive = filters.categories?.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleArrayFilter('categories', cat)}
                      className={`relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border text-left ${isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2 text-indigo-600 dark:text-indigo-400">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                      {cat || 'Uncategorized'}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Access Type - Merged with Pricing */}
          <section>
            <button
              onClick={() => toggleSection('access')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Zap size={14} /> Access & Pricing
                {filters.access?.length > 0 && (
                  <span className="text-indigo-600 dark:text-indigo-400">({filters.access.length})</span>
                )}
              </h3>
              {expandedSections.access ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections.access && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'open_source', label: 'Open Source', icon: '🔓' },
                  { id: 'api_only', label: 'API Only', icon: '🔐' },
                  { id: 'hybrid', label: 'Hybrid', icon: '🔀' }
                ].map(opt => {
                  const isActive = filters.access?.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleArrayFilter('access', opt.id)}
                      className={`relative px-2 py-2.5 rounded-xl border text-center transition-all duration-200 ${isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute top-1.5 right-1.5 text-indigo-600 dark:text-indigo-400">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div className="text-base mb-0.5">{opt.icon}</div>
                      <div className={`font-semibold text-[10px] ${isActive ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Tier Filter */}
          <section>
            <button
              onClick={() => toggleSection('tier')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Layers size={14} /> Organization Tier
                {filters.tier?.length > 0 && (
                  <span className="text-indigo-600 dark:text-indigo-400">({filters.tier.length})</span>
                )}
              </h3>
              {expandedSections.tier ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections.tier && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tier_1', label: 'Tier 1', desc: 'Major' },
                  { id: 'tier_2', label: 'Tier 2', desc: 'Mid-size' },
                  { id: 'tier_3', label: 'Tier 3', desc: 'Research' }
                ].map(opt => {
                  const isActive = filters.tier?.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleArrayFilter('tier', opt.id)}
                      className={`relative px-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${isActive
                        ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 dark:border-purple-500 text-purple-900 dark:text-purple-100'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-700'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute top-1.5 right-1.5 text-purple-600 dark:text-purple-400">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div className="pr-3">{opt.label}</div>
                      <div className="text-[10px] opacity-70">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Organizations Filter */}
          <section>
            <button
              onClick={() => toggleSection('organizations')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Building2 size={14} /> Organizations
                {filters.organizations?.length > 0 && (
                  <span className="text-indigo-600 dark:text-indigo-400">({filters.organizations.length})</span>
                )}
              </h3>
              {expandedSections.organizations ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections.organizations && (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {organizations.map(org => {
                  const isActive = filters.organizations?.includes(org);
                  return (
                    <button
                      key={org}
                      onClick={() => toggleArrayFilter('organizations', org)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border text-left flex items-center gap-2 ${isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700'
                        }`}
                    >
                      {isActive && (
                        <Check size={14} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      )}
                      <span className="truncate">{org}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Parameters Range */}
          <section>
            <button
              onClick={() => toggleSection('parameters')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Cpu size={14} /> Parameters
                {(filters.parameters?.min || filters.parameters?.max) && (
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                )}
              </h3>
              {expandedSections.parameters ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections.parameters && (
              <div className="space-y-3 px-1">
                {/* Interactive Range Slider */}
                <div className="relative pt-2">
                  {/* Scale markers */}
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-3 px-1">
                    <span>1B</span>
                    <span>6B</span>
                    <span>12B</span>
                    <span>32B</span>
                    <span>128B</span>
                    <span>500B</span>
                  </div>

                  {/* Slider track with selected range visualization */}
                  <div className="relative h-2 mb-4">
                    {/* Background track */}
                    <div className="absolute w-full h-1.5 top-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-700 rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-20 rounded-full"></div>
                    </div>

                    {/* Selected range highlight */}
                    <div
                      className="absolute h-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                      style={{
                        left: `${((filters.parameters?.min ? [1, 6, 12, 32, 128, 500].indexOf(filters.parameters.min) : 0) / 5) * 100}%`,
                        right: `${100 - ((filters.parameters?.max ? [1, 6, 12, 32, 128, 500].indexOf(filters.parameters.max) : 5) / 5) * 100}%`
                      }}
                    ></div>

                    {/* Min handle slider */}
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={filters.parameters?.min ? [1, 6, 12, 32, 128, 500].indexOf(filters.parameters.min) : 0}
                      onChange={(e) => {
                        const index = parseInt(e.target.value);
                        const paramValues = [1, 6, 12, 32, 128, 500];
                        const newMin = paramValues[index];
                        const currentMax = filters.parameters?.max || 500;
                        const maxIndex = paramValues.indexOf(currentMax);

                        // Ensure min doesn't exceed max
                        if (index <= maxIndex) {
                          handleChange('parameters', {
                            min: newMin,
                            max: currentMax
                          });
                        }
                      }}
                      className="absolute w-full h-2 top-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                      style={{ zIndex: filters.parameters?.min === filters.parameters?.max ? 5 : 3 }}
                    />

                    {/* Max handle slider */}
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={filters.parameters?.max ? [1, 6, 12, 32, 128, 500].indexOf(filters.parameters.max) : 5}
                      onChange={(e) => {
                        const index = parseInt(e.target.value);
                        const paramValues = [1, 6, 12, 32, 128, 500];
                        const newMax = paramValues[index];
                        const currentMin = filters.parameters?.min || 1;
                        const minIndex = paramValues.indexOf(currentMin);

                        // Ensure max doesn't go below min
                        if (index >= minIndex) {
                          handleChange('parameters', {
                            min: currentMin,
                            max: newMax
                          });
                        }
                      }}
                      className="absolute w-full h-2 top-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                      style={{ zIndex: 4 }}
                    />
                  </div>

                  {/* Current selection display */}
                  {(filters.parameters?.min || filters.parameters?.max) && (
                    <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {filters.parameters?.min || 1}B - {filters.parameters?.max || 500}B
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Downloads Range */}
          <section>
            <button
              onClick={() => toggleSection('downloads')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <TrendingUp size={14} /> Downloads
                {(filters.downloads?.min || filters.downloads?.max) && (
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                )}
              </h3>
              {expandedSections.downloads ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections.downloads && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Min downloads</label>
                  <input
                    type="number"
                    value={filters.downloads?.min || ''}
                    onChange={(e) => handleRangeChange('downloads', 'min', e.target.value)}
                    placeholder="e.g., 1000"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Max downloads</label>
                  <input
                    type="number"
                    value={filters.downloads?.max || ''}
                    onChange={(e) => handleRangeChange('downloads', 'max', e.target.value)}
                    placeholder="e.g., 1000000"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Likes Range */}
          <section>
            <button
              onClick={() => toggleSection('likes')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Heart size={14} /> Likes
                {(filters.likes?.min || filters.likes?.max) && (
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                )}
              </h3>
              {expandedSections.likes ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections.likes && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Min likes</label>
                  <input
                    type="number"
                    value={filters.likes?.min || ''}
                    onChange={(e) => handleRangeChange('likes', 'min', e.target.value)}
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Max likes</label>
                  <input
                    type="number"
                    value={filters.likes?.max || ''}
                    onChange={(e) => handleRangeChange('likes', 'max', e.target.value)}
                    placeholder="e.g., 10000"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex-shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-20 flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
          <button
            onClick={() => {
              onFilterChange({});
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all text-sm"
          >
            Show {counts?.total > 0 ? `${counts.total} ` : ''}Models
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModelFilters;
