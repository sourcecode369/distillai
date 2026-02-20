import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { dbHelpers } from "../lib/supabase";
import { Bell, CheckCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ onClose, onMarkAllRead }) => {
  const { t } = useTranslation('notification');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch latest notifications (only 3 for dropdown)
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications", user?.id, "latest"],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      return await dbHelpers.getNotifications(user.id, 3);
    },
    enabled: !!user?.id,
  });

  // Get total count to show "View all" if there are more
  const { data: totalCountData } = useQuery({
    queryKey: ["notifications-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return { count: 0 };
      const result = await dbHelpers.getNotifications(user.id, 100);
      return { count: result?.data?.length || 0 };
    },
    enabled: !!user?.id,
  });

  const notifications = notificationsData?.data || [];
  const totalCount = totalCountData?.count || 0;
  const hasMore = totalCount > 3;
  const unreadNotifications = notifications.filter((n) => !n.is_read);

  const handleMarkAsRead = async (notificationId) => {
    if (!user?.id) return;
    await dbHelpers.markNotificationAsRead(notificationId, user.id);
    queryClient.invalidateQueries({ queryKey: ["notifications-unread", user.id] });
    queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id || unreadNotifications.length === 0) return;
    await dbHelpers.markAllNotificationsAsRead(user.id);
    queryClient.invalidateQueries({ queryKey: ["notifications-unread", user.id] });
    queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
    onMarkAllRead?.();
  };

  const handleViewAll = () => {
    navigate('/notifications');
    onClose();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('dropdown.time.justNow');
    if (diffMins < 60) return t('dropdown.time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('dropdown.time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('dropdown.time.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  return (
    <div
      className="w-full sm:w-64 bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
      role="menu"
      aria-label={t('dropdown.ariaLabel')}
      aria-live="polite"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 opacity-50 blur-xl pointer-events-none" />

      {/* Header */}
      <div className="relative px-4 pt-4 pb-3 border-b border-slate-800/50 bg-gradient-to-r from-indigo-900/30 via-violet-900/20 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30" aria-hidden="true">
              <Bell size={15} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">{t('dropdown.title')}</h3>
            {unreadNotifications.length > 0 && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </div>
        </div>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="mt-2 -mx-4 flex items-center justify-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold py-2 hover:bg-slate-800/50 transition-all border-t border-slate-800/40"
          >
            <CheckCheck size={13} aria-hidden="true" />
            {t('dropdown.markAllRead')}
          </button>
        )}
      </div>

      {/* Notifications List - Limited to 3 */}
      <div className="relative max-h-[420px] overflow-y-auto">
        {isLoading ? (
          <div className="p-10 text-center">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-sm text-slate-400">{t('dropdown.loading')}</p>
          </div>
        ) : notifications.length === 0 ? (
          null
        ) : (
          <div>
            {notifications.slice(0, 3).map((notification, index) => (
              <div
                key={notification.id}
                className={`group relative px-4 py-2.5 cursor-pointer transition-all duration-300 border-b border-slate-800/30 last:border-b-0 overflow-hidden ${!notification.is_read ? "bg-slate-800/50" : ""} hover:bg-slate-800/50`}
                onClick={() => {
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id);
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-start gap-3">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 border ${!notification.is_read
                      ? "bg-indigo-500 text-white border-indigo-500 group-hover:bg-indigo-600"
                      : "bg-slate-800/60 text-slate-500 border-slate-700/50 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30"
                    }`}>
                    <Bell size={14} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`text-sm leading-snug transition-colors duration-300 ${!notification.is_read
                          ? "font-semibold text-slate-100 group-hover:text-indigo-300"
                          : "font-medium text-slate-300 group-hover:text-slate-100"
                        }`}>
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0 mt-1.5 group-hover:bg-indigo-300 transition-colors duration-300"></div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-1.5 leading-relaxed transition-colors duration-300 group-hover:text-slate-300">
                      {notification.body}
                    </p>
                    <span className="text-[10px] text-slate-500 transition-colors duration-300 group-hover:text-slate-400">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Show if there are notifications or more available */}
      {(notifications.length > 0 || hasMore) && (
        <div className="relative px-4 py-3 border-t border-slate-800/50">
          <button
            onClick={handleViewAll}
            className="group w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-all duration-300 py-2.5 rounded-xl relative overflow-hidden border border-transparent hover:border-indigo-500/30 hover:bg-slate-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">{hasMore ? t('dropdown.viewAllCount', { count: totalCount }) : t('dropdown.viewAll')}</span>
            <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

NotificationDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
  onMarkAllRead: PropTypes.func,
};

export default NotificationDropdown;
