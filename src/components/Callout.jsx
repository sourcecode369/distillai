import React from "react";
import PropTypes from "prop-types";
import { Info, AlertCircle, CheckCircle, Lightbulb, BookOpen } from "lucide-react";

const Callout = ({ type = "info", title, children }) => {
  // Shared base styles matching site design tokens - neutral base only
  const baseStyles = "my-4 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20";
  
  const config = {
    info: {
      icon: <Info className="w-5 h-5" />,
      accentBorder: "border-l-4 border-indigo-500 dark:border-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      titleColor: "text-indigo-900 dark:text-indigo-200",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      accentBorder: "border-l-4 border-amber-500 dark:border-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-900 dark:text-amber-200",
    },
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      accentBorder: "border-l-4 border-green-500 dark:border-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      titleColor: "text-green-900 dark:text-green-200",
    },
    tip: {
      icon: <Lightbulb className="w-5 h-5" />,
      accentBorder: "border-l-4 border-violet-500 dark:border-violet-400",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      titleColor: "text-violet-900 dark:text-violet-200",
    },
    note: {
      icon: <BookOpen className="w-5 h-5" />,
      accentBorder: "border-l-4 border-slate-400 dark:border-slate-500",
      iconBg: "bg-slate-100 dark:bg-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-400",
      titleColor: "text-slate-900 dark:text-slate-200",
    },
  };

  const style = config[type] || config.info;

  return (
    <div className={`${baseStyles} ${style.accentBorder}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${style.iconBg} border border-white/60 dark:border-slate-700/60`}>
          <div className={style.iconColor}>{style.icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-bold ${style.titleColor} mb-2 uppercase tracking-wide`}>
              {title}
            </h4>
          )}
          <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

Callout.propTypes = {
  type: PropTypes.oneOf(["info", "warning", "success", "tip", "note"]),
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Callout;

