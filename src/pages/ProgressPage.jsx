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
      <div className="min-h-screen bg-slate-950">
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
      <div className="min-h-screen bg-slate-950">
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

  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (learningProgress.completionPercentage / 100) * circ;

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Dark header */}
      <div className="relative overflow-hidden border-b border-gray-800/50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-0 top-0 w-80 h-48 rounded-full bg-indigo-600/8 blur-[80px]" />
          <div className="absolute right-0 bottom-0 w-56 h-40 rounded-full bg-violet-600/6 blur-[70px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-7 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200 hover:border-gray-700 transition-all"
            aria-label="Back"
          >
            <ArrowRight size={16} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-100">{t('progress.title')}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{t('progress.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="space-y-6">
          {/* Overview: progress ring + stats */}
          {loadingProgress ? (
            <ProgressSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Progress ring card */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-sm p-8 gap-4">
                <div className="relative">
                  <svg width="140" height="140" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="rgb(31,41,55)" strokeWidth="10" />
                    {/* Progress */}
                    <circle
                      cx="60" cy="60" r={radius} fill="none"
                      stroke="url(#ring-grad)" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={circ} strokeDashoffset={dashOffset}
                      transform="rotate(-90 60 60)"
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-gray-100">{learningProgress.completionPercentage}%</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Complete</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-300">{t('progress.learningProgress.handbookCompletion')}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{learningProgress.completedTopics} of {learningProgress.totalTopics} topics</p>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: t('progress.stats.topicsCompleted'), value: learningProgress.completedTopics, sub: `of ${learningProgress.totalTopics}`, icon: CheckCircle2, gradient: "from-green-500/20 to-emerald-500/10", border: "border-green-500/20", iconColor: "text-green-400" },
                  { label: t('progress.stats.quizzesTaken'),    value: learningProgress.totalQuizzes,   sub: t('progress.stats.totalAttempts'),           icon: Target,        gradient: "from-indigo-500/20 to-violet-500/10",  border: "border-indigo-500/20", iconColor: "text-indigo-400" },
                  { label: t('progress.stats.readingHistory'),  value: readingHistory.length,           sub: t('progress.stats.recentItems'),             icon: History,       gradient: "from-violet-500/20 to-purple-500/10", border: "border-violet-500/20", iconColor: "text-violet-400" },
                ].map(({ label, value, sub, icon: Icon, gradient, border, iconColor }) => (
                  <div key={label} className={`flex flex-col rounded-2xl border bg-gradient-to-br ${gradient} ${border} p-6 backdrop-blur-sm`}>
                    <div className={`mb-3 ${iconColor}`}><Icon size={20} strokeWidth={2} /></div>
                    <p className="text-4xl font-extrabold text-gray-100 leading-none mb-1">{value}</p>
                    <p className="text-xs font-semibold text-gray-400">{label}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>
                  </div>
                ))}

                {/* Recent reading history */}
                {readingHistory.length > 0 && (
                  <div className="sm:col-span-3 rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <History size={11} /> {t('progress.readingHistory.title')}
                    </h3>
                    <div className="divide-y divide-gray-800/60">
                      {readingHistory.slice(0, 5).map((item, index) => (
                        <div key={item.id || index} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 group">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-300 group-hover:text-indigo-300 transition-colors truncate">{item.title}</p>
                            <p className="text-[11px] text-gray-600 truncate">{item.category_title}</p>
                          </div>
                          <span className="text-[10px] text-gray-600 ml-4 flex-shrink-0 flex items-center gap-1">
                            <Calendar size={10} />{formatDate(item.last_read_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quiz History */}
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-sm p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Target size={13} className="text-indigo-400" /> {t('progress.quizHistory.title')}
            </h2>

            {loadingProgress ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
            ) : progressData?.quizHistory && progressData.quizHistory.length > 0 ? (
              <div className="space-y-3">
                {progressData.quizHistory.map((quiz, index) => {
                  const score = quiz.quiz_score || 0;
                  const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400";
                  const barColor = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";
                  return (
                    <div key={quiz.id || index} className="rounded-xl border border-gray-800/50 bg-gray-800/40 p-4 hover:border-indigo-500/30 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-gray-200 truncate">{quiz.topicTitle}</h4>
                          <p className="text-[11px] text-gray-600 truncate mt-0.5">{quiz.categoryTitle}</p>
                        </div>
                        <span className={`text-xl font-extrabold flex-shrink-0 ${scoreColor}`}>{score}%</span>
                      </div>
                      {/* Score bar */}
                      <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden mb-3">
                        <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${score}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-600">
                        <span className="flex items-center gap-1"><Calendar size={10} />{formatDateTime(quiz.updated_at || quiz.completed_at || quiz.created_at)}</span>
                        {quiz.completed && <span className="flex items-center gap-1 text-green-500"><CheckCircle2 size={10} />{t('progress.completed')}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Target size={32} className="mx-auto mb-3 text-gray-700" />
                <p className="text-sm font-semibold text-gray-400">{t('progress.quizHistory.empty.title')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('progress.quizHistory.empty.description')}</p>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-sm p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Trophy size={13} className="text-yellow-400" /> {t('progress.achievements.title')}
            </h2>

            {loadingProgress ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
            ) : achievements && achievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.id} className="group relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-800/40 p-5 hover:border-gray-700 transition-all duration-200">
                      <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none`} />
                      <div className="relative flex items-start gap-4">
                        <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${achievement.color} rounded-xl shadow-lg`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-200 mb-1">{achievement.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center rounded-xl border border-dashed border-gray-800">
                <Trophy size={36} className="mx-auto mb-3 text-gray-700" />
                <p className="text-sm font-semibold text-gray-400">{t('progress.achievements.empty')}</p>
                <p className="text-xs text-gray-600 mt-1">Complete topics and quizzes to unlock achievements</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
