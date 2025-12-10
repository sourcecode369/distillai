import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, ArrowRight, BookOpen, FileText, HelpCircle, X, Sparkles, Clock } from "lucide-react";
import { performGlobalSearch, SEARCH_TYPES } from "../utils/globalSearch";
import { CardSkeleton } from "../components/LoadingSkeleton";
import { EmptySearch, ErrorState } from "../components/EmptyState";
import { DATA } from "../data";
import SortDropdown from "../components/SortDropdown";
import { loadCategory } from "../utils/dataLoader";
import { loadTopic } from "../utils/topicLoader";

import { useNavigate, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";

const GlobalSearchResultsPage = () => {
  const { t } = useTranslation("search");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const onBack = () => navigate(-1);
  const onClearSearch = () => {
    setSearchParams({ q: "" });
    navigate(-1);
  };
  const [typeFilter, setTypeFilter] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery || "");
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search using React Query
  const {
    data: searchResults = { topics: [], categories: [], quizzes: [], total: 0 },
    isLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["global-search", debouncedSearchQuery.trim(), typeFilter, sortBy],
    queryFn: async () => {
      if (!debouncedSearchQuery.trim()) {
        return { topics: [], categories: [], quizzes: [], total: 0 };
      }
      return await performGlobalSearch(debouncedSearchQuery.trim(), {
        typeFilter,
        sortBy,
      });
    },
    enabled: !!debouncedSearchQuery.trim(),
  });


  const handleTopicClick = (topic) => {
    navigate(`/topic/${topic.categoryId}/${topic.id}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
  };

  const handleQuizClick = (quiz) => {
    navigate(`/quiz/${quiz.categoryId}/${quiz.topicId}`);
  };

  const clearFilters = () => {
    setTypeFilter(null);
    setSortBy("relevance");
  };

  const hasActiveFilters = typeFilter !== null || sortBy !== "relevance";

  const ResultCard = ({ result, type, onClick }) => {
    const getIcon = () => {
      switch (type) {
        case SEARCH_TYPES.TOPIC:
          return <FileText className="w-5 h-5" />;
        case SEARCH_TYPES.CATEGORY:
          return <BookOpen className="w-5 h-5" />;
        case SEARCH_TYPES.QUIZ:
          return <HelpCircle className="w-5 h-5" />;
        default:
          return <FileText className="w-5 h-5" />;
      }
    };

    const getTypeLabel = () => {
      switch (type) {
        case SEARCH_TYPES.TOPIC:
          return t("results.typeLabels.topic");
        case SEARCH_TYPES.CATEGORY:
          return t("results.typeLabels.handbook");
        case SEARCH_TYPES.QUIZ:
          return t("results.typeLabels.quiz");
        default:
          return "";
      }
    };

    return (
      <div
        onClick={onClick}
        className="group relative bg-gradient-to-br from-white via-white to-indigo-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-2xl p-6 border border-white/80 dark:border-slate-700/80 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 hover:shadow-elegant-hover transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 border border-indigo-200/50 dark:border-indigo-800/50 group-hover:scale-110 transition-transform duration-300">
            {type === SEARCH_TYPES.CATEGORY && result.icon ? (
              React.cloneElement(result.icon, {
                className: "w-5 h-5 text-indigo-600 dark:text-indigo-400",
              })
            ) : (
              <div className="text-indigo-600 dark:text-indigo-400">
                {getIcon()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300 line-clamp-2">
                  {result.title}
                </h3>
                {result.description && (
                  <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-2">
                    {result.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-pink-900/30 border border-indigo-200/60 dark:border-indigo-800/40 uppercase tracking-wider">
                  {getTypeLabel()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500 dark:text-slate-400">
              {type === SEARCH_TYPES.TOPIC && result.categoryTitle && (
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {result.categoryTitle}
                </span>
              )}
              {type === SEARCH_TYPES.QUIZ && result.categoryTitle && (
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {result.categoryTitle}
                </span>
              )}
              {type === SEARCH_TYPES.TOPIC && result.readTime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {result.readTime}
                </span>
              )}
              {type === SEARCH_TYPES.QUIZ && result.questionCount && (
                <span className="flex items-center gap-1">
                  <HelpCircle size={12} />
                  {result.questionCount} {t("results.questions")}
                </span>
              )}
              {result.lastUpdated && (
                <span className="flex items-center gap-1">
                  <Sparkles size={12} />
                  {result.lastUpdated.split(",")[0]}
                </span>
              )}
              {type === SEARCH_TYPES.TOPIC && result.tags && result.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {result.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative z-10 pb-20">
      <SEO
        title={`Search: ${searchQuery}`}
        description={`Search results for "${searchQuery}"`}
        url={`/search?q=${encodeURIComponent(searchQuery)}`}
      />
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-pink-500/10 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold"
          >
            <ArrowRight size={18} className="rotate-180" /> {t("results.back")}
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t("results.title")}
              </h1>
              <p className="text-base text-gray-600 dark:text-slate-400">
                {searchQuery ? t("results.searchingFor", { query: searchQuery }) : t("results.enterQuery")}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-indigo-500 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("results.filter")}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter(null)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${typeFilter === null
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-slate-700"
                  }`}
              >
                {t("results.filterButtons.all")}
              </button>
              <button
                onClick={() => setTypeFilter(SEARCH_TYPES.CATEGORY)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${typeFilter === SEARCH_TYPES.CATEGORY
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-slate-700"
                  }`}
              >
                {t("results.filterButtons.handbooks")}
              </button>
              <button
                onClick={() => setTypeFilter(SEARCH_TYPES.TOPIC)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${typeFilter === SEARCH_TYPES.TOPIC
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-slate-700"
                  }`}
              >
                {t("results.filterButtons.topics")}
              </button>
              <button
                onClick={() => setTypeFilter(SEARCH_TYPES.QUIZ)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${typeFilter === SEARCH_TYPES.QUIZ
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-slate-700"
                  }`}
              >
                {t("results.filterButtons.quizzes")}
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4 mt-4 relative z-20">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("results.sort")}</span>
            <div className="w-48 relative z-20">
              <SortDropdown
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "relevance", label: t("results.sortOptions.relevance") },
                  { value: "lastUpdated", label: t("results.sortOptions.lastUpdated") },
                ]}
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-200 dark:border-slate-700 transition-all"
              >
                <X size={14} />
                {t("results.clearFilters")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : searchError ? (
          <ErrorState
            title={t('errors.searchFailed', { defaultValue: 'Failed to perform search' })}
            description={searchError?.message || t('errors.searchFailedDescription', { defaultValue: 'An error occurred while searching. Please try again.' })}
            error={searchError}
            onRetry={() => window.location.reload()}
          />
        ) : searchResults.total === 0 ? (
          <EmptySearch
            searchQuery={debouncedSearchQuery}
            onClear={() => {
              clearFilters();
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="mb-6 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
              <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
                <Search size={16} />
                <span>
                  {searchResults.total === 1
                    ? t("results.foundResults", { count: searchResults.total })
                    : t("results.foundResultsPlural", { count: searchResults.total })}
                  {typeFilter && (
                    typeFilter === SEARCH_TYPES.CATEGORY ? t("results.inHandbooks") :
                      typeFilter === SEARCH_TYPES.TOPIC ? t("results.inTopics") :
                        t("results.inQuizzes")
                  )}
                </span>
              </div>
            </div>

            {/* Categories Results */}
            {searchResults.categories.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-500" />
                  {t("results.sections.handbooks")} ({searchResults.categories.length})
                </h2>
                <div className="space-y-4">
                  {searchResults.categories.map((category) => (
                    <ResultCard
                      key={category.id}
                      result={category}
                      type={SEARCH_TYPES.CATEGORY}
                      onClick={() => handleCategoryClick(category)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Topics Results */}
            {searchResults.topics.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-indigo-500" />
                  {t("results.sections.topics")} ({searchResults.topics.length})
                </h2>
                <div className="space-y-4">
                  {searchResults.topics.map((topic) => (
                    <ResultCard
                      key={topic.id}
                      result={topic}
                      type={SEARCH_TYPES.TOPIC}
                      onClick={() => handleTopicClick(topic)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quizzes Results */}
            {searchResults.quizzes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <HelpCircle size={20} className="text-indigo-500" />
                  {t("results.sections.quizzes")} ({searchResults.quizzes.length})
                </h2>
                <div className="space-y-4">
                  {searchResults.quizzes.map((quiz) => (
                    <ResultCard
                      key={quiz.id}
                      result={quiz}
                      type={SEARCH_TYPES.QUIZ}
                      onClick={() => handleQuizClick(quiz)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

GlobalSearchResultsPage.propTypes = {};

export default GlobalSearchResultsPage;

