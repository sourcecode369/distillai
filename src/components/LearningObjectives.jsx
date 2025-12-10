import React from "react";
import PropTypes from "prop-types";
import { Target } from "lucide-react";

const LearningObjectives = ({ objectives }) => {
  return (
    <div className="my-4 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20 border-l-4 border-indigo-500 dark:border-indigo-400">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 border border-white/60 dark:border-slate-700/60">
          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
          Learning Objectives
        </h4>
      </div>
      <ul className="space-y-2 ml-8">
        {objectives.map((objective, idx) => (
          <li key={idx} className="flex items-start gap-2 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            <span className="text-indigo-600 dark:text-indigo-400 mt-1">✓</span>
            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

LearningObjectives.propTypes = {
  objectives: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default LearningObjectives;


