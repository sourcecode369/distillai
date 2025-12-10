import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import {
  TrendingUp,
  Target,
  Trophy,
  Award,
  BookOpen,
  CheckCircle2,
  Loader2,
  AlertCircle,
  History,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { dbHelpers } from "../lib/supabase";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState, { ErrorState } from "../components/EmptyState";
import { loadAllCategories } from "../utils/dataLoader";
import { ProgressSkeleton } from "../components/LoadingSkeleton";

const ProgressPage = () => {
  const { t } = useTranslation('app');
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  // Fetch progress data using React Query
  // This complex query fetches progress, topics, and categories, then processes them
  const {
    data: progressData,
    isLoading: loadingProgress,
    error: progressError,
  } = useQuery({
    queryKey: ["user-progress-with-quizzes", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await dbHelpers.getAllUserProgressWithQuizzes(user.id);

      if (error) {
        console.error("Error loading progress data:", error);
        return {
          allProgress: [],
          completedTopics: 0,
          totalQuizzes: 0,
          quizHistory: [],
          totalTopics: 0,
        };
      }

      // Count unique completed topics (by category_id + topic_id combination)
      const completedTopicsSet = new Set();
      (data || []).forEach((p) => {
        if (p.completed) {
          completedTopicsSet.add(`${p.category_id}-${p.topic_id}`);
        }
      });
      const completedTopics = completedTopicsSet.size;

      // Get quiz history - filter by quiz_score and map to include topic/category info
      // Load topics and categories from database for quiz history and total count
      const [allTopicsResult, allCategories] = await Promise.all([
        dbHelpers.getAllTopics(),
        loadAllCategories(),
      ]);

      const { data: allTopics } = allTopicsResult;
      const totalTopics = allTopics?.length || 0;
      const topicsMap = new Map();
      (allTopics || []).forEach((t) => {
        topicsMap.set(`${t.category_id}-${t.topic_id}`, t);
      });

      const categoryMap = new Map();
      allCategories.forEach((cat) => {
        categoryMap.set(cat.category_id, cat);
      });

      const quizHistory = (data || [])
        .filter((p) => p.quiz_score !== null && p.quiz_score !== undefined)
        .map((p) => {
          // Find topic and category from database
          const topic = topicsMap.get(`${p.category_id}-${p.topic_id}`);
          const category = categoryMap.get(p.category_id);
          return {
            ...p,
            topicTitle: topic?.title || t('progress.unknown.topic'),
            categoryTitle: category?.title || t('progress.unknown.category'),
          };
        })
        .sort((a, b) => new Date(b.updated_at || b.completed_at || b.created_at) - new Date(a.updated_at || a.completed_at || a.created_at));

      return {
        allProgress: data || [],
        completedTopics,
        totalTopics,
        totalQuizzes: quizHistory.length,
        quizHistory,
      };
    },
    enabled: !!user?.id, // Only run query if user is logged in
  });

  // Fetch reading history using React Query
  const {
    data: readingHistoryData,
    isLoading: loadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["reading-history", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await dbHelpers.getReadingHistory(user.id, 10);

      if (error) {
        console.error("Error loading reading history:", error);
        return [];
      }

      // Sort by last_read_at descending and limit to recent 10
      return (data || [])
        .sort((a, b) => new Date(b.last_read_at) - new Date(a.last_read_at))
        .slice(0, 10);
    },
    enabled: !!user?.id, // Only run query if user is logged in
  });

  // Extract data with fallbacks
  const readingHistory = readingHistoryData || [];

  if (progressError) {
    console.error("Error loading progress:", progressError);
  }
  if (historyError) {
    console.error("Error loading reading history:", historyError);
  }

  // Calculate learning progress stats
  const learningProgress = useMemo(() => {
    if (!progressData) {
      return {
        completionPercentage: 0,
        completedTopics: 0,
        totalTopics: 0,
        totalQuizzes: 0,
      };
    }

    const completionPercentage = progressData.totalTopics > 0
      ? Math.round((progressData.completedTopics / progressData.totalTopics) * 100)
      : 0;

    return {
      completionPercentage,
      completedTopics: progressData.completedTopics,
      totalTopics: progressData.totalTopics,
      totalQuizzes: progressData.totalQuizzes,
    };
  }, [progressData]);

  // Calculate achievements
  const achievements = useMemo(() => {
    if (!progressData) return [];

    const achieved = [];

    // Handbook Completed (100% completion)
    if (learningProgress.completionPercentage === 100) {
      achieved.push({
        id: "handbook-completed",
        title: t('progress.achievements.handbookCompleted.title'),
        description: t('progress.achievements.handbookCompleted.description'),
        icon: Trophy,
        color: "from-yellow-500 to-orange-500",
      });
    }

    // Topics milestones
    if (learningProgress.completedTopics >= 10) {
      achieved.push({
        id: "topics-10",
        title: t('progress.achievements.topics10.title'),
        description: t('progress.achievements.topics10.description'),
        icon: Award,
        color: "from-indigo-500 to-violet-500",
      });
    }
    if (learningProgress.completedTopics >= 25) {
      achieved.push({
        id: "topics-25",
        title: t('progress.achievements.topics25.title'),
        description: t('progress.achievements.topics25.description'),
        icon: Award,
        color: "from-violet-500 to-purple-500",
      });
    }
    if (learningProgress.completedTopics >= 50) {
      achieved.push({
        id: "topics-50",
        title: t('progress.achievements.topics50.title'),
        description: t('progress.achievements.topics50.description'),
        icon: Award,
        color: "from-purple-500 to-pink-500",
      });
    }

    // Quiz milestones
    if (learningProgress.totalQuizzes >= 5) {
      achieved.push({
        id: "quizzes-5",
        title: t('progress.achievements.quizzes5.title'),
        description: t('progress.achievements.quizzes5.description'),
        icon: Target,
        color: "from-blue-500 to-cyan-500",
      });
    }
    if (learningProgress.totalQuizzes >= 10) {
      achieved.push({
        id: "quizzes-10",
        title: t('progress.achievements.quizzes10.title'),
        description: t('progress.achievements.quizzes10.description'),
        icon: Target,
        color: "from-cyan-500 to-teal-500",
      });
    }

    return achieved;
  }, [progressData, learningProgress]);

  const formatDate = (dateString) => {
    if (!dateString) return t('progress.notAvailable');
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return t('progress.notAvailable');
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loadingProgress && loadingHistory) {
    return <ProgressSkeleton />;
  }

  if (progressError || historyError) {
    return (
      <div className="min-h-screen relative z-10">
        <Hero
          title={t('progress.title')}
          subtitle={t('progress.subtitle')}
          icon={<TrendingUp size={22} className="text-white drop-shadow-sm" />}
          onBack={() => navigate(-1)}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState
            title={t('progress.errors.loadFailed', { defaultValue: 'Failed to load progress' })}
            description={progressError?.message || historyError?.message || t('progress.errors.loadFailedDescription', { defaultValue: 'Unable to load your progress data. Please try again.' })}
            error={progressError || historyError}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative z-10">
        <div className="relative overflow-hidden border-b border-gray-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-pink-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumbs
              items={[{ label: t('progress.title') }]}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={AlertCircle}
            title={t('progress.empty.signInRequired')}
            description={t('progress.empty.description')}
            action={t('buttons.back')}
            onAction={() => navigate(-1)}
            variant="default"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      <Hero
        title={t('progress.title')}
        subtitle={t('progress.subtitle')}
        icon={<TrendingUp size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate(-1)}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Learning Progress Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
              {t('progress.learningProgress.title')}
            </h2>

            {loadingProgress ? (
              // Using ProgressSkeleton instead of spinner for better UX
              // Shows the expected layout structure while progress data loads
              <ProgressSkeleton />
            ) : (
              <div className="space-y-6">
                {/* Overall Completion */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                      <span className="text-base font-semibold text-slate-900 dark:text-slate-50">
                        {t('progress.learningProgress.handbookCompletion')}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                      {learningProgress.completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
                      style={{ width: `${learningProgress.completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                    {t('progress.learningProgress.topicsCompleted', { completed: learningProgress.completedTopics, total: learningProgress.totalTopics })}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{t('progress.stats.topicsCompleted')}</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {learningProgress.completedTopics}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {t('progress.stats.outOf', { total: learningProgress.totalTopics })}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{t('progress.stats.quizzesTaken')}</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {learningProgress.totalQuizzes}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {t('progress.stats.totalAttempts')}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <History size={18} className="text-violet-600 dark:text-violet-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{t('progress.stats.readingHistory')}</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {readingHistory.length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {t('progress.stats.recentItems')}
                    </p>
                  </div>
                </div>

                {/* Reading History Summary */}
                {readingHistory.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <History size={14} />
                      {t('progress.readingHistory.title')}
                    </h3>
                    <div className="space-y-2">
                      {readingHistory.slice(0, 5).map((item, index) => (
                        <div
                          key={item.id || index}
                          className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {item.category_title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 ml-4">
                              <Calendar size={12} />
                              {formatDate(item.last_read_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quiz History Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
              <Target size={20} className="text-indigo-600 dark:text-indigo-400" />
              {t('progress.quizHistory.title')}
            </h2>

            {loadingProgress ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            ) : progressData?.quizHistory && progressData.quizHistory.length > 0 ? (
              <div className="space-y-3">
                {progressData.quizHistory.map((quiz, index) => {
                  const scorePercentage = quiz.quiz_score || 0;
                  const getScoreColor = () => {
                    if (scorePercentage >= 80) return "text-green-600 dark:text-green-400";
                    if (scorePercentage >= 60) return "text-yellow-600 dark:text-yellow-400";
                    return "text-red-600 dark:text-red-400";
                  };
                  const getScoreBgColor = () => {
                    if (scorePercentage >= 80) return "bg-green-100 dark:bg-green-900/30";
                    if (scorePercentage >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
                    return "bg-red-100 dark:bg-red-900/30";
                  };

                  return (
                    <div
                      key={quiz.id || index}
                      className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                            {quiz.topicTitle}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {quiz.categoryTitle}
                          </p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg ${getScoreBgColor()} ${getScoreColor()} font-bold text-sm whitespace-nowrap`}>
                          {scorePercentage}%
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDateTime(quiz.updated_at || quiz.completed_at || quiz.created_at)}
                        </span>
                        {quiz.completed && (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle2 size={12} />
                            {t('progress.completed')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Target}
                title={t('progress.quizHistory.empty.title')}
                description={t('progress.quizHistory.empty.description')}
                variant="default"
              />
            )}
          </div>

          {/* Achievements & Certificates Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-indigo-600 dark:text-indigo-400" />
              {t('progress.achievements.title')}
            </h2>

            {loadingProgress ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            ) : achievements && achievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className="relative p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className="relative flex items-start gap-3">
                        <div className={`p-3 bg-gradient-to-br ${achievement.color} rounded-lg shadow-md`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <Trophy size={40} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('progress.achievements.empty')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
