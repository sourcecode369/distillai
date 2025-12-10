import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft } from "lucide-react";

/**
 * Reusable Hero Component
 * 
 * Displays a hero section with title, subtitle, icon, and optional actions.
 * Used across the application for consistent page headers.
 * 
 * @param {Object} props
 * @param {string} props.title - Hero title
 * @param {string} props.subtitle - Hero subtitle/description
 * @param {React.ReactNode} props.icon - Icon element (e.g., <Brain size={22} />)
 * @param {React.ReactNode} props.rightActions - Optional right-side action buttons/content
 * @param {Function} props.onBack - Optional back button handler
 * @param {string} props.backLabel - Optional back button label (default: "Back to Home")
 * @param {boolean} props.useArrowLeft - Use ArrowLeft instead of ArrowRight for back button
 * @param {React.ReactNode} props.children - Optional additional content (e.g., metadata chips)
 */
const Hero = ({
  title,
  subtitle,
  icon,
  rightActions,
  onBack,
  backLabel,
  useArrowLeft = false,
  children,
}) => {
  const { t } = useTranslation('common');
  const defaultBackLabel = backLabel || t('buttons.backToHome');
  return (
    <section className="w-full backdrop-blur-2xl bg-white/3 dark:bg-white/3 border-b border-white/10 dark:border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] py-4 sm:py-6 lg:py-10 hero-fade-in">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className={`flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-12 ${rightActions ? 'lg:justify-between' : ''}`}>
          {/* Left Side: Back Link + Icon + Title + Subtitle */}
          <div className={`space-y-2.5 sm:space-y-3.5 min-w-0 flex-1 ${rightActions ? 'lg:flex-initial lg:max-w-2xl' : ''}`}>
            {/* Back Link */}
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group mb-0.5 sm:mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded touch-manipulation min-h-[44px] -ml-1 pl-1"
                aria-label={defaultBackLabel}
              >
                {useArrowLeft ? (
                  <ArrowLeft className="group-hover:-translate-x-0.5 transition-transform duration-200 flex-shrink-0" size={16} aria-hidden="true" />
                ) : (
                  <ArrowRight className="rotate-180 group-hover:-translate-x-0.5 transition-transform duration-200 flex-shrink-0" size={16} aria-hidden="true" />
                )}
                <span className="break-words">{defaultBackLabel}</span>
              </button>
            )}

            {/* Additional Content (e.g., metadata chips) */}
            {children && (
              <div className="mb-0.5 sm:mb-1">
                {children}
              </div>
            )}

            {/* Icon + Title + Subtitle */}
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Icon with consistent glow and micro-interactions */}
              <div className="relative flex-shrink-0 group/icon cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-600 rounded-xl sm:rounded-2xl blur-lg opacity-30 group-hover/icon:opacity-35 transition-opacity duration-500 ease-out"></div>
                <div className="relative p-2.5 sm:p-3.5 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-md group-hover/icon:shadow-xl group-hover/icon:shadow-indigo-500/20 group-hover/icon:scale-[1.02] transition-all duration-500 ease-out">
                  <div className="group-hover/icon:scale-105 transition-transform duration-500 ease-out">
                    {icon}
                  </div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 min-w-0 pt-0 sm:pt-0.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 dark:text-white mb-2 sm:mb-2.5 tracking-tight leading-tight break-words">
                  {title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl font-light break-words">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side: Action Buttons */}
          {rightActions && (
            <div className="flex items-stretch sm:items-center gap-2 sm:gap-3 lg:items-start lg:pt-8 lg:flex-shrink-0 lg:ml-auto hero-cta-wrapper mt-2 sm:mt-0">
              {rightActions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.node,
  rightActions: PropTypes.node,
  onBack: PropTypes.func,
  backLabel: PropTypes.string,
  useArrowLeft: PropTypes.bool,
  children: PropTypes.node,
};

export default Hero;

