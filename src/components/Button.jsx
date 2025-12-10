import React from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

/**
 * Unified Button Component
 * 
 * Variants:
 * - primary: Main action button with gradient
 * - secondary: Secondary action with outline
 * - ghost: Minimal button with hover background
 * - destructive: For dangerous actions (delete, remove)
 * - icon: Icon-only button
 * - gradient: Featured button with enhanced gradient effects
 * 
 * Sizes:
 * - sm: Small
 * - md: Medium (default)
 * - lg: Large
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-xl gap-2",
    md: "px-5 py-2.5 text-base rounded-xl gap-2.5",
    lg: "px-6 py-3 text-lg rounded-2xl gap-3",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white hover:from-indigo-700 hover:via-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95",
    secondary: "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-md hover:shadow-lg active:scale-95",
    ghost: "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95",
    destructive: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95",
    icon: "p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 active:scale-95",
    gradient: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white hover:from-violet-600 hover:via-pink-600 hover:to-indigo-600 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_60px_-12px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  // Gradient variant has special effects
  const isGradient = variant === "gradient";

  // For icon-only buttons, ensure aria-label is provided
  const isIconOnly = variant === "icon" && !children;
  const buttonAriaLabel = ariaLabel || (isIconOnly ? children?.toString() : undefined);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
      aria-label={buttonAriaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {/* Gradient variant special effects */}
      {isGradient && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
        </>
      )}

      {/* Primary variant shimmer effect */}
      {variant === "primary" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </>
      )}

      <span className="relative z-10 flex items-center gap-2.5">
        {isLoading ? (
          <>
            <Loader2 size={size === "sm" ? 16 : size === "lg" ? 20 : 18} className="animate-spin" aria-hidden="true" />
            {children}
          </>
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} strokeWidth={2.5} aria-hidden="true" />
            )}
            {children}
            {Icon && iconPosition === "right" && (
              <Icon size={size === "sm" ? 16 : size === "lg" ? 20 : 18} strokeWidth={2.5} aria-hidden="true" />
            )}
          </>
        )}
      </span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost", "destructive", "icon", "gradient"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  "aria-label": PropTypes.string,
};

export default Button;



