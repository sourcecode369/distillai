import React from "react";
import PropTypes from "prop-types";
import { TrendingUp } from "lucide-react";

const GRADIENT_COLORS = {
  indigo:  { bg: "bg-indigo-600/10 border-indigo-500/20",   icon: "bg-indigo-600/20 border-indigo-500/30 text-indigo-400", text: "text-indigo-400" },
  violet:  { bg: "bg-violet-600/10 border-violet-500/20",   icon: "bg-violet-600/20 border-violet-500/30 text-violet-400", text: "text-violet-400" },
  teal:    { bg: "bg-teal-600/10 border-teal-500/20",       icon: "bg-teal-600/20 border-teal-500/30 text-teal-400",       text: "text-teal-400" },
  pink:    { bg: "bg-pink-600/10 border-pink-500/20",       icon: "bg-pink-600/20 border-pink-500/30 text-pink-400",       text: "text-pink-400" },
  purple:  { bg: "bg-purple-600/10 border-purple-500/20",   icon: "bg-purple-600/20 border-purple-500/30 text-purple-400", text: "text-purple-400" },
  rose:    { bg: "bg-rose-600/10 border-rose-500/20",       icon: "bg-rose-600/20 border-rose-500/30 text-rose-400",       text: "text-rose-400" },
  amber:   { bg: "bg-amber-600/10 border-amber-500/20",     icon: "bg-amber-600/20 border-amber-500/30 text-amber-400",    text: "text-amber-400" },
  cyan:    { bg: "bg-cyan-600/10 border-cyan-500/20",       icon: "bg-cyan-600/20 border-cyan-500/30 text-cyan-400",       text: "text-cyan-400" },
  emerald: { bg: "bg-emerald-600/10 border-emerald-500/20", icon: "bg-emerald-600/20 border-emerald-500/30 text-emerald-400", text: "text-emerald-400" },
};

const getColorKey = (gradient) => {
  for (const key of Object.keys(GRADIENT_COLORS)) {
    if (gradient.includes(key)) return key;
  }
  return "indigo";
};

const StatCard = ({ title, value, icon: Icon, gradient, trend }) => {
  const colors = GRADIENT_COLORS[getColorKey(gradient)];

  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${colors.bg} bg-gray-900/60 backdrop-blur-sm p-5 transition-all duration-200 hover:brightness-110`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center justify-center h-10 w-10 rounded-xl border ${colors.icon} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
          {Icon && <Icon size={18} strokeWidth={2} />}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
            <TrendingUp size={10} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-extrabold text-gray-100 tracking-tight leading-none mb-1.5">
        {value}
      </p>
      <p className={`text-[11px] font-semibold uppercase tracking-widest ${colors.text}`}>
        {title}
      </p>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  gradient: PropTypes.string.isRequired,
  trend: PropTypes.string,
};

export default StatCard;
