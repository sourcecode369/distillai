import React from "react";
import PropTypes from "prop-types";
import { Youtube, FileText, Github, Box, ExternalLink, BookOpen } from "lucide-react";

// Memoized component to prevent re-renders when parent component updates
// This is a pure presentational component that only depends on props
// ResourceCard is rendered in lists, so memoization helps prevent unnecessary re-renders
const ResourceCard = React.memo(({ type, title, subtitle, link }) => {
  const iconConfig = {
    tutorial: { 
      icon: <Youtube className="w-6 h-6 text-red-500" />, 
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-200"
    },
    paper: { 
      icon: <FileText className="w-6 h-6 text-blue-500" />, 
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200"
    },
    repo: { 
      icon: <Github className="w-6 h-6 text-slate-900" />, 
      bg: "bg-gradient-to-br from-slate-50 to-slate-100",
      border: "border-slate-200"
    },
    blog: { 
      icon: <BookOpen className="w-6 h-6 text-purple-500" />, 
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      border: "border-purple-200"
    },
    tool: { 
      icon: <Box className="w-6 h-6 text-orange-500" />, 
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      border: "border-orange-200"
    },
  };

  const config = iconConfig[type] || iconConfig.tool;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 p-5 rounded-xl border border-white/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300/50 dark:hover:border-indigo-700/50 hover:shadow-elegant-hover hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden card-depth"
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className={`relative p-3 rounded-xl ${config.bg} border ${config.border} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
        {config.icon}
      </div>
      
      <div className="flex-1 min-w-0 relative z-10">
        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-xs text-gray-600 mt-1.5 line-clamp-1 font-medium">{subtitle}</p>
      </div>
      
      <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none"></div>
    </a>
  );
});

ResourceCard.displayName = 'ResourceCard';

ResourceCard.propTypes = {
  type: PropTypes.oneOf(["tutorial", "paper", "repo", "blog", "tool"]).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  link: PropTypes.string.isRequired,
};

export default ResourceCard;
