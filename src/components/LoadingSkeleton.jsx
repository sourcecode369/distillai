import React from "react";
import PropTypes from "prop-types";

// Enhanced skeleton with shimmer effect
const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]";

export const CardSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-br from-white via-white to-indigo-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-3xl p-6 border border-white/80 dark:border-slate-700/80 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 flex flex-col h-full overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${shimmerClass}`}></div>
        <div className={`w-20 h-6 rounded-lg ${shimmerClass}`}></div>
      </div>
      <div className={`h-6 rounded mb-3 w-3/4 ${shimmerClass}`}></div>
      <div className="space-y-2 mb-4 flex-1">
        <div className={`h-3 rounded w-full ${shimmerClass}`}></div>
        <div className={`h-3 rounded w-5/6 ${shimmerClass}`}></div>
        <div className={`h-3 rounded w-4/6 ${shimmerClass}`}></div>
      </div>
      <div className="h-px bg-gray-200 dark:bg-slate-700 mb-4"></div>
      <div className="flex justify-end">
        <div className={`w-8 h-8 rounded-xl ${shimmerClass}`}></div>
      </div>
    </div>
  );
};

export const TextSkeleton = ({ lines = 3, className = "" }) => {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]";
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded ${shimmerClass} ${
            i === lines - 1 ? "w-3/4" : "w-full"
          }`}
        ></div>
      ))}
    </div>
  );
};

TextSkeleton.propTypes = {
  lines: PropTypes.number,
  className: PropTypes.string,
};

// Profile page skeleton
export const ProfileSkeleton = () => {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]";
  return (
    <div className="min-h-screen relative z-10">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`h-4 w-32 rounded mb-6 ${shimmerClass}`}></div>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${shimmerClass}`}></div>
            <div className="flex-1">
              <div className={`h-8 w-48 rounded mb-2 ${shimmerClass}`}></div>
              <div className={`h-5 w-64 rounded ${shimmerClass}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Left Card */}
          <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 ${shimmerClass}`}>
            <div className={`w-32 h-32 rounded-2xl mx-auto mb-4 ${shimmerClass}`}></div>
            <div className={`h-6 w-40 rounded mx-auto mb-2 ${shimmerClass}`}></div>
            <div className={`h-4 w-24 rounded mx-auto ${shimmerClass}`}></div>
          </div>
          {/* Right Card */}
          <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 sm:p-8 space-y-6 ${shimmerClass}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className={`h-5 w-32 rounded ${shimmerClass}`}></div>
                <div className={`h-10 w-full rounded-xl ${shimmerClass}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin dashboard skeleton
export const AdminDashboardSkeleton = () => {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]";
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`h-10 w-64 rounded-2xl mb-8 ${shimmerClass}`}></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-32 rounded-2xl ${shimmerClass}`}></div>
          ))}
        </div>
        <div className={`h-96 rounded-2xl ${shimmerClass}`}></div>
      </div>
    </div>
  );
};

// List item skeleton
export const ListItemSkeleton = () => {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]";
  return (
    <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${shimmerClass}`}></div>
        <div className="flex-1 space-y-2">
          <div className={`h-5 w-3/4 rounded ${shimmerClass}`}></div>
          <div className={`h-4 w-1/2 rounded ${shimmerClass}`}></div>
        </div>
      </div>
    </div>
  );
};

// Progress page skeleton
export const ProgressSkeleton = () => {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]";
  return (
    <div className="min-h-screen relative z-10">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`h-4 w-32 rounded mb-6 ${shimmerClass}`}></div>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${shimmerClass}`}></div>
            <div className="flex-1">
              <div className={`h-8 w-48 rounded mb-2 ${shimmerClass}`}></div>
              <div className={`h-5 w-64 rounded ${shimmerClass}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Learning Progress Card */}
          <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 sm:p-8 ${shimmerClass}`}>
            <div className={`h-6 w-40 rounded mb-6 ${shimmerClass}`}></div>
            <div className={`h-32 rounded-xl mb-4 ${shimmerClass}`}></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-24 rounded-xl ${shimmerClass}`}></div>
              ))}
            </div>
          </div>

          {/* Quiz History Card */}
          <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 sm:p-8 ${shimmerClass}`}>
            <div className={`h-6 w-32 rounded mb-6 ${shimmerClass}`}></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-20 rounded-xl ${shimmerClass}`}></div>
              ))}
            </div>
          </div>

          {/* Achievements Card */}
          <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 sm:p-8 ${shimmerClass}`}>
            <div className={`h-6 w-48 rounded mb-6 ${shimmerClass}`}></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-32 rounded-xl ${shimmerClass}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

