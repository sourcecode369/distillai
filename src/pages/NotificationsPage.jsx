import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dbHelpers } from "../lib/supabase";
import { Bell, Check, CheckCheck, ArrowLeft, Clock } from "lucide-react";
import Hero from "../components/Hero";
import { useApp } from "../context/AppContext";

import { ErrorState } from "../components/EmptyState";

const NotificationsPage = () => {
  const { t } = useTranslation('notification');
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all"); // "all", "unread", "read"

  // Fetch all notifications
  const { data: notificationsData, isLoading, error: notificationsError } = useQuery({
    queryKey: ["notifications", user?.id, "all"],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      return await dbHelpers.getNotifications(user.id, 100);
    },
    enabled: !!user?.id,
  });

  const notifications = notificationsData?.data || [];
  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const readNotifications = notifications.filter((n) => n.is_read);

  const filteredNotifications =
    filter === "unread"
      ? unreadNotifications
      : filter === "read"
        ? readNotifications
        : notifications;

  const handleMarkAsRead = async (notificationId) => {
    if (!user?.id) return;
    try {
      await dbHelpers.markNotificationAsRead(notificationId, user.id);
      queryClient.invalidateQueries({ queryKey: ["notifications-unread", user.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
      showToast(t('page.toast.markedAsRead'), "success");
    } catch {
      showToast(t('page.toast.errorMarkAsRead'), "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id || unreadNotifications.length === 0) return;
    try {
      await dbHelpers.markAllNotificationsAsRead(user.id);
      queryClient.invalidateQueries({ queryKey: ["notifications-unread", user.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
      showToast(t('page.toast.markAllRead'), "success");
    } catch {
      showToast(t('page.toast.errorMarkAllRead'), "error");
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
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

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

  // Scroll-triggered fade-in for notification cards
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

    const cards = document.querySelectorAll('.notification-card-fade-in');
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
  }, [filteredNotifications]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key to go back
      if (e.key === 'Escape') {
        navigate(-1);
      }
      // Number keys for filter switching
      if (e.key === '1' && !e.ctrlKey && !e.metaKey) {
        setFilter('all');
      } else if (e.key === '2' && !e.ctrlKey && !e.metaKey) {
        setFilter('unread');
      } else if (e.key === '3' && !e.ctrlKey && !e.metaKey) {
        setFilter('read');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 max-w-md">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 w-fit mx-auto mb-6">
            <Bell size={40} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('page.signInRequired')}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{t('page.signInMessage')}</p>
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
    <div className="min-h-screen relative z-10 pb-24 bg-gradient-to-br from-white via-indigo-50/20 via-violet-50/10 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:via-violet-950/10 dark:to-slate-800">
      <Hero
        title={t('page.title')}
        subtitle={
          unreadNotifications.length > 0 ? (
            <span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{unreadNotifications.length}</span> {t('page.subtitle.unread')}
              {notifications.length > 0 && (
                <span className="text-gray-500 dark:text-slate-400"> • {notifications.length} {t('page.subtitle.total')}</span>
              )}
            </span>
          ) : (
            <span>{notifications.length !== 1 ? t('page.subtitle.countPlural', { count: notifications.length }) : t('page.subtitle.count', { count: notifications.length })}</span>
          )
        }
        icon={<Bell size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate(-1)}
        useArrowLeft={true}
        rightActions={
          unreadNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <CheckCheck size={16} className="relative z-10" />
              <span className="relative z-10">{t('page.markAllRead')}</span>
            </button>
          )
        }
      />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {notificationsError ? (
          <ErrorState
            title={t('page.errors.loadFailed', { defaultValue: 'Failed to load notifications' })}
            description={notificationsError?.message || t('page.errors.loadFailedDescription', { defaultValue: 'Unable to load notifications. Please try again.' })}
            error={notificationsError}
            onRetry={() => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id, "all"] })}
          />
        ) : (
          <>
            {/* Filter Tabs - Enhanced with Animations */}
            <div className="mb-8">
              <div className="relative flex items-center gap-1 border-b border-slate-200/60 dark:border-slate-700/60">
                {/* Animated underline indicator */}
                <div
                  className="absolute bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-full transition-all duration-500 ease-out"
                  style={{
                    left: filter === "all" ? "0%" : filter === "unread" ? "33.333%" : "66.666%",
                    width: "33.333%"
                  }}
                />

                <button
                  onClick={() => setFilter("all")}
                  className={`group relative flex-1 px-6 py-3.5 text-sm font-semibold transition-all duration-500 ${filter === "all"
                    ? "text-indigo-600 dark:text-indigo-400 scale-105"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:scale-[1.02]"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="transition-transform duration-300 group-hover:scale-105">{filter === "all" && "✨ "}{t('page.filters.all')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-500 ${filter === "all"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 scale-110 shadow-sm shadow-indigo-500/20"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                      }`}>
                      {notifications.length}
                    </span>
                  </span>
                  {/* Subtle background on hover */}
                  <div className="absolute inset-0 bg-indigo-50/0 dark:bg-indigo-900/0 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 rounded-t-xl transition-all duration-300 -z-10"></div>
                </button>

                <button
                  onClick={() => setFilter("unread")}
                  className={`group relative flex-1 px-6 py-3.5 text-sm font-semibold transition-all duration-500 ${filter === "unread"
                    ? "text-indigo-600 dark:text-indigo-400 scale-105"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:scale-[1.02]"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="transition-transform duration-300 group-hover:scale-105">{filter === "unread" && "🔔 "}{t('page.filters.unread')}</span>
                    {unreadNotifications.length > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-500 ${filter === "unread"
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 scale-110 shadow-sm shadow-indigo-500/20"
                        : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:scale-105"
                        }`}>
                        {unreadNotifications.length}
                      </span>
                    )}
                  </span>
                  {/* Subtle background on hover */}
                  <div className="absolute inset-0 bg-indigo-50/0 dark:bg-indigo-900/0 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 rounded-t-xl transition-all duration-300 -z-10"></div>
                </button>

                <button
                  onClick={() => setFilter("read")}
                  className={`group relative flex-1 px-6 py-3.5 text-sm font-semibold transition-all duration-500 ${filter === "read"
                    ? "text-indigo-600 dark:text-indigo-400 scale-105"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:scale-[1.02]"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="transition-transform duration-300 group-hover:scale-105">{filter === "read" && "✓ "}{t('page.filters.read')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-500 ${filter === "read"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 scale-110 shadow-sm shadow-indigo-500/20"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                      }`}>
                      {readNotifications.length}
                    </span>
                  </span>
                  {/* Subtle background on hover */}
                  <div className="absolute inset-0 bg-indigo-50/0 dark:bg-indigo-900/0 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 rounded-t-xl transition-all duration-300 -z-10"></div>
                </button>
              </div>
            </div>

            {/* Notifications Grid */}
            {isLoading ? (
              <div className="text-center py-24">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-5"></div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('page.loading')}</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-32 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 w-fit mx-auto mb-8 shadow-lg">
                  <Bell size={56} className="text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {filter === "unread"
                    ? t('page.empty.unread.title')
                    : filter === "read"
                      ? t('page.empty.read.title')
                      : t('page.empty.all.title')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {filter === "all"
                    ? t('page.empty.all.description')
                    : filter === "unread"
                      ? t('page.empty.unread.description')
                      : t('page.empty.read.description')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="notification-card-fade-in section-fade-in group relative h-full transform transition-all duration-500 hover:scale-[1.01]"
                  >
                    <div
                      className={`relative h-full overflow-hidden rounded-3xl border transition-all duration-500 ${!notification.is_read
                        ? "bg-white dark:bg-slate-800 border-indigo-200/60 dark:border-indigo-800/40 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-900/30 hover:-translate-y-1"
                        : "bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 shadow-md shadow-slate-500/5 dark:shadow-slate-900/10 hover:shadow-lg hover:shadow-slate-500/10 dark:hover:shadow-slate-900/20 hover:-translate-y-0.5 backdrop-blur-sm"
                        }`}
                    >
                      {/* Gradient hover background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/50 to-indigo-50/0 dark:from-indigo-900/0 dark:via-indigo-900/15 dark:to-indigo-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-violet-500 to-pink-500 group-hover:from-indigo-600 group-hover:via-violet-600 group-hover:to-pink-600 transition-colors duration-500"></div>
                      )}

                      {/* Content */}
                      <div className="relative z-10 p-6 flex flex-col h-full">
                        {/* Header Section */}
                        <div className="flex items-start gap-4 mb-3">
                          {/* Icon Container */}
                          <div className={`flex-shrink-0 relative transition-transform duration-500 ${!notification.is_read
                            ? "group-hover:scale-110 group-hover:rotate-3"
                            : "group-hover:scale-105"
                            }`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${!notification.is_read
                              ? "bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/30 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:shadow-indigo-500/50"
                              : "bg-slate-100 dark:bg-slate-700 shadow-slate-500/20 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                              }`}>
                              <Bell
                                size={20}
                                className={`transition-all duration-500 ${!notification.is_read
                                  ? "text-white"
                                  : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400"
                                  }`}
                              />
                            </div>
                          </div>

                          {/* Title and Badge */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className={`leading-snug transition-all duration-500 ${!notification.is_read
                                ? "text-lg font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600"
                                : "text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                                }`}>
                                {notification.title}
                              </h3>
                              {!notification.is_read && (
                                <div className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:shadow-indigo-500/40 transition-all duration-500">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('page.new')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Body Text */}
                        <div className="flex-1 mb-4">
                          <p className={`leading-relaxed transition-colors duration-500 ${!notification.is_read
                            ? "text-sm text-slate-700 dark:text-slate-200 group-hover:text-slate-800 dark:group-hover:text-slate-100"
                            : "text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                            }`}>
                            {notification.body}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 group-hover:border-indigo-100 dark:group-hover:border-indigo-800/30 transition-colors duration-500">
                          <div className="flex items-center justify-between">
                            {/* Time Info */}
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/60 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 group-hover:border-indigo-200/60 dark:group-hover:border-indigo-700/60 transition-all duration-500">
                                <Clock size={12} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-500" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-500">
                                  {formatTime(notification.created_at)}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors duration-500">
                                {formatFullDate(notification.created_at)}
                              </span>
                            </div>

                            {/* Action Button */}
                            {!notification.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="group/btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-500 relative overflow-hidden"
                                title={t('page.markAsRead')}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                                <Check size={12} className="relative z-10" />
                                <span className="text-xs font-semibold relative z-10">{t('page.markRead')}</span>
                              </button>
                            )}
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

NotificationsPage.propTypes = {
};

export default NotificationsPage;
