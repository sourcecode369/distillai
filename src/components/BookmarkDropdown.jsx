import React, { memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Bookmark, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const BookmarkDropdown = ({ onClose }) => {
  const { t } = useTranslation('bookmark');
  const { user } = useAuth();
  const { bookmarks } = useApp();
  const navigate = useNavigate();

  // Get recent bookmarks (3 most recent)
  const recentBookmarks = bookmarks
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 3);

  const handleViewAll = () => {
    navigate('/bookmarks');
    onClose();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return t('dropdown.time.recently');
    const date = new Date(timestamp);
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

  const handleBookmarkClick = async (e, bookmark) => {
    e.stopPropagation();

    // Close dropdown first
    onClose();

    // Navigate based on bookmark type
    if (bookmark.type === 'topic' || !bookmark.type) {
      if (bookmark.topicId) {
        navigate(`/topic/${bookmark.categoryId}/${bookmark.topicId}`);
      } else {
        navigate(`/category/${bookmark.categoryId}`);
      }
    }
  };

  return (
    <div
      data-bookmark-dropdown
      className="w-full sm:w-80 bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 opacity-50 blur-xl pointer-events-none" />

      {/* Header */}
      <div className="relative p-5 border-b border-slate-800/50 bg-gradient-to-r from-indigo-900/30 via-violet-900/20 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
            <Bookmark size={18} className="text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100">{t('dropdown.title')}</h3>
          {bookmarks.length > 0 && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold rounded-full shadow-md shadow-indigo-500/30">
              {bookmarks.length}
            </span>
          )}
        </div>
      </div>

      {/* Bookmarks List - Limited to 3 */}
      <div className="relative max-h-[420px] overflow-y-auto">
        {recentBookmarks.length === 0 ? (
          <div className="p-10 text-center">
            <div className="p-3 rounded-xl bg-slate-800/60 w-fit mx-auto mb-4 border border-slate-700/50">
              <Bookmark size={20} className="text-slate-500" />
            </div>
            <p className="text-sm text-slate-400">{t('dropdown.empty.title')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('dropdown.empty.description')}</p>
          </div>
        ) : (
          <div>
            {recentBookmarks.map((bookmark, index) => (
              <div
                key={bookmark.id}
                className={`group relative px-4 py-2.5 cursor-pointer transition-all duration-300 border-b border-slate-800/30 last:border-b-0 overflow-hidden hover:bg-slate-800/50`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkClick(e, bookmark);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 border border-indigo-500/30">
                    <Bookmark size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {bookmark.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mb-1.5">
                      {bookmark.categoryTitle}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">
                        {formatTime(bookmark.timestamp)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Show if there are bookmarks */}
      {bookmarks.length > 0 && (
        <div className="relative px-4 py-3 border-t border-slate-800/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewAll();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-all duration-300 py-2.5 rounded-xl relative overflow-hidden border border-transparent hover:border-indigo-500/30 hover:bg-slate-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">
              {bookmarks.length > 3 ? t('dropdown.viewAllCount', { count: bookmarks.length }) : t('dropdown.viewAll')}
            </span>
            <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(BookmarkDropdown, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.onClose === nextProps.onClose
  );
});

BookmarkDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
};
