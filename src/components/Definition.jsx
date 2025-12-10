import React, { useState } from "react";
import PropTypes from "prop-types";
import { BookOpen, X } from "lucide-react";

const Definition = ({ term, definition, inline = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (inline) {
    return (
      <span className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-indigo-600 dark:text-indigo-400 font-semibold underline decoration-dotted underline-offset-2 hover:decoration-solid transition-all cursor-help"
        >
          {term}
        </button>
        {isOpen && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 rounded-lg shadow-lg z-50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{term}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{definition}</p>
          </div>
        )}
      </span>
    );
  }

  return (
    <div className="my-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-r-lg">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <dt className="font-bold text-gray-900 dark:text-gray-100 mb-1">{term}</dt>
          <dd className="text-gray-700 dark:text-gray-300 leading-relaxed">{definition}</dd>
        </div>
      </div>
    </div>
  );
};

Definition.propTypes = {
  term: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
  inline: PropTypes.bool,
};

export default Definition;




