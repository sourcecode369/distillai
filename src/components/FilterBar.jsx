import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const FilterBar = ({ filters, onFilterChange, availableTags, availableDifficulties }) => {
  const { selectedTags, selectedDifficulty } = filters;
  const [showAllTags, setShowAllTags] = useState(false);
  const maxVisibleTags = 6;

  // Memoize filter handlers to prevent recreating on every render
  // These are used in map functions, so stable references prevent unnecessary re-renders
  const toggleTag = useCallback((tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onFilterChange({ ...filters, selectedTags: newTags });
  }, [selectedTags, filters, onFilterChange]);

  const toggleDifficulty = useCallback((difficulty) => {
    const newDifficulty = selectedDifficulty === difficulty ? null : difficulty;
    onFilterChange({ ...filters, selectedDifficulty: newDifficulty });
  }, [selectedDifficulty, filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    onFilterChange({ selectedTags: [], selectedDifficulty: null });
  }, [onFilterChange]);

  const hasActiveFilters = selectedTags.length > 0 || selectedDifficulty;
  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, maxVisibleTags);
  const hasMoreTags = availableTags.length > maxVisibleTags;

  if (availableTags.length === 0 && availableDifficulties.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 w-full max-w-5xl">
      <div className="flex items-start gap-8 flex-wrap">
        {availableDifficulties && availableDifficulties.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
              <Filter size={13} className="text-indigo-500 dark:text-indigo-400" />
              <span>Difficulty</span>
            </div>
            <div className="flex gap-1.5">
              {availableDifficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    selectedDifficulty === difficulty
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                  }`}
                  aria-pressed={selectedDifficulty === difficulty}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableTags && availableTags.length > 0 && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                <span>Tags</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {visibleTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                    }`}
                    aria-pressed={selectedTags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
                {hasMoreTags && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center gap-1 transition-all duration-300"
                  >
                    {showAllTags ? (
                      <>
                        <ChevronUp size={12} />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={12} />
                        +{availableTags.length - maxVisibleTags}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 whitespace-nowrap"
            aria-label="Clear all filters"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.shape({
    selectedTags: PropTypes.arrayOf(PropTypes.string),
    selectedDifficulty: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
  availableDifficulties: PropTypes.arrayOf(PropTypes.string),
};

export default FilterBar;

