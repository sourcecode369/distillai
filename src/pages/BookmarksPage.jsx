import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Tag, Folder, ArrowRight, Clock, X, Search, Loader2, AlertCircle } from "lucide-react";
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

const BookmarksPage = () => {
  const { t } = useTranslation('bookmark');
  const { showToast } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

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
      return (data || []).map((b) => ({
        id: `${b.category_id}-${b.topic_id}`,
        type: "topic",
        categoryId: b.category_id,
        topicId: b.topic_id,
        title: b.title,
        categoryTitle: b.category_title,
        timestamp: new Date(b.created_at).getTime(),
        tags: b.tags || [],
      }));
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

  const handleBookmarkClick = async (bookmark) => {
    navigate(`/topic/${bookmark.categoryId}/${bookmark.topicId}`);
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
    <div className="min-h-screen relative z-10 pb-24 bg-gradient-to-br from-white via-indigo-50/20 via-violet-50/10 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:via-violet-950/10 dark:to-slate-800">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('page.searchPlaceholder')}
                    className="w-full pl-12 pr-12 py-3 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {t('page.filterByTag')}
                    </span>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${selectedTag === null
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-700"
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
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-700"
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
              <div className="text-center py-32 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 w-fit mx-auto mb-8 shadow-lg">
                  <Bookmark size={56} className="text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('page.empty.title')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {t('page.empty.description')}
                </p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="text-center py-32 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 w-fit mx-auto mb-8 shadow-lg">
                  <Search size={56} className="text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {t('page.emptySearch.title')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {t('page.emptySearch.description')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {filteredBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="group relative h-full transform transition-all duration-500 hover:scale-[1.01]"
                  >
                    <div
                      className="relative h-full overflow-hidden rounded-3xl border bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 shadow-md shadow-slate-500/5 dark:shadow-slate-900/10 hover:shadow-lg hover:shadow-slate-500/10 dark:hover:shadow-slate-900/20 hover:-translate-y-0.5 backdrop-blur-sm cursor-pointer"
                      onClick={() => handleBookmarkClick(bookmark)}
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
                              <BookmarkCheck size={20} className="text-white" />
                            </div>
                          </div>

                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 line-clamp-2 mb-1">
                              {bookmark.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                              {bookmark.categoryTitle}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bookmark)}
                            disabled={removeBookmarkMutation.isPending}
                            className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={t('page.removeBookmark')}
                          >
                            {removeBookmarkMutation.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <X size={16} />
                            )}
                          </button>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 group-hover:border-indigo-100 dark:group-hover:border-indigo-800/30 transition-colors duration-500 mt-auto">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock size={12} className="text-slate-400 dark:text-slate-500" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {formatTime(bookmark.timestamp)}
                              </span>
                            </div>
                            <ArrowRight
                              size={14}
                              className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300"
                            />
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
  );
};

export default BookmarksPage;
