import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Sparkles, Search, Loader2, Clock, Award, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import BookmarkButton from "../components/BookmarkButton";
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
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [expandedSections, setExpandedSections] = useState({});
  const sectionRefs = useRef({});

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

  // Load accordion state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`accordion-state-${categoryId}`);
    if (savedState) {
      try {
        setExpandedSections(JSON.parse(savedState));
      } catch (e) {
        console.error('Failed to parse accordion state:', e);
      }
    }
  }, [categoryId]);

  // Save accordion state to localStorage
  useEffect(() => {
    if (Object.keys(expandedSections).length > 0) {
      localStorage.setItem(`accordion-state-${categoryId}`, JSON.stringify(expandedSections));
    }
  }, [expandedSections, categoryId]);

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


  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    let filtered = topics;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [topics, searchQuery]);

  // Group topics by section
  const groupedTopics = useMemo(() => {
    const groups = {};

    filteredTopics.forEach(topic => {
      const section = topic.section || topic.difficulty || 'Fundamentals';
      if (!groups[section]) {
        groups[section] = {
          topics: [],
          sectionDescription: topic.sectionDescription // Get description from first topic in section
        };
      }
      groups[section].topics.push(topic);
    });

    // Return only non-empty groups, sorted by section name
    return Object.entries(groups)
      .filter(([_, group]) => group.topics.length > 0)
      .sort(([a], [b]) => {
        // Custom sort order for Agentic AI sections
        const order = [
          'Introduction to AI Agents',
          'Core Agentic Design Patterns',
          'Advanced Agent Capabilities',
          'Reliability and Human Integration',
          'Production Patterns',
          'Advanced Techniques',
          'Hands-On Tutorials',
          'Impact and Future',
          'Fundamentals',
          'Core Concepts',
          'Advanced Topics',
          'Beginner',
          'Intermediate',
          'Advanced'
        ];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      })
      .map(([sectionName, group], index) => ({
        sectionName,
        topics: group.topics,
        sectionDescription: group.sectionDescription,
        sectionIdx: index
      }));
  }, [filteredTopics]);

  // Calculate section statistics
  const sectionStats = useMemo(() => {
    return groupedTopics.map(({ topics: sectionTopics, sectionIdx }) => {
      const completed = sectionTopics.filter(t => completedTopics.has(t.id)).length;
      const total = sectionTopics.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Calculate total estimated time
      const totalMinutes = sectionTopics.reduce((sum, topic) => {
        const match = topic.readTime?.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
      }, 0);

      return { sectionIdx, completed, total, percentage, totalMinutes };
    });
  }, [groupedTopics, completedTopics]);


  // Calculate total duration in minutes
  const totalDuration = useMemo(() => {
    return topics.reduce((total, topic) => {
      const match = topic.readTime?.match(/(\d+)/);
      return total + (match ? parseInt(match[1]) : 0);
    }, 0);
  }, [topics]);


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
    navigate(`/category/${categoryId}`);
  }, [navigate, categoryId]);

  // Toggle section expansion with smooth scroll
  const toggleSection = useCallback((sectionIdx) => {
    setExpandedSections(prev => {
      const newState = {
        ...prev,
        [sectionIdx]: !prev[sectionIdx]
      };

      // Smooth scroll to section after a brief delay for animation
      setTimeout(() => {
        const sectionElement = sectionRefs.current[sectionIdx];
        if (sectionElement && newState[sectionIdx]) {
          sectionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
          });
        }
      }, 100);

      return newState;
    });
  }, []);

  // Expand all sections
  const expandAll = useCallback(() => {
    const allExpanded = {};
    groupedTopics.forEach(({ sectionIdx }) => {
      allExpanded[sectionIdx] = true;
    });
    setExpandedSections(allExpanded);
  }, [groupedTopics]);

  // Collapse all sections
  const collapseAll = useCallback(() => {
    const allCollapsed = {};
    groupedTopics.forEach(({ sectionIdx }) => {
      allCollapsed[sectionIdx] = false;
    });
    setExpandedSections(allCollapsed);
  }, [groupedTopics]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard navigation when not in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const currentSections = groupedTopics.map(g => g.sectionIdx);
      const expandedIndices = currentSections.filter(idx => expandedSections[idx]);

      if (e.key === 'ArrowDown' && expandedIndices.length > 0) {
        e.preventDefault();
        const lastExpanded = expandedIndices[expandedIndices.length - 1];
        const nextIdx = currentSections.find(idx => idx > lastExpanded);
        if (nextIdx !== undefined) {
          toggleSection(nextIdx);
        }
      } else if (e.key === 'ArrowUp' && expandedIndices.length > 0) {
        e.preventDefault();
        const firstExpanded = expandedIndices[0];
        const prevIdx = [...currentSections].reverse().find(idx => idx < firstExpanded);
        if (prevIdx !== undefined) {
          toggleSection(prevIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [groupedTopics, expandedSections, toggleSection]);

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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-24">
      <SEO
        title={categoryTitle}
        description={categoryDescription}
        url={`/category/${category.id}`}
        keywords={[categoryTitle, "AI", "Machine Learning", "Handbooks"]}
      />

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

      {/* Header Section with Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <Breadcrumbs
          items={[
            { label: t('nav.handbooks', { defaultValue: 'Handbooks' }), to: '/handbooks' },
            { label: categoryTitle }
          ]}
          className="mb-4"
        />

        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-200 mb-4">
            {categoryTitle}
          </h1>
          <p className="text-lg text-slate-400 max-w-4xl">
            {categoryDescription}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 py-4 border-y border-slate-800/50">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-violet-400" />
            <span className="font-semibold text-slate-300">{groupedTopics.length}</span>
            <span>section{groupedTopics.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={18} className="text-indigo-400" />
            <span className="font-semibold text-slate-300">{topics.length}</span>
            <span>topic{topics.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-pink-400" />
            <span className="font-semibold text-slate-300">
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </span>
            <span>total</span>
          </div>
        </div>
      </div>

      {/* Topics Accordion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden pb-24">
        <div className="flex flex-col items-center pt-2">
          {searchQuery && (
            <div className="mb-4 p-4 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/50 w-full max-w-5xl shadow-xl">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 shadow-lg shadow-indigo-500/20">
                  <Search size={16} className="text-indigo-400" />
                </div>
                <span>
                  {t('categoryPage.searchResults.found', {
                    count: filteredTopics.length,
                    defaultValue: `Found ${filteredTopics.length} result${filteredTopics.length !== 1 ? 's' : ''}`
                  })}
                  {searchQuery && (
                    <span className="text-indigo-400 font-semibold ml-1">
                      {t('categoryPage.searchResults.for', { query: searchQuery })}
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

        </div>
        <div className="pt-4 pb-16">
          {loadingTopics ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900/40 rounded-2xl border border-slate-800/50 p-6 animate-pulse">
                  <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-20 bg-slate-800/50 rounded-xl"></div>
                    <div className="h-20 bg-slate-800/50 rounded-xl"></div>
                  </div>
                </div>
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
            searchQuery ? (
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
            <div className="space-y-4">
              {/* Expand/Collapse All Controls */}
              {groupedTopics.length > 1 && (
                <div className="flex items-center justify-end gap-3 mb-4">
                  <button
                    onClick={expandAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-slate-800/50 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/10 group"
                  >
                    <ChevronDown size={16} className="transition-transform group-hover:scale-110" />
                    <span>Expand All</span>
                  </button>
                  <button
                    onClick={collapseAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-slate-800/50 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/10 group"
                  >
                    <ChevronUp size={16} className="transition-transform group-hover:scale-110" />
                    <span>Collapse All</span>
                  </button>
                </div>
              )}

              {groupedTopics.map(({ sectionName, topics: sectionTopics, sectionDescription, sectionIdx }) => {
                const isExpanded = expandedSections[sectionIdx] ?? (sectionIdx === 0);
                const stats = sectionStats.find(s => s.sectionIdx === sectionIdx);

                return (
                  <div
                    key={sectionIdx}
                    ref={el => sectionRefs.current[sectionIdx] = el}
                    className={`bg-slate-900/40 rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? 'border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800/50'
                    }`}
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sectionIdx)}
                      className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-900/60 transition-all duration-300 group"
                      aria-expanded={isExpanded}
                      aria-controls={`section-content-${sectionIdx}`}
                      id={`section-header-${sectionIdx}`}
                    >
                      {/* Section Title */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors duration-300">
                            {sectionName}
                          </h3>
                          <span className="text-sm text-slate-500">
                            ({sectionTopics.length} topic{sectionTopics.length !== 1 ? 's' : ''}
                            {stats && stats.totalMinutes > 0 && (
                              <> • ~{stats.totalMinutes} min</>
                            )})
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {stats && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-slate-400">
                                {stats.completed} of {stats.total} completed
                              </span>
                              <span className={`text-xs font-bold ${
                                stats.percentage === 100 ? 'text-pink-400' :
                                stats.percentage > 0 ? 'text-indigo-400' :
                                'text-slate-500'
                              }`}>
                                {stats.percentage}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ease-out ${
                                  stats.percentage === 100
                                    ? 'bg-gradient-to-r from-pink-500 to-violet-500'
                                    : stats.percentage > 0
                                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                                    : 'bg-slate-700'
                                }`}
                                style={{ width: `${stats.percentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-slate-400 leading-relaxed pr-8 text-left">
                          {sectionDescription || (() => {
                            // Fallback descriptions for sections without database description
                            const descriptions = {
                              'Fundamentals': 'Start your learning journey with fundamental concepts and essential building blocks.',
                              'Core Concepts': 'Deepen your understanding with core principles and practical applications.',
                              'Advanced Topics': 'Master complex topics and cutting-edge approaches for expert-level knowledge.',
                              'Beginner': 'Start your learning journey with fundamental concepts and essential building blocks.',
                              'Intermediate': 'Deepen your understanding with practical applications and advanced techniques.',
                              'Advanced': 'Master complex topics and cutting-edge approaches for expert-level knowledge.'
                            };
                            return descriptions[sectionName] || `Explore ${sectionTopics.length} topic${sectionTopics.length !== 1 ? 's' : ''} in this section.`;
                          })()}
                        </p>
                      </div>

                      {/* Expand/Collapse Icon */}
                      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </button>

                    {/* Topics Grid (Animated Accordion) */}
                    <div
                      id={`section-content-${sectionIdx}`}
                      role="region"
                      aria-labelledby={`section-header-${sectionIdx}`}
                      className={`grid transition-all duration-300 ease-in-out ${
                        isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 space-y-3">
                          {sectionTopics.map((topic, topicIdx) => (
                            <React.Fragment key={topic.id}>
                              <div
                                onClick={() => handleTopicSelect(topic)}
                                className="group flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border border-transparent hover:border-indigo-500/30 hover:bg-slate-900/60 hover:shadow-md hover:shadow-indigo-500/10 hover:scale-[1.01] active:scale-[0.99]"
                                style={{
                                  animation: isExpanded ? `fadeInUp 0.4s ease-out ${topicIdx * 0.05}s both` : 'none'
                                }}
                              >
                                {/* Topic Badge */}
                                <div className="flex-shrink-0">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md ${
                                    completedTopics.has(topic.id)
                                      ? 'bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-pink-500/30 group-hover:shadow-pink-500/50 group-hover:scale-105'
                                      : 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-indigo-500/30 group-hover:from-indigo-500 group-hover:to-indigo-400 group-hover:shadow-indigo-500/50 group-hover:scale-105'
                                  }`}>
                                    {completedTopics.has(topic.id) ? (
                                      <CheckCircle2 size={18} className="fill-current animate-pulse" />
                                    ) : (
                                      <span>T{topicIdx + 1}</span>
                                    )}
                                  </div>
                                </div>

                                {/* Topic Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-slate-200 group-hover:text-indigo-400 transition-all duration-300 leading-tight">
                                      {topic.title}
                                    </h3>
                                    {user && (
                                      <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                        <BookmarkButton
                                          item={{
                                            id: topic.id,
                                            type: 'topic',
                                            categoryId: category.id,
                                            topicId: topic.id,
                                            title: topic.title,
                                            categoryTitle: category.title,
                                          }}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <p className="text-sm text-slate-400 leading-relaxed mb-2 group-hover:text-slate-300 transition-colors duration-300">
                                    {topic.description}
                                  </p>

                                  {/* Metadata */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {completedTopics.has(topic.id) && (
                                      <span className="flex items-center gap-1.5 text-xs font-semibold text-pink-400 bg-pink-900/20 px-2.5 py-1 rounded-lg border border-pink-800/30">
                                        <CheckCircle2 size={12} className="fill-current" />
                                        Completed
                                      </span>
                                    )}
                                    {topic.readTime && (
                                      <span className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                                        <Clock size={12} />
                                        {topic.readTime}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/* Subtle divider between topics */}
                              {topicIdx < sectionTopics.length - 1 && (
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent my-1"></div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
