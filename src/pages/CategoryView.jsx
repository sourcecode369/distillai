import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Sparkles, Search, Loader2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import BookmarkButton from "../components/BookmarkButton";
import FilterBar from "../components/FilterBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { CardSkeleton } from "../components/LoadingSkeleton";
import { EmptyTopics, EmptySearch, ErrorState } from "../components/EmptyState";
import { TopicCard } from "../components/Card";
import Hero from "../components/Hero";
import { dbHelpers } from "../lib/supabase";
import { loadTopicsForCategory } from "../utils/topicLoader";
import { loadSectionsWithCategories } from "../utils/dataLoader";
import { translateSectionsWithCategories } from "../utils/translateContent";
import SEO from "../components/SEO";

const CategoryView = () => {
  const { t } = useTranslation('handbook');
  const { addToHistory } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [filters, setFilters] = useState({ selectedTags: [], selectedDifficulty: null });

  // Fetch sections to get category metadata
  const { data: sectionsData } = useQuery({
    queryKey: ["sections-with-categories"],
    queryFn: loadSectionsWithCategories,
  });

  // Find the category from sections
  const category = useMemo(() => {
    if (!sectionsData) return null;
    const translatedSections = translateSectionsWithCategories(sectionsData, t);
    for (const section of translatedSections) {
      const found = section.categories.find(c => c.id === categoryId || c.category_id === categoryId);
      if (found) return found;
    }
    return null;
  }, [sectionsData, categoryId, t]);

  // Load topics from database using React Query
  const {
    data: topics = [],
    isLoading: loadingTopics,
    error: topicsError,
  } = useQuery({
    queryKey: ["topics", categoryId],
    queryFn: () => loadTopicsForCategory(categoryId),
    enabled: !!categoryId,
  });

  // Fetch completed topics using React Query
  const {
    data: progressData,
  } = useQuery({
    queryKey: ["category-progress", user?.id, categoryId],
    queryFn: async () => {
      if (!user?.id || !categoryId) return null;
      const { data } = await dbHelpers.getCategoryProgress(user.id, categoryId);
      return data;
    },
    enabled: !!user?.id && !!categoryId,
  });

  // Convert progress data to Set for efficient lookups
  const completedTopics = useMemo(() => {
    if (!progressData) return new Set();
    return new Set(progressData.map((p) => p.topic_id));
  }, [progressData]);

  // Get all unique tags and difficulties
  const allTags = useMemo(() => {
    const tags = new Set();
    topics.forEach((topic) => topic.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [topics]);

  const allDifficulties = useMemo(() => {
    const difficulties = new Set();
    topics.forEach((topic) => {
      if (topic.difficulty) difficulties.add(topic.difficulty);
    });
    return Array.from(difficulties);
  }, [topics]);

  // Filter topics based on search query and filters
  const filteredTopics = useMemo(() => {
    let filtered = topics;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.description.toLowerCase().includes(query) ||
          topic.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((topic) =>
        filters.selectedTags.some((tag) => topic.tags.includes(tag))
      );
    }

    // Apply difficulty filter
    if (filters.selectedDifficulty) {
      filtered = filtered.filter((topic) => topic.difficulty === filters.selectedDifficulty);
    }

    return filtered;
  }, [topics, searchQuery, filters]);

  // Memoize topic selection handler
  const handleTopicSelect = useCallback((topic) => {
    if (!category) return;
    addToHistory({
      id: topic.id,
      type: 'topic',
      categoryId: category.id,
      topicId: topic.id,
      title: topic.title,
      categoryTitle: category.title,
    });
    navigate(`/topic/${category.id}/${topic.id}`);
  }, [category, navigate, addToHistory]);

  // Memoize clear filters handler
  const handleClearFilters = useCallback(() => {
    setFilters({ selectedTags: [], selectedDifficulty: null });
  }, []);

  // Scroll-triggered fade-in for topic cards
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all topic cards
    const cards = document.querySelectorAll('.topic-card-fade-in');
    cards.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      cards.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, [filteredTopics]);

  // Get translated category title and description
  const categoryTitle = useMemo(() => {
    if (!category) return "";
    return category?.category_id
      ? t(`categories.${category.category_id}.title`, { defaultValue: category.title })
      : category.title;
  }, [category, t]);

  const categoryDescription = useMemo(() => {
    if (!category) return "";
    return category?.category_id
      ? t(`categories.${category.category_id}.description`, { defaultValue: category.description })
      : category.description;
  }, [category, t]);

  if (!category && !loadingTopics) {
    return (
      <ErrorState
        title={t('categoryPage.errors.notFound', { defaultValue: 'Category not found' })}
        description={t('categoryPage.errors.notFoundDescription', { defaultValue: 'The category you are looking for does not exist.' })}
        onRetry={() => navigate('/handbooks')}
      />
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 overflow-x-hidden">
      <SEO
        title={categoryTitle}
        description={categoryDescription}
        url={`/category/${category.id}`}
        keywords={[categoryTitle, "AI", "Machine Learning", "Handbooks"]}
      />
      <Hero
        title={categoryTitle}
        subtitle={categoryDescription}
        icon={category.icon ? React.cloneElement(category.icon, {
          className: `text-white drop-shadow-sm`,
          size: 22
        }) : <div className="w-6 h-6" />}
        children={
          <Breadcrumbs
            items={[
              { label: t('nav.handbooks', { defaultValue: 'Handbooks' }), to: '/handbooks' },
              { label: categoryTitle }
            ]}
          />
        }
      />

      {/* Topics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex flex-col items-center pt-4">
          {(searchQuery || filters.selectedTags.length > 0 || filters.selectedDifficulty) && (
            <div className="mb-4 p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30 w-full max-w-5xl">
              <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
                <Search size={16} />
                <span>
                  {t('categoryPage.searchResults.found', {
                    count: filteredTopics.length,
                    defaultValue: `Found ${filteredTopics.length} result${filteredTopics.length !== 1 ? 's' : ''}`
                  })}
                  {searchQuery && ` ${t('categoryPage.searchResults.for', { query: searchQuery })}`}
                </span>
              </div>
            </div>
          )}

          {(allTags.length > 0 || allDifficulties.length > 0) && (
            <div className="w-full max-w-5xl mb-2">
              <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                availableTags={allTags}
                availableDifficulties={allDifficulties}
              />
            </div>
          )}
        </div>
        <div className="pt-4 pb-16">
          {loadingTopics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : topicsError ? (
            <ErrorState
              title={t('categoryPage.errors.loadFailed', { defaultValue: 'Failed to load topics' })}
              description={topicsError?.message || t('categoryPage.errors.loadFailedDescription', { defaultValue: 'Unable to load topics. Please check your connection and try again.' })}
              error={topicsError}
              onRetry={() => window.location.reload()}
            />
          ) : filteredTopics.length === 0 ? (
            searchQuery || filters.selectedTags.length > 0 || filters.selectedDifficulty ? (
              <EmptySearch
                searchQuery={searchQuery}
                onClear={handleClearFilters}
              />
            ) : (
              <EmptyTopics
                category={category.title}
                onBack={() => navigate('/handbooks')}
              />
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="topic-card-fade-in section-fade-in group relative h-full transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <TopicCard
                    onClick={() => handleTopicSelect(topic)}
                    className="rounded-3xl flex flex-col h-full group/card"
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header with bookmark */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2 flex-wrap flex-1">
                          {completedTopics.has(topic.id) && (
                            <span className="flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-2.5 py-1 rounded-lg border border-green-200/60 dark:border-green-800/40 shadow-md backdrop-blur-sm">
                              <CheckCircle2 size={12} className="fill-current" />
                              {t('categoryPage.completed')}
                            </span>
                          )}
                          {topic.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-bold text-gray-700 dark:text-slate-300 bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-pink-900/30 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/40 shadow-md backdrop-blur-sm group-hover/card:scale-105 transition-transform duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {user && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <BookmarkButton
                              item={{
                                id: topic.id,
                                type: 'topic',
                                categoryId: category.id,
                                topicId: topic.id,
                                title: topic.title,
                                categoryTitle: category.title,
                              }}
                              className="flex-shrink-0"
                            />
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg lg:text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-indigo-600 group-hover/card:to-violet-600 transition-all duration-300 line-clamp-2">
                        {topic.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-4 flex-1 group-hover/card:text-gray-700 dark:group-hover/card:text-slate-300 transition-colors duration-300 line-clamp-3">
                        {topic.description}
                      </p>

                      {/* Footer with metadata and action */}
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-800/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Sparkles size={12} className="text-indigo-500 dark:text-indigo-400" />
                              {topic.readTime}
                            </span>
                            {topic.lastUpdated && (
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-green-500 dark:text-green-400" />
                                {topic.lastUpdated.split(',')[0]}
                              </span>
                            )}
                          </div>
                          <div className="p-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg group-hover/card:shadow-xl group-hover/card:scale-110 transition-all duration-300 opacity-0 group-hover/card:opacity-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-700"></div>
                            <ArrowRight size={14} className="group-hover/card:translate-x-0.5 transition-transform duration-300 relative z-10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TopicCard>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
