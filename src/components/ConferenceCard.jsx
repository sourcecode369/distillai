import React from "react";
import PropTypes from "prop-types";
import { ExternalLink, Award } from "lucide-react";
import Card from "./Card";

/**
 * ConferenceCard Component
 * 
 * Displays conference information in a card format
 * Matches existing design system (gradients, badges, hover effects)
 */
const ConferenceCard = ({
  name,
  tier,
  domainTag,
  subtitle,
  frequency,
  usualMonth,
  badgeChip,
  url
}) => {
  return (
    <Card
      variant="featured"
      className="group flex-shrink-0 w-[380px] h-[340px] cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      <div className="flex flex-col h-full">
        {/* Header: Tier and Domain Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {/* Tier Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
            <Award size={12} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              {tier}
            </span>
          </div>

          {/* Domain Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 rounded-full border border-pink-200/50 dark:border-pink-800/50 shadow-sm">
            <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">
              {domainTag}
            </span>
          </div>
        </div>

        {/* Conference Name */}
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300">
          {name}
        </h3>

        {/* Gradient Divider */}
        <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-full mb-4 group-hover:h-1 transition-all duration-300"></div>

        {/* Subtitle/Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-auto leading-relaxed line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
          {subtitle}
        </p>

        {/* Metadata: Frequency and Month */}
        <div className="space-y-2 mb-4 mt-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[70px]">Frequency:</span>
            <span className="text-slate-600 dark:text-slate-400">{frequency}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[70px]">Usual month:</span>
            <span className="text-slate-600 dark:text-slate-400">{usualMonth}</span>
          </div>
        </div>

        {/* Footer: Badge Chip and Official Link */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-800/50 transition-colors mt-auto">
          {/* Badge Chip */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-md border border-green-200/50 dark:border-green-800/50 shadow-sm">
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
              {badgeChip}
            </span>
          </div>

          {/* Official Site Button */}
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 relative overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            aria-label={`Visit ${name} official website`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

            <span className="relative z-10">Official site</span>
            <ExternalLink size={12} className="flex-shrink-0 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </Card>
  );
};

ConferenceCard.propTypes = {
  name: PropTypes.string.isRequired,
  tier: PropTypes.string.isRequired,
  domainTag: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  frequency: PropTypes.string.isRequired,
  usualMonth: PropTypes.string.isRequired,
  badgeChip: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default ConferenceCard;
