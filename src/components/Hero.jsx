import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const { t } = useTranslation("common");
  const label = backLabel || t("buttons.backToHome");

  return (
    <div className="relative border-b border-gray-800/60 bg-gray-950">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-10 top-0 h-32 w-80 rounded-full bg-indigo-600/8 blur-[80px]" />
        <div className="absolute right-0 top-0 h-24 w-56 rounded-full bg-violet-600/6 blur-[70px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-5 sm:py-7">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors group"
            aria-label={label}
          >
            {useArrowLeft ? (
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            ) : (
              <ArrowRight size={13} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            )}
            {label}
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: icon + title */}
          <div className="flex items-center gap-3.5 min-w-0">
            {icon && (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/25">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 leading-tight truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right: actions */}
          {rightActions && (
            <div className="flex-shrink-0">{rightActions}</div>
          )}
        </div>

        {/* Extra content (chips, metadata) */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  rightActions: PropTypes.node,
  onBack: PropTypes.func,
  backLabel: PropTypes.string,
  useArrowLeft: PropTypes.bool,
  children: PropTypes.node,
};

export default Hero;
