import React from 'react';
import { X, Check, DollarSign, Cpu, Layers, Zap, Filter } from 'lucide-react';

const ModelFilters = ({
  filters,
  onFilterChange,
  isOpen,
  onClose,
  counts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = []
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Filter className="text-indigo-600 dark:text-indigo-400" size={22} fill="currentColor" fillOpacity={0.2} />
              Filters
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
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">

          {/* Category Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
              <Layers size={14} /> Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${selectedCategory === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                >
                  {cat || 'Uncategorized'}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Access Type Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
              <Zap size={14} /> Access
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'open_source', label: 'Open Source', desc: 'Code available' },
                { id: 'api', label: 'API Only', desc: 'Hosted access' }
              ].map(opt => {
                const isActive = filters.access?.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleArrayFilter('access', opt.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 ${isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-500 ring-1 ring-indigo-500 dark:ring-indigo-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute top-3 right-3 text-indigo-600 dark:text-indigo-400">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                    <div className={`font-semibold text-sm mb-0.5 ${isActive ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-slate-200'}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Context Window & Parameters */}
          <div className="grid grid-cols-1 gap-8">
            {/* Context Window */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                <Layers size={14} /> Context Window
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: '4k', label: '< 8k Tokens' },
                  { id: '8k', label: '8k - 32k' },
                  { id: '32k', label: '32k - 128k' },
                  { id: '128k', label: '128k+' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleArrayFilter('context', opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border transition-all duration-200 ${filters.context?.includes(opt.id)
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Parameters */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                <Cpu size={14} /> Parameters
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'xs', label: '< 7B' },
                  { id: 's', label: '7B - 13B' },
                  { id: 'm', label: '14B - 34B' },
                  { id: 'l', label: '35B - 70B' },
                  { id: 'xl', label: '70B+' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleArrayFilter('params', opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border transition-all duration-200 ${filters.params?.includes(opt.id)
                      ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-700'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Pricing */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
              <DollarSign size={14} /> Pricing
            </h3>
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'free', label: 'Free' },
                { id: 'paid', label: 'Paid API' }
              ].map(opt => {
                const isActive = filters.pricing?.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleArrayFilter('pricing', opt.id)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-4"></div> {/* Bottom Spacer */}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 z-10 flex gap-4">
          <button
            onClick={() => {
              onFilterChange({});
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-6 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
          >
            Show {counts?.total > 0 ? `${counts.total} ` : ''}Models
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModelFilters;
