import React from "react";
import PropTypes from "prop-types";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Table of Contents component for TopicView
 * Shows navigation for different sections of the article
 */
const TopicTableOfContents = ({ 
  tableOfContents, 
  activeSection, 
  isMobileOpen, 
  onMobileToggle,
  onSectionClick 
}) => {
  const handleSectionClick = (itemId, e) => {
    e?.preventDefault();
    if (onSectionClick) {
      onSectionClick(itemId);
    } else {
      const element = document.getElementById(itemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (isMobileOpen !== undefined) {
      onMobileToggle?.(false);
    }
  };

  const tocContent = (
    <nav className="space-y-0.5" role="navigation" aria-label="Table of contents">
      {tableOfContents.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => handleSectionClick(item.id, e)}
          className={`block pl-4 py-2.5 border-l-4 text-sm rounded-r-lg transition-all duration-200 min-h-[44px] flex items-center ${
            activeSection === item.id
              ? "border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50/80 dark:bg-indigo-900/30 shadow-sm shadow-indigo-500/10 dark:shadow-indigo-900/20"
              : "border-transparent text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300/60 dark:hover:border-indigo-600/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/15 font-medium"
          }`}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );

  // Mobile version with dropdown
  if (isMobileOpen !== undefined) {
    return (
      <div className="lg:hidden mb-6 sm:mb-8">
        <button
          onClick={() => onMobileToggle?.(!isMobileOpen)}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg touch-manipulation min-h-[44px] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Toggle table of contents"
          aria-expanded={isMobileOpen}
        >
          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2">
            <Menu size={16} className="flex-shrink-0" aria-hidden="true" />
            On This Page
          </span>
          {isMobileOpen ? <ChevronUp size={20} className="flex-shrink-0" aria-hidden="true" /> : <ChevronDown size={20} className="flex-shrink-0" aria-hidden="true" />}
        </button>
        {isMobileOpen && (
          <div className="mt-2 p-3 sm:p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
            <nav className="space-y-1" role="navigation" aria-label="Table of contents">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleSectionClick(item.id, e)}
                  className={`block py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-all border-l-4 min-h-[44px] flex items-center touch-manipulation active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    activeSection === item.id
                      ? "border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50/80 dark:bg-indigo-900/30 shadow-sm shadow-indigo-500/10 dark:shadow-indigo-900/20"
                      : "border-transparent text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300/60 dark:hover:border-indigo-600/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/15 font-medium"
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:mt-8 lg:ml-0 lg:mr-28 lg:-translate-x-12" style={{ minWidth: '256px', flexShrink: 0 }}>
      <div className="overflow-y-auto rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20">
        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2.5 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200/60 dark:border-indigo-800/60">
            <Menu size={14} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          On This Page
        </h5>
        {tocContent}
      </div>
    </aside>
  );
};

TopicTableOfContents.propTypes = {
  tableOfContents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      level: PropTypes.number,
    })
  ).isRequired,
  activeSection: PropTypes.string.isRequired,
  isMobileOpen: PropTypes.bool,
  onMobileToggle: PropTypes.func,
  onSectionClick: PropTypes.func,
};

export default TopicTableOfContents;

