import React from "react";
import PropTypes from "prop-types";
import { BookOpen, ExternalLink } from "lucide-react";

const Prerequisites = ({ items }) => {
  return (
    <div className="my-4 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20 border-l-4 border-amber-500 dark:border-amber-400">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-white/60 dark:border-slate-700/60">
          <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
          Prerequisites
        </h4>
      </div>
      <ul className="space-y-2 ml-8">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
            {typeof item === 'string' ? (
              <span>{item}</span>
            ) : (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{item.title}</span>
                <ExternalLink size={14} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

Prerequisites.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
};

export default Prerequisites;


