import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { X, ExternalLink, Check, AlertCircle, Copy, Terminal, Layers, Zap, ThumbsUp, ThumbsDown, Star, Book, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CodeBlock from './CodeBlock';
import Skeleton from './Skeleton';

const ToolDetailsPanel = ({ tool, isOpen, onClose, isLoading, error, details }) => {
  const { t } = useTranslation('common');
  const panelRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset scroll position when panel opens or tool changes
  const contentRef = useRef(null);
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen, tool?.name]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="fixed top-0 bottom-0 right-0 z-[100] w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-l border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10">
          <div className="flex items-center gap-3">
            {tool?.icon && (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/40 dark:to-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                {tool.icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{tool?.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">{tool?.category}</span>
                {details?.github_stars && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-200/50 dark:border-amber-800/50 shadow-sm">
                    <Star size={11} fill="currentColor" className="animate-pulse" />
                    {details.github_stars.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Links */}
              {(details?.official_docs_url || details?.github_url) && (
                <div className="flex items-center gap-3 mt-2">
                  {details.official_docs_url && (
                    <a
                      href={details.official_docs_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                    >
                      <Book size={13} />
                      Docs
                    </a>
                  )}
                  {details.github_url && (
                    <a
                      href={details.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
                    >
                      <Github size={13} />
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110"
            aria-label="Close panel"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto min-h-0 p-6 pb-20 space-y-8">
          {isLoading ? (
            <div className="space-y-8 animate-pulse">
              {/* Overview Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>

              {/* Features Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-40 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Code Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-36 rounded-lg" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>

              {/* Use Cases Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-28 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-300">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Failed to load details</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          ) : details ? (
            <>
              {/* Overview */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Zap size={20} className="text-amber-500" />
                  Overview
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                  {details.overview}
                </p>
              </section>

              {/* Key Features */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Layers size={20} className="text-indigo-500" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {details.features?.map((feature, idx) => (
                    <div key={idx} className="group flex items-start gap-2.5 p-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all duration-200 hover:shadow-sm">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Code Example */}
              {details.code_example && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Terminal size={20} className="text-emerald-500" />
                    Code Example
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 px-4 py-2.5 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <span className="uppercase tracking-wide">{details.code_example.language}</span>
                      <Copy size={14} className="cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:scale-110" />
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
                      <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                        <code>{details.code_example.code}</code>
                      </pre>
                    </div>
                  </div>
                </section>
              )}

              {/* Use Cases */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Use Cases</h3>
                <div className="flex flex-wrap gap-2.5">
                  {details.use_cases?.map((useCase, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full border border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-sm transition-shadow">
                      {useCase}
                    </span>
                  ))}
                </div>
              </section>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <section className="p-4 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <ThumbsUp size={18} className="text-green-500" />
                    Pros
                  </h3>
                  <ul className="space-y-2.5">
                    {details.pros?.map((pro, idx) => (
                      <li key={idx} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0 shadow-sm"></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="p-4 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <ThumbsDown size={18} className="text-red-500" />
                    Cons
                  </h3>
                  <ul className="space-y-2.5">
                    {details.cons?.map((con, idx) => (
                      <li key={idx} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 shadow-sm"></span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Ecosystem */}
              {details.ecosystem?.length > 0 && (
                <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Related Ecosystem
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {details.ecosystem.map((item, idx) => (
                      <div key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-lg font-medium">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>,
    document.body
  );
};

ToolDetailsPanel.propTypes = {
  tool: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  details: PropTypes.object,
};

export default ToolDetailsPanel;
