import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { dbHelpers } from "../lib/supabase";
import { Search, Clock, ArrowLeft, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { ErrorState } from "../components/EmptyState";

const SearchHistoryPage = () => {
  const { t } = useTranslation('search');
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all search history
  const { data: searchesData, isLoading, error: searchesError } = useQuery({
    queryKey: ["search-history", user?.id, "all"],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      return await dbHelpers.getRecentSearches(user.id, 100);
    },
    enabled: !!user?.id,
  });

  const searches = searchesData?.data || [];

  const handleSearchClick = (query) => {
    // Navigate to search results page with query
    // Assuming we have a search page or we can navigate to home with search param
    // For now, let's navigate to home with search query param
    navigate(`/?q=${encodeURIComponent(query)}`);
  };

  const handleClearAll = async () => {
    if (!user?.id) return;
    try {
      await dbHelpers.clearSearchHistory(user.id);
      queryClient.invalidateQueries({ queryKey: ["search-history", user.id] });
      showToast(t('page.toast.cleared'), "success");
    } catch (error) {
      console.error("Error clearing search history:", error);
      showToast(t('page.toast.errorClear'), "error");
    }
  };

  const handleDeleteSearch = async (searchId) => {
    if (!user?.id) return;
    try {
      // Note: We need to add a delete function for individual searches
      // For now, we'll clear all and re-add except the deleted one
      // This is a temporary solution - ideally we'd have a deleteById function
      const remainingSearches = searches.filter(s => s.id !== searchId);
      await dbHelpers.clearSearchHistory(user.id);
      // Re-add remaining searches (this is not ideal but works for now)
      for (const search of remainingSearches) {
        await dbHelpers.saveSearchHistory(user.id, search.query);
      }
      queryClient.invalidateQueries({ queryKey: ["search-history", user.id] });
      showToast(t('page.toast.removed'), "success");
    } catch (error) {
      console.error("Error deleting search:", error);
      showToast(t('page.toast.errorRemove'), "error");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('page.time.justNow');
    if (diffMins < 60) return t('page.time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('page.time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('page.time.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 max-w-md">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 w-fit mx-auto mb-6">
            <Search size={40} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('page.signInRequired')}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{t('page.signInMessage')}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
          >
            {t('page.goBack')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 pb-24 bg-gradient-to-br from-white via-indigo-50/20 via-violet-50/10 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:via-violet-950/10 dark:to-slate-800">
      <Hero
        title={t('page.title')}
        subtitle={searches.length !== 1 ? t('page.subtitle.countPlural', { count: searches.length }) : t('page.subtitle.count', { count: searches.length })}
        icon={<Search size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate(-1)}
        useArrowLeft={true}
        rightActions={
          searches.length > 0 && (
            <button
              onClick={handleClearAll}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Trash2 size={16} className="relative z-10" />
              <span className="relative z-10">{t('page.clearAll')}</span>
            </button>
          )
        }
      />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-5"></div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('page.loading')}</p>
          </div>
        ) : searchesError ? (
          <ErrorState
            title={t('page.errors.loadFailed', { defaultValue: 'Failed to load search history' })}
            description={searchesError?.message || t('page.errors.loadFailedDescription', { defaultValue: 'Unable to load your search history. Please try again.' })}
            error={searchesError}
            onRetry={() => queryClient.invalidateQueries({ queryKey: ["search-history", user?.id, "all"] })}
          />
        ) : searches.length === 0 ? (
          <div className="text-center py-32 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 w-fit mx-auto mb-8 shadow-lg">
              <Search size={56} className="text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {t('page.empty.title')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('page.empty.description')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {searches.map((search) => (
              <div
                key={search.id}
                className="group relative h-full transform transition-all duration-500 hover:scale-[1.01]"
              >
                <div
                  className="relative h-full overflow-hidden rounded-3xl border bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 shadow-md shadow-slate-500/5 dark:shadow-slate-900/10 hover:shadow-lg hover:shadow-slate-500/10 dark:hover:shadow-slate-900/20 hover:-translate-y-0.5 backdrop-blur-sm cursor-pointer"
                  onClick={() => handleSearchClick(search.query)}
                >
                  {/* Gradient hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/50 to-indigo-50/0 dark:from-indigo-900/0 dark:via-indigo-900/15 dark:to-indigo-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Header Section */}
                    <div className="flex items-start gap-4 mb-3">
                      {/* Icon Container */}
                      <div className="flex-shrink-0 relative transition-transform duration-500 group-hover:scale-105">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/30 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:shadow-indigo-500/50">
                          <Search size={20} className="text-white" />
                        </div>
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 line-clamp-2 mb-1">
                          {search.query}
                        </h3>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSearch(search.id, search.query);
                        }}
                        className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title={t('page.removeSearch')}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 group-hover:border-indigo-100 dark:group-hover:border-indigo-800/30 transition-colors duration-500 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-400 dark:text-slate-500" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatTime(search.created_at)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatFullDate(search.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistoryPage;
