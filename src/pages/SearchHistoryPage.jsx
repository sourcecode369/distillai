import React, { useState, useEffect, useMemo } from "react";
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
import SEO from "../components/SEO";

const SearchHistoryPage = () => {
  const { t } = useTranslation('search');
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Mouse tracking for dynamic gradients
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Memoized particle configurations
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)],
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.5,
      color: i % 3 === 0 ? 'from-indigo-400 to-violet-400' : i % 3 === 1 ? 'from-violet-400 to-pink-400' : 'from-pink-400 to-indigo-400'
    }));
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center p-10 bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 max-w-md">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-violet-900/30 w-fit mx-auto mb-6">
            <Search size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-200 mb-3">{t('page.signInRequired')}</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">{t('page.signInMessage')}</p>
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
    <>
      <SEO
        title={t('page.title')}
        description={t('page.subtitle.countPlural', { count: searches.length })}
        url="/search-history"
      />

      <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-24">
        {/* Dynamic gradient orbs */}
        <div
          className="pointer-events-none absolute -z-10 opacity-40 blur-3xl transition-all duration-700"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -z-10 opacity-30 blur-3xl transition-all duration-1000"
          style={{
            left: `${100 - mousePosition.x}%`,
            top: `${100 - mousePosition.y}%`,
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          {particles.map((particle, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-gradient-to-br ${particle.color}`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              }}
            />
          ))}
        </div>

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
            <p className="text-sm font-medium text-slate-400">{t('page.loading')}</p>
          </div>
        ) : searchesError ? (
          <ErrorState
            title={t('page.errors.loadFailed', { defaultValue: 'Failed to load search history' })}
            description={searchesError?.message || t('page.errors.loadFailedDescription', { defaultValue: 'Unable to load your search history. Please try again.' })}
            error={searchesError}
            onRetry={() => queryClient.invalidateQueries({ queryKey: ["search-history", user?.id, "all"] })}
          />
        ) : searches.length === 0 ? (
          <div className="text-center py-32 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-xl">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-violet-900/20 w-fit mx-auto mb-8 shadow-lg">
              <Search size={56} className="text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3">
              {t('page.empty.title')}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('page.empty.description')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {searches.map((search) => (
              <div
                key={search.id}
                className="group relative h-full"
              >
                <div
                  className="relative h-full overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm hover:border-transparent cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => handleSearchClick(search.query)}
                >
                  {/* Animated gradient border on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-[length:200%_200%] animate-gradient-shift p-[1px] -z-10">
                    <div className="h-full w-full rounded-2xl bg-slate-900/95" />
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Enhanced shadow on hover */}
                  <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-indigo-500/0 group-hover:shadow-indigo-500/20 transition-all duration-300 pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header Section */}
                    <div className="flex items-start gap-4 mb-3">
                      {/* Icon Container */}
                      <div className="flex-shrink-0 relative transition-transform duration-500 group-hover:scale-110">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/30 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:shadow-indigo-500/50">
                          {/* Icon glow effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all duration-500 blur-xl" />
                          <div className="relative"><Search size={20} className="text-white" /></div>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg lg:text-xl font-semibold text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300 line-clamp-2 mb-1">
                          {search.query}
                        </h3>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSearch(search.id, search.query);
                        }}
                        className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title={t('page.removeSearch')}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-800/50 group-hover:border-indigo-800/30 transition-colors duration-500 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-500" />
                          <span className="text-xs text-slate-400">
                            {formatTime(search.created_at)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
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
    </>
  );
};

export default SearchHistoryPage;
