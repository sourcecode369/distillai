import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { 
  Search, BookOpen, Bookmark, History, Users, FileText, 
  AlertCircle, Inbox, Sparkles, ArrowRight, RefreshCw, XCircle
} from "lucide-react";

const EmptyState = ({ 
  icon: Icon = Inbox,
  title,
  description,
  action,
  onAction,
  className = "",
  variant = "default" // default, search, bookmark, history, error
}) => {
  const variants = {
    default: {
      iconBg: "bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-pink-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200/60 dark:border-indigo-800/40",
    },
    search: {
      iconBg: "bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-violet-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200/60 dark:border-blue-800/40",
    },
    bookmark: {
      iconBg: "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-pink-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200/60 dark:border-amber-800/40",
    },
    history: {
      iconBg: "bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-indigo-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200/60 dark:border-purple-800/40",
    },
    error: {
      iconBg: "bg-gradient-to-br from-red-100 via-rose-100 to-pink-100 dark:from-red-900/30 dark:via-rose-900/30 dark:to-pink-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      border: "border-red-200/60 dark:border-red-800/40",
    },
  };

  const config = variants[variant] || variants.default;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className={`relative mb-6 ${config.iconBg} rounded-2xl p-6 border ${config.border} shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-900/50 rounded-2xl"></div>
        <Icon 
          size={48} 
          className={`relative ${config.iconColor} drop-shadow-sm`}
          strokeWidth={1.5}
        />
        <div className="absolute -top-1 -right-1">
          <Sparkles size={16} className={`${config.iconColor} opacity-60 animate-pulse`} />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      
      {action && onAction && (
        <button
          onClick={onAction}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:via-indigo-600 hover:to-violet-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
        >
          <span>{action}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "search", "bookmark", "history", "error"]),
};

// Pre-configured empty states
export const EmptySearch = ({ searchQuery, onClear }) => {
  const { t } = useTranslation('app');
  return (
    <EmptyState
      icon={Search}
      title={t('search.noResults.title')}
      description={searchQuery ? t('search.noResults.description', { query: searchQuery }) : t('search.startTyping.description')}
      action={searchQuery ? t('search.noResults.clear') : undefined}
      onAction={onClear}
      variant="search"
    />
  );
};

EmptySearch.propTypes = {
  searchQuery: PropTypes.string,
  onClear: PropTypes.func,
};

export const EmptyBookmarks = ({ onExplore }) => {
  const { t } = useTranslation('app');
  return (
    <EmptyState
      icon={Bookmark}
      title={t('bookmarks.empty.title')}
      description={t('bookmarks.empty.description')}
      action={t('bookmarks.empty.action')}
      onAction={onExplore}
      variant="bookmark"
    />
  );
};

EmptyBookmarks.propTypes = {
  onExplore: PropTypes.func,
};

export const EmptyHistory = ({ onExplore }) => {
  const { t } = useTranslation('app');
  return (
    <EmptyState
      icon={History}
      title={t('history.empty.title')}
      description={t('history.empty.description')}
      action={t('history.empty.action')}
      onAction={onExplore}
      variant="history"
    />
  );
};

EmptyHistory.propTypes = {
  onExplore: PropTypes.func,
};

export const EmptyTopics = ({ category, onBack }) => {
  const { t } = useTranslation('app');
  return (
    <EmptyState
      icon={FileText}
      title={t('emptyStates.topics.title', { category: category || t('labels.category') })}
      description={t('emptyStates.topics.description')}
      action={t('emptyStates.topics.action')}
      onAction={onBack}
    />
  );
};

EmptyTopics.propTypes = {
  category: PropTypes.string,
  onBack: PropTypes.func,
};

export const EmptyUsers = ({ searchQuery }) => {
  const { t } = useTranslation('admin');
  return (
    <EmptyState
      icon={Users}
      title={searchQuery ? t('users.empty.title') : t('users.empty.title')}
      description={searchQuery ? t('users.empty.description', { query: searchQuery }) : t('users.empty.description')}
    />
  );
};

EmptyUsers.propTypes = {
  searchQuery: PropTypes.string,
};

// Error state component
export const ErrorState = ({ title, description, error, onRetry, className = "" }) => {
  const { t } = useTranslation('app');
  
  return (
    <EmptyState
      icon={XCircle}
      title={title || t('errors.generic.title', { defaultValue: 'Something went wrong' })}
      description={description || error?.message || t('errors.generic.description', { defaultValue: 'An error occurred while loading data. Please try again.' })}
      action={onRetry ? t('errors.generic.retry', { defaultValue: 'Try Again' }) : undefined}
      onAction={onRetry}
      variant="error"
      className={className}
    />
  );
};

ErrorState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  className: PropTypes.string,
};

export default EmptyState;



