import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StatCard Component
 * 
 * Displays a metric card with icon, title, value, and optional trend indicator.
 * Used in the admin dashboard analytics section to show key performance indicators.
 * 
 * @param {Object} props
 * @param {string} props.title - The metric title/label
 * @param {string|number} props.value - The metric value to display
 * @param {React.ComponentType} props.icon - Icon component from lucide-react
 * @param {string} props.gradient - Tailwind gradient classes (e.g., "from-indigo-500 to-indigo-600")
 * @param {string|null} props.trend - Optional trend text to display (e.g., "+10 this week")
 */
const StatCard = ({ title, value, icon: Icon, gradient, trend }) => {
  /**
   * Determines icon color based on gradient type
   * Maps gradient colors to corresponding text color classes
   * @returns {string} Tailwind text color classes
   */
  const getIconColor = () => {
    if (gradient.includes('indigo')) return 'text-indigo-600 dark:text-indigo-400';
    if (gradient.includes('violet')) return 'text-violet-600 dark:text-violet-400';
    if (gradient.includes('teal')) return 'text-teal-600 dark:text-teal-400';
    if (gradient.includes('pink')) return 'text-pink-600 dark:text-pink-400';
    if (gradient.includes('purple')) return 'text-purple-600 dark:text-purple-400';
    if (gradient.includes('rose')) return 'text-rose-600 dark:text-rose-400';
    if (gradient.includes('amber')) return 'text-amber-600 dark:text-amber-400';
    if (gradient.includes('cyan')) return 'text-cyan-600 dark:text-cyan-400';
    if (gradient.includes('emerald')) return 'text-emerald-600 dark:text-emerald-400';
    return 'text-indigo-600 dark:text-indigo-400';
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden h-full flex flex-col",
      "border-border/60",
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background",
      "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      "rounded-2xl",
      "transition-all duration-300",
      "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
      "hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
    )}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            `bg-gradient-to-br ${gradient}`,
            "bg-opacity-10 dark:bg-opacity-20",
            "backdrop-blur-sm",
            "border border-border/40",
            "transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-lg",
            "shadow-sm"
          )}>
            {Icon && <Icon size={20} className={cn(getIconColor(), "drop-shadow-sm")} />}
          </div>
          {trend && (
            <Badge variant="secondary" className="flex items-center gap-1.5 text-xs font-semibold">
              <TrendingUp size={12} />
              <span>{trend}</span>
            </Badge>
          )}
        </div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider uppercase">
          {title}
        </h3>
        <p className="text-3xl font-semibold text-foreground tracking-tight mt-auto">
          {value}
        </p>
      </CardContent>
    </Card>
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

