import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/config";
import { ArrowRight, CheckCircle2, Clock, BookOpen, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmptySearch } from "../components/EmptyState";
import { CardSkeleton } from "../components/LoadingSkeleton";
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
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

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
    <>
      <SEO
        title={t('homePage.title')}
        description={t('homePage.subtitle')}
        url="/handbooks"
      />

      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        {/* Background illustration */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/4 opacity-70"
          aria-hidden="true"
        >
          <img
            className="max-w-none"
            src="/images/page-illustration.svg"
            width={846}
            height={594}
            alt="Page illustration"
          />
        </div>

        {/* Additional blurred shapes */}
        <div
          className="pointer-events-none absolute left-1/2 top-[400px] -z-10 -mt-20 -translate-x-full opacity-50"
          aria-hidden="true"
        >
          <img
            className="max-w-none"
            src="/images/blurred-shape-gray.svg"
            width={760}
            height={668}
            alt="Blurred shape"
          />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-[440px] -z-10 -translate-x-1/3"
          aria-hidden="true"
        >
          <img
            className="max-w-none"
            src="/images/blurred-shape.svg"
            width={760}
            height={668}
            alt="Blurred shape"
          />
        </div>

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

        {/* Hero Section */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="pt-12 pb-8 md:pt-20 md:pb-12">
              {/* Hero header */}
              <div className="pb-12 text-center md:pb-16">
                <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50 animate-fade-in-up">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                    <BookOpen size={18} />
                    <span>Explore All Handbooks</span>
                  </span>
                </div>

                <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-extrabold text-4xl text-transparent md:text-5xl lg:text-4xl animate-fade-in-up animation-delay-100">
                  Your comprehensive AI & ML learning library
                </h1>

                <div className="mx-auto max-w-3xl animate-fade-in-up animation-delay-200">
                  <p className="mb-8 text-lg sm:text-xl text-slate-400">
                    Comprehensive guides to artificial intelligence concepts, techniques, and applications. Each handbook provides structured learning from fundamentals to advanced topics with clear explanations and practical examples.
                  </p>
                </div>

                {/* Stats */}
                {!loading && sections.length > 0 && (
                  <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-300">
                    <div className="relative rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 cursor-default">
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">
                        {sections.length}
                      </div>
                      <div className="text-sm text-slate-400">Learning Paths</div>
                    </div>
                    <div className="relative rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 hover:scale-105 cursor-default">
                      <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-1">
                        {sections.reduce((total, section) => total + (section.categories?.length || 0), 0)}
                      </div>
                      <div className="text-sm text-slate-400">Handbooks</div>
                    </div>
                    <div className="relative rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 backdrop-blur-sm col-span-2 md:col-span-1 transition-all duration-300 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 cursor-default">
                      <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-1">
                        {Object.keys(topicsByCategory).reduce((total, key) => total + (topicsByCategory[key]?.length || 0), 0)}+
                      </div>
                      <div className="text-sm text-slate-400">Topics</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Sections */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{
              borderImage: 'linear-gradient(to right, transparent, rgba(148, 163, 184, 0.25), transparent) 1'
            }}>
              {searchQuery && (
                <div className="mb-8 p-4 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-xl">
                  <div className="flex items-center gap-3 text-sm text-slate-200">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 shadow-lg shadow-indigo-500/20">
                      <Search size={16} className="text-indigo-400" />
                    </div>
                    <span>
                      {t('homePage.searchResults.found', {
                        count: filteredSections.reduce((acc, s) => acc + s.categories.length, 0),
                        defaultValue: `Found ${filteredSections.reduce((acc, s) => acc + s.categories.length, 0)} result${filteredSections.reduce((acc, s) => acc + s.categories.length, 0) !== 1 ? 's' : ''}`
                      })}
                      <span className="text-indigo-400 font-semibold ml-1">
                        {t('homePage.searchResults.for', { query: searchQuery })}
                      </span>
                    </span>
                  </div>
                </div>
              )}
              {loading ? (
                // Using CardSkeleton grid instead of spinner for better UX
                // Shows the expected layout while data loads
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
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
                  <div key={idx} className="scroll-mt-24 mb-20" id={`section-${idx}`}>
                    <div className="mb-10">
                      <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight relative inline-block text-balance">
                        {(() => {
                          const titleParts = section.title.split(' ');
                          const lastWord = titleParts.pop();
                          const restOfTitle = titleParts.join(' ');
                          return (
                            <>
                              {restOfTitle && <span className="text-slate-200">{restOfTitle} </span>}
                              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">{lastWord}</span>
                            </>
                          );
                        })()}
                        <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></span>
                      </h2>
                      {section.subtitle && (
                        <p className="mt-3 text-base text-slate-400 max-w-3xl">
                          {section.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
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
                            className="category-card-fade-in group relative h-full animate-fade-in-up"
                            style={{
                              animationDelay: `${(idx * section.categories.length + cardIdx) * 0.05}s`,
                            }}
                          >
                            <div
                              onClick={() => handleCategorySelect(cat)}
                              className="relative h-full rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-transparent cursor-pointer hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                            >
                              {/* Animated gradient border on hover */}
                              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-[length:200%_200%] animate-gradient-shift p-[1px] -z-10">
                                <div className="h-full w-full rounded-2xl bg-slate-900/95" />
                              </div>

                              {/* Shine effect on hover */}
                              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                              {/* Enhanced shadow on hover */}
                              <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-indigo-500/0 group-hover:shadow-indigo-500/20 transition-all duration-300 pointer-events-none" />

                              {/* Header with icon and chapters */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="relative p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-sm border border-slate-700/60 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl shadow-lg">
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all duration-500 blur-xl" />
                                  <div className="relative">{cat.icon || <div className="w-6 h-6" />}</div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                  {totalTime > 0 && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-800/40">
                                      <Clock size={11} />
                                      <span>{timeDisplay}</span>
                                    </div>
                                  )}
                                  {completionPercentage > 0 && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-green-400 bg-green-900/30 px-2 py-1 rounded-md border border-green-800/40">
                                      <CheckCircle2 size={11} />
                                      <span>{completionPercentage}%</span>
                                    </div>
                                  )}
                                  <div className="bg-gradient-to-br from-indigo-900/30 via-violet-900/30 to-pink-900/30 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border border-indigo-800/40 group-hover:scale-105 transition-transform duration-300">
                                    {categoryTopics.length} {t('homePage.chapters')}
                                  </div>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 className="text-lg lg:text-xl font-semibold text-slate-200 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300 line-clamp-2 text-balance">
                                {cat.title}
                              </h3>

                              {/* Description */}
                              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1 group-hover:text-slate-300 transition-colors duration-300 line-clamp-3">
                                {cat.description}
                              </p>

                              {/* Footer with action */}
                              <div className="mt-auto pt-4 border-t border-slate-700 group-hover:border-indigo-800/50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {t('homePage.exploreHandbook')}
                                  </span>
                                  <div className="p-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Animations */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(10px, -15px);
            }
            50% {
              transform: translate(-5px, -25px);
            }
            75% {
              transform: translate(-15px, -10px);
            }
          }

          @keyframes gradient-shift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .animate-gradient-shift {
            animation: gradient-shift 3s ease infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default HomePage;
