import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { dbHelpers } from "../lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const { t } = useTranslation('notification');
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ["notifications-unread", user?.id],
    queryFn: async () => {
      if (!user?.id) return { count: 0 };
      return await dbHelpers.getUnreadCount(user.id);
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = unreadData?.count || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 touch-manipulation relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
        title={t('bell.title')}
        aria-label={unreadCount > 0 ? t('bell.ariaLabelUnread', { count: unreadCount }) : t('bell.ariaLabel')}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1.5 flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full ring-2 ring-gray-950 shadow-lg animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 sm:right-0 left-auto sm:left-auto mt-2 z-50" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
          <NotificationDropdown
            onClose={() => setIsDropdownOpen(false)}
            onMarkAllRead={() => {
              queryClient.invalidateQueries({ queryKey: ["notifications-unread", user.id] });
              queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
