import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { dbHelpers } from "../lib/supabase";
import { Search, Clock, ArrowRight, X } from "lucide-react";
import { buildSearchIndex } from "../utils/globalSearch";
import { useNavigate } from "react-router-dom";

const SearchDropdown = ({
  onClose,
  onSearch,
  searchQuery = "",
  onQueryChange,
  suggestions = []
}) => {
  const { t } = useTranslation('search');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch recent searches (only 3 for dropdown)
  const { data: recentSearchesData, isLoading } = useQuery({
    queryKey: ["search-history", user?.id, "recent"],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      return await dbHelpers.getRecentSearches(user.id, 3);
    },
    enabled: !!user?.id,
  });

  // Get total count to show "View all" if there are more
  const { data: totalCountData } = useQuery({
    queryKey: ["search-history-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return { count: 0 };
      const result = await dbHelpers.getRecentSearches(user.id, 100);
      return { count: result?.data?.length || 0 };
    },
    enabled: !!user?.id,
  });

  const recentSearches = recentSearchesData?.data || [];
  const totalCount = totalCountData?.count || 0;
  const hasMore = totalCount > 3;

  // Only sync from parent if it's different and we're not actively typing
  const prevSearchQueryRef = useRef(searchQuery);
  useEffect(() => {
    if (searchQuery !== prevSearchQueryRef.current) {
      setLocalQuery(searchQuery);
      prevSearchQueryRef.current = searchQuery;
    }
  }, [searchQuery]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Generate autocomplete suggestions from search index
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!localQuery || !localQuery.trim() || localQuery.length < 2) {
        setAutocompleteSuggestions([]);
        return;
      }

      try {
        const index = await buildSearchIndex();
        const query = localQuery.toLowerCase().trim();
        const suggestionsSet = new Set();

        // Get suggestions from topics
        index.topics.forEach((topic) => {
          const title = topic.title.toLowerCase();

          if (title.includes(query) && title.length > query.length) {
            // Extract potential completion
            const matchIndex = title.indexOf(query);
            if (matchIndex === 0) {
              // Query is at the start, suggest the full title
              suggestionsSet.add(topic.title);
            }
          }
        });

        // Get suggestions from categories
        index.categories.forEach((category) => {
          const title = category.title.toLowerCase();
          if (title.includes(query) && title.length > query.length) {
            const matchIndex = title.indexOf(query);
            if (matchIndex === 0) {
              suggestionsSet.add(category.title);
            }
          }
        });

        // Convert to array and limit to 5
        const suggestionsArray = Array.from(suggestionsSet).slice(0, 5);
        setAutocompleteSuggestions(suggestionsArray);
      } catch (error) {
        console.error("Error generating autocomplete suggestions:", error);
        setAutocompleteSuggestions([]);
      }
    };

    const timer = setTimeout(generateSuggestions, 200);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSearch = (query) => {
    if (!query || !query.trim()) return;

    const trimmedQuery = query.trim();

    // Update the search query in parent FIRST (synchronously)
    if (onQueryChange) {
      onQueryChange(trimmedQuery);
    }

    // Save to search history if user is logged in (async, don't wait)
    if (user?.id) {
      dbHelpers.saveSearchHistory(user.id, trimmedQuery).catch(console.error);
      queryClient.invalidateQueries({ queryKey: ["search-history", user.id] });
    }

    // Clear the local input
    setLocalQuery("");

    // Close dropdown
    onClose();

    // Trigger search navigation - use setTimeout to ensure state is updated
    if (onSearch) {
      // Use requestAnimationFrame to ensure React state has updated
      requestAnimationFrame(() => {
        onSearch(trimmedQuery);
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && localQuery.trim()) {
      e.preventDefault();
      handleSearch(localQuery);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleRecentSearchClick = (e, query) => {
    e.stopPropagation();
    handleSearch(query);
  };

  const handleViewAll = () => {
    navigate('/search-history');
    onClose();
  };

  const handleClearRecent = async (e) => {
    e.stopPropagation();
    if (!user?.id) return;
    try {
      await dbHelpers.clearSearchHistory(user.id);
      queryClient.invalidateQueries({ queryKey: ["search-history", user.id] });
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('dropdown.time.justNow');
    if (diffMins < 60) return t('dropdown.time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('dropdown.time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('dropdown.time.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  // Combine provided suggestions with autocomplete suggestions
  const allSuggestions = useMemo(() => {
    const combined = [...suggestions, ...autocompleteSuggestions];
    // Remove duplicates
    return [...new Set(combined)].slice(0, 5);
  }, [suggestions, autocompleteSuggestions]);

  return (
    <div
      ref={dropdownRef}
      data-search-dropdown
      className="w-full sm:w-96 bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 opacity-50 blur-xl pointer-events-none" />

      {/* Header */}
      <div className="relative p-5 border-b border-slate-800/50 bg-gradient-to-r from-indigo-900/30 via-violet-900/20 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
            <Search size={18} className="text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100">{t('dropdown.title')}</h3>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative p-4 border-b border-slate-800/50">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              if (onQueryChange) onQueryChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            placeholder={t('dropdown.placeholder')}
            className="w-full pl-10 pr-10 py-2.5 border border-slate-700/50 rounded-xl bg-slate-900/60 backdrop-blur-sm text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          {localQuery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLocalQuery("");
                if (onQueryChange) onQueryChange("");
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-h-[420px] overflow-y-auto">
        {/* Autocomplete Suggestions */}
        {localQuery.trim() && allSuggestions.length > 0 && (
          <div className="relative p-2">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('dropdown.suggestions')}
            </div>
            {allSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full group relative px-4 py-2.5 cursor-pointer transition-all duration-300 rounded-xl hover:bg-slate-800/50 overflow-hidden text-left border border-transparent hover:border-indigo-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Search size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">
                    {suggestion}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        {!localQuery.trim() && (
          <>
            {isLoading ? (
              <div className="relative p-10 text-center">
                <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-sm text-slate-400">{t('dropdown.loading')}</p>
              </div>
            ) : recentSearches.length === 0 ? (
              <div className="relative p-10 text-center flex flex-col items-center justify-center">
                <div className="p-3 rounded-xl bg-slate-800/60 w-fit mb-4 flex items-center justify-center border border-slate-700/50">
                  <Search size={20} className="text-slate-500" />
                </div>
                <p className="text-sm text-slate-400">{t('dropdown.empty.title')}</p>
                <p className="text-xs text-slate-500 mt-1">{t('dropdown.empty.description')}</p>
              </div>
            ) : (
              <div className="relative">
                <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/50">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {t('dropdown.recentSearches')}
                  </div>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearRecent(e);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800/50"
                    >
                      {t('dropdown.clear')}
                    </button>
                  )}
                </div>
                {recentSearches.slice(0, 3).map((search, index) => (
                  <div
                    key={search.id}
                    className={`group relative px-4 py-2.5 cursor-pointer transition-all duration-300 border-b border-slate-800/30 last:border-b-0 overflow-hidden hover:bg-slate-800/50`}
                    onClick={(e) => handleRecentSearchClick(e, search.query)}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/60 text-slate-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-300 border border-slate-700/50 group-hover:border-indigo-500/30">
                          <Clock size={14} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-slate-300 group-hover:text-indigo-300 transition-colors truncate text-left">
                            {search.query}
                          </p>
                          <span className="text-[10px] text-slate-500 text-left block">
                            {formatTime(search.created_at)}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer - Show if there are searches or more available */}
      {!localQuery.trim() && (recentSearches.length > 0 || hasMore) && (
        <div className="relative px-4 py-3 border-t border-slate-800/50">
          <button
            onClick={handleViewAll}
            onMouseDown={(e) => e.stopPropagation()}
            className="group w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-all duration-300 py-2.5 rounded-xl relative overflow-hidden border border-transparent hover:border-indigo-500/30 hover:bg-slate-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">{hasMore ? t('dropdown.viewAllCount', { count: totalCount }) : t('dropdown.viewAll')}</span>
            <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(SearchDropdown, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onSearch === nextProps.onSearch &&
    prevProps.onQueryChange === nextProps.onQueryChange
  );
});

SearchDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  onQueryChange: PropTypes.func,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      categoryId: PropTypes.string,
      topicId: PropTypes.string,
      type: PropTypes.string,
    })
  ),
};
