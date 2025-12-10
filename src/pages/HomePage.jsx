import React, { useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/config";
import { ArrowRight, CheckCircle2, Clock, BookOpen, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmptySearch } from "../components/EmptyState";
import { FeatureCard } from "../components/Card";
import { CardSkeleton } from "../components/LoadingSkeleton";
import Hero from "../components/Hero";
import { useAuth } from "../context/AuthContext";
import { dbHelpers } from "../lib/supabase";
import { loadTopicsFromDatabase } from "../utils/topicLoader";
import { loadSectionsWithCategories } from "../utils/dataLoader";
import { translateSectionsWithCategories } from "../utils/translateContent";
import SEO from "../components/SEO";

const HomePage = () => {
  const { t } = useTranslation('handbook');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // Fetch sections and topics using React Query
  const {
    data: sectionsData,
    isLoading: loadingSections,
    error: sectionsError,
  } = useQuery({
    queryKey: ["sections-with-categories"],
    queryFn: loadSectionsWithCategories,
  });

  const {
    data: topicsData,
    isLoading: loadingTopics,
    error: topicsError,
  } = useQuery({
    queryKey: ["topics-by-category"],
    queryFn: loadTopicsFromDatabase,
  });

  // Extract and translate data (memoized to prevent unnecessary re-renders)
  const sections = useMemo(() => {
    const rawSections = sectionsData || [];
    return translateSectionsWithCategories(rawSections, t);
  }, [sectionsData, t, i18n.language]);
  const topicsByCategory = useMemo(() => topicsData || {}, [topicsData]);
  const loading = loadingSections || loadingTopics;

  // Log errors if any
  if (sectionsError) {
    console.error("Error loading sections:", sectionsError);
  }
  if (topicsError) {
    console.error("Error loading topics:", topicsError);
  }

  // Fetch progress for all categories using React Query
  const {
    data: progressData,
  } = useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: async () => {
      if (!user?.id) return {};
      const { data } = await dbHelpers.getAllUserProgress(user.id);
      if (data) {
        const progressMap = {};
        data.forEach((p) => {
          if (!progressMap[p.category_id]) {
            progressMap[p.category_id] = [];
          }
          progressMap[p.category_id].push(p.topic_id);
        });
        return progressMap;
      }
      return {};
    },
    enabled: !!user?.id,
  });

  // Use progressData directly instead of syncing to state
  const categoryProgress = progressData || {};

  // Filter categories based on search query
  const filteredSections = useMemo(() => {
    if (!sections || !Array.isArray(sections)) {
      return [];
    }
    if (!searchQuery.trim()) return sections;

    const query = searchQuery.toLowerCase();
    return sections.map((section) => ({
      ...section,
      categories: section.categories.filter((cat) => {
        if (!cat) return false;
        return (
          cat.title.toLowerCase().includes(query) ||
          (cat.description && cat.description.toLowerCase().includes(query)) ||
          cat.category_id.toLowerCase().includes(query)
        );
      }),
    })).filter((section) => section.categories.length > 0);
  }, [sections, searchQuery]);

  // Handle category selection
  const handleCategorySelect = useCallback((category) => {
    navigate(`/category/${category.id}`);
  }, [navigate]);

  // Scroll-triggered fade-in for category cards
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

    // Observe all category cards
    const cards = document.querySelectorAll('.category-card-fade-in');
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
  }, [filteredSections, topicsByCategory]);

  return (
    <div className="pb-0 relative z-10 overflow-x-hidden">
      <SEO
        title={t('homePage.title')}
        description={t('homePage.subtitle')}
        url="/handbooks"
      />
      {/* Hero Section */}
      <Hero
        title={t('homePage.title')}
        subtitle={t('homePage.subtitle')}
        icon={<BookOpen size={22} className="text-white drop-shadow-sm" />}
      />

      {/* Categories Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 mb-16">
        {searchQuery && (
          <div className="mb-8 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
            <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
              <Search size={16} />
              <span>
                {t('homePage.searchResults.found', {
                  count: filteredSections.reduce((acc, s) => acc + s.categories.length, 0),
                  defaultValue: `Found ${filteredSections.reduce((acc, s) => acc + s.categories.length, 0)} result${filteredSections.reduce((acc, s) => acc + s.categories.length, 0) !== 1 ? 's' : ''}`
                })} {t('homePage.searchResults.for', { query: searchQuery })}
              </span>
            </div>
          </div>
        )}
        {loading ? (
          // Using CardSkeleton grid instead of spinner for better UX
          // Shows the expected layout while data loads
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredSections.length === 0 && searchQuery ? (
          <EmptySearch
            searchQuery={searchQuery}
            onClear={() => {
              navigate('/');
            }}
          />
        ) : (
          filteredSections.map((section, idx) => (
            <div key={idx} className="scroll-mt-24" id={`section-${idx}`}>
              <div className="mb-10">
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight relative inline-block text-balance">
                  {(() => {
                    const titleParts = section.title.split(' ');
                    const lastWord = titleParts.pop();
                    const restOfTitle = titleParts.join(' ');
                    return (
                      <>
                        {restOfTitle && <span className="text-slate-700 dark:text-slate-200">{restOfTitle} </span>}
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">{lastWord}</span>
                      </>
                    );
                  })()}
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px section-divider"></span>
                </h2>
                {section.subtitle && (
                  <p className="mt-3 text-base text-gray-600 dark:text-slate-400 max-w-3xl">
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {section.categories.map((cat, cardIdx) => {
                  if (!cat) return null;

                  // Get topics from database for this category
                  const categoryTopics = topicsByCategory[cat.id] || [];

                  // Calculate total read time
                  const totalTime = categoryTopics.reduce((total, topic) => {
                    const timeStr = topic.readTime || "0 min";
                    const minutes = parseInt(timeStr.replace(/\D/g, "")) || 0;
                    return total + minutes;
                  }, 0);
                  const hours = Math.floor(totalTime / 60);
                  const minutes = totalTime % 60;
                  const hoursUnit = t('homePage.timeUnits.hours');
                  const minutesUnit = t('homePage.timeUnits.minutes');
                  const timeDisplay = hours > 0
                    ? `${hours}${hoursUnit} ${minutes > 0 ? `${minutes}${minutesUnit}` : ""}`.trim()
                    : `${totalTime}${minutesUnit}`;

                  // Calculate completion progress
                  const completedTopics = categoryProgress[cat.category_id] || [];
                  const completionCount = completedTopics.length;
                  const totalTopics = categoryTopics.length;
                  const completionPercentage = totalTopics > 0
                    ? Math.round((completionCount / totalTopics) * 100)
                    : 0;

                  return (
                    <div
                      key={cat.id}
                      className="category-card-fade-in section-fade-in group relative h-full transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FeatureCard
                        onClick={() => handleCategorySelect(cat)}
                        className="rounded-3xl flex flex-col h-full"
                      >
                        <div className="relative z-10 flex flex-col h-full">
                          {/* Header with icon and chapters */}
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${cat.color} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm border border-white/60 dark:border-slate-700/60 transition-all duration-500 group-hover:scale-105 shadow-elegant icon-container`}>
                              {cat.icon || <div className="w-6 h-6" />}
                            </div>
                            <div className="flex items-center gap-2">
                              {totalTime > 0 && (
                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-200/50 dark:border-indigo-800/40">
                                  <Clock size={11} />
                                  <span>{timeDisplay}</span>
                                </div>
                              )}
                              {completionPercentage > 0 && (
                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-900/30 px-2 py-1 rounded-md border border-green-200/50 dark:border-green-800/40">
                                  <CheckCircle2 size={11} />
                                  <span>{completionPercentage}%</span>
                                </div>
                              )}
                              <div className="bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-pink-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/40 shadow-elegant backdrop-blur-sm group-hover:scale-105 transition-transform duration-300 flex-shrink-0 badge">
                                {categoryTopics.length} {t('homePage.chapters')}
                              </div>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg lg:text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300 line-clamp-2 text-balance">
                            {cat.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-4 flex-1 group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors duration-300 line-clamp-3">
                            {cat.description}
                          </p>

                          {/* Footer with action */}
                          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-800/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {t('homePage.exploreHandbook')}
                              </span>
                              <div className="p-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300 relative z-10" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </FeatureCard>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
