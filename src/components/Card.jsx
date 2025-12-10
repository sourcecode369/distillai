import React from "react";
import PropTypes from "prop-types";

/**
 * Unified Card Component
 * 
 * Variants:
 * - base: Standard card with subtle styling
 * - info: Informational card with enhanced borders
 * - interactive: Card with hover effects for clickable content
 * - featured: Premium card with gradients and enhanced effects
 * - dashboard: Metric/stats card for dashboards
 * 
 * All cards follow the design system:
 * - Consistent padding, border radius, shadows
 * - Matching hover states and transitions
 * - Unified gradient usage
 */
const Card = ({
  children,
  variant = "base",
  className = "",
  onClick,
  hoverable = false,
  ...props
}) => {
  const baseClasses = "relative bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-500 ease-out overflow-hidden";

  const variantClasses = {
    base: "border-slate-200/60 dark:border-slate-700/60 shadow-md shadow-slate-500/5 dark:shadow-slate-900/20",
    info: "border-indigo-200/60 dark:border-indigo-800/40 bg-gradient-to-br from-white via-white to-indigo-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10",
    interactive: "border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 hover:border-indigo-300/60 dark:hover:border-indigo-700/60 hover:shadow-2xl hover:shadow-indigo-500/25 dark:hover:shadow-indigo-500/25 hover:-translate-y-2.5 cursor-pointer",
    featured: "border-white/80 dark:border-slate-700/80 bg-gradient-to-br from-white via-white to-indigo-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 backdrop-blur-xl shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10 hover:shadow-2xl hover:shadow-indigo-500/25 dark:hover:shadow-indigo-500/25 hover:-translate-y-2.5",
    dashboard: "border-gray-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 hover:-translate-y-0.5",
  };

  const paddingClasses = {
    base: "p-6",
    info: "p-6",
    interactive: "p-6",
    featured: "p-6",
    dashboard: "p-6",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[variant]} ${hoverable || onClick ? "cursor-pointer" : ""} ${className}`;

  // Interactive and featured variants have special hover effects
  const hasHoverEffects = variant === "interactive" || variant === "featured";

  // Memoize keydown handler to prevent recreating on every render
  // This handler is only needed for interactive cards, so we memoize it
  const handleKeyDown = React.useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  }, [onClick]);

  return (
    <div
      className={classes}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      {...props}
    >
      {/* Glow effect for interactive and featured cards */}
      {hasHoverEffects && (
        <>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-700 -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-violet-500/3 group-hover:to-pink-500/5 dark:group-hover:from-indigo-500/10 dark:group-hover:via-violet-500/5 dark:group-hover:to-pink-500/10 rounded-2xl transition-all duration-700"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["base", "info", "interactive", "featured", "dashboard"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
};

// Pre-configured card components for common use cases
export const TopicCard = ({ children, onClick, className = "" }) => (
  <Card variant="interactive" onClick={onClick} className={`group ${className}`}>
    {children}
  </Card>
);

TopicCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export const FeatureCard = ({ children, onClick, className = "" }) => (
  <Card variant="featured" onClick={onClick} className={`group ${className}`}>
    {children}
  </Card>
);

FeatureCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export const InfoCard = ({ children, className = "" }) => (
  <Card variant="info" className={className}>
    {children}
  </Card>
);

InfoCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const MetricCard = ({ children, className = "" }) => (
  <Card variant="dashboard" className={className}>
    {children}
  </Card>
);

MetricCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;

