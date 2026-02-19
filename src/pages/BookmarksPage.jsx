import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bookmark, Tag, ArrowRight, Clock, X, Search, Loader2, AlertCircle, FileText } from "lucide-react";
import Hero from "../components/Hero";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/LoadingSkeleton";
import { ErrorState } from "../components/EmptyState";
import { loadCategory } from "../utils/dataLoader";
import { loadTopic as loadTopicFromDB } from "../utils/topicLoader";
import { dbHelpers } from "../lib/supabase";
import SEO from "../components/SEO";

const BookmarksPage = () => {
  const { t } = useTranslation('bookmark');
  const { showToast } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
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

  // Fetch bookmarks using React Query
  const {
    data: bookmarksData,
    isLoading: loadingBookmarks,
    error: bookmarksError,
  } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await dbHelpers.getBookmarks(user.id);

      if (error) {
        console.error("Error loading bookmarks:", error);
        throw error;
      }

      // Format bookmarks to match expected structure
      return (data || []).map((b) => {
        const itemId = b.item_id || `${b.category_id}-${b.topic_id}`;
        const bookmark = {
          id: itemId,
          type: b.type || "topic",
          title: b.title,
          categoryTitle: b.category_title,
          timestamp: new Date(b.created_at).getTime(),
          tags: b.tags || [],
        };

        // Add type-specific fields
        if (b.type === 'topic' || !b.type) {
          bookmark.categoryId = b.category_id;
          bookmark.topicId = b.topic_id;
        }

        return bookmark;
      });
    },
    enabled: !!user?.id,
  });

  const bookmarks = useMemo(() => bookmarksData || [], [bookmarksData]);

  // Mutation for removing bookmarks
  const removeBookmarkMutation = useMutation({
    mutationFn: async ({ categoryId, topicId }) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { error } = await dbHelpers.removeBookmark(user.id, categoryId, topicId);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate bookmarks query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] });
      showToast(t('page.toast.removed'), "info");
    },
    onError: (error) => {
      console.error("Error removing bookmark:", error);
      showToast(t('page.toast.removeFailed', { defaultValue: 'Failed to remove bookmark' }), "error");
    },
  });

  // Get unique tags from bookmarks (if tags are implemented)
  const allTags = useMemo(() => {
    const tags = new Set();
    bookmarks.forEach((bookmark) => {
      if (bookmark.tags && Array.isArray(bookmark.tags)) {
        bookmark.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [bookmarks]);

  // Filter bookmarks based on search and tag
  const filteredBookmarks = useMemo(() => {
    let filtered = [...bookmarks];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.categoryTitle.toLowerCase().includes(query)
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(
        (b) => b.tags && b.tags.includes(selectedTag)
      );
    }

    // Sort by timestamp (most recent first)
    return filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [bookmarks, searchQuery, selectedTag]);

  const handleBookmarkClick = (bookmark) => {
    if (bookmark.categoryId && bookmark.topicId) {
      navigate(`/topic/${bookmark.categoryId}/${bookmark.topicId}`);
    } else {
      showToast("Could not navigate to bookmark", "error");
    }
  };

  const handleRemoveBookmark = (e, bookmark) => {
    e.stopPropagation();
    removeBookmarkMutation.mutate({
      categoryId: bookmark.categoryId,
      topicId: bookmark.topicId,
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return t('page.time.recently');
    const date = new Date(timestamp);
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

  return (
    <>
      <SEO
        title={t('page.title')}
        description={t('page.subtitle.countPlural', { count: bookmarks.length })}
        url="/bookmarks"
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
          subtitle={
            loadingBookmarks
              ? t('page.loading', { defaultValue: 'Loading...' })
              : bookmarks.length !== 1
                ? t('page.subtitle.countPlural', { count: bookmarks.length })
                : t('page.subtitle.count', { count: bookmarks.length })
          }
          icon={<Bookmark size={22} className="text-white drop-shadow-sm" />}
          onBack={() => navigate(-1)}
          useArrowLeft={true}
        />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loadingBookmarks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : bookmarksError ? (
          <ErrorState
            title={t('page.errors.loadFailed', { defaultValue: 'Failed to load bookmarks' })}
            description={bookmarksError?.message || t('page.errors.loadFailedDescription', { defaultValue: 'There was an error loading your bookmarks. Please try again.' })}
            error={bookmarksError}
            onRetry={() => queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] })}
          />
        ) : (
          <>
            {/* Search and Filter Bar */}
            {bookmarks.length > 0 && (
              <div className="mb-8 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('page.searchPlaceholder')}
                    className="w-full pl-12 pr-12 py-3 border border-slate-800/50 rounded-2xl bg-slate-900/60 backdrop-blur-sm text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-400">
                      {t('page.filterByTag')}
                    </span>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${selectedTag === null
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                          : "bg-slate-900/60 text-slate-400 hover:bg-indigo-900/20 border border-slate-800/50"
                        }`}
                    >
                      {t('page.all')}
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${selectedTag === tag
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                            : "bg-slate-900/60 text-slate-400 hover:bg-indigo-900/20 border border-slate-800/50"
                          }`}
                      >
                        <Tag size={12} />
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookmarks Grid */}
            {bookmarks.length === 0 ? (
              <div className="text-center py-32 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-xl">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-violet-900/20 w-fit mx-auto mb-8 shadow-lg">
                  <Bookmark size={56} className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3">
                  {t('page.empty.title')}
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  {t('page.empty.description')}
                </p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="text-center py-32 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-xl">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-violet-900/20 w-fit mx-auto mb-8 shadow-lg">
                  <Search size={56} className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3">
                  {t('page.emptySearch.title')}
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  {t('page.emptySearch.description')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {filteredBookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="group relative h-full">
                    <div
                      className="relative h-full overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm hover:border-transparent cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => handleBookmarkClick(bookmark)}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 p-[1px] -z-10">
                        <div className="h-full w-full rounded-2xl bg-slate-900/95" />
                      </div>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                            <FileText size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg lg:text-xl font-semibold text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300 line-clamp-2 mb-1">
                              {bookmark.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {bookmark.categoryTitle}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmark)}
                            disabled={removeBookmarkMutation.isPending}
                            className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={t('page.removeBookmark')}
                          >
                            {removeBookmarkMutation.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <X size={16} />
                            )}
                          </button>
                        </div>
                        <div className="pt-3 border-t border-slate-800/50 group-hover:border-indigo-800/30 transition-colors duration-500 mt-auto">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock size={12} className="text-slate-500" />
                              <span className="text-xs text-slate-400">
                                {formatTime(bookmark.timestamp)}
                              </span>
                            </div>
                            <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default BookmarksPage;
