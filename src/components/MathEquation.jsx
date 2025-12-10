import React from "react";
import PropTypes from "prop-types";

const MathEquation = ({ equation, display = "inline", label }) => {
  const isBlock = display === "block";
  
  return (
    <div className={`my-4 ${isBlock ? "w-full" : "inline-block"}`}>
      {isBlock && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-r-lg p-4 overflow-x-auto shadow-sm shadow-slate-200/40 dark:shadow-slate-900/20">
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                {label}
              </span>
            )}
          </div>
          <div className="font-mono text-base md:text-lg text-gray-900 dark:text-gray-100 font-semibold text-center py-3 px-4" style={{ lineHeight: '1.8', letterSpacing: '0.02em' }}>
            {equation}
          </div>
        </div>
      )}
      {!isBlock && (
        <span className="font-mono text-base text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded mx-1">
          {equation}
        </span>
      )}
    </div>
  );
};

MathEquation.propTypes = {
  equation: PropTypes.string.isRequired,
  display: PropTypes.oneOf(["inline", "block"]),
  label: PropTypes.string,
};

export default MathEquation;

