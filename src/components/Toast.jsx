import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { CheckCircle2, XCircle, Info, X, Sparkles, AlertCircle } from "lucide-react";

const Toast = ({ 
  message, 
  title,
  type = "success", 
  onClose, 
  duration = 2500 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colorConfigs = {
    success: {
      bg: "bg-gradient-to-br from-green-500 to-emerald-600",
      border: "border-green-400/50",
      glow: "shadow-green-500/30",
      iconBg: "bg-green-500",
      text: "text-green-700 dark:text-green-300",
    },
    error: {
      bg: "bg-gradient-to-br from-red-500 to-rose-600",
      border: "border-red-400/50",
      glow: "shadow-red-500/30",
      iconBg: "bg-red-500",
      text: "text-red-700 dark:text-red-300",
    },
    info: {
      bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      border: "border-blue-400/50",
      glow: "shadow-blue-500/30",
      iconBg: "bg-blue-500",
      text: "text-blue-700 dark:text-blue-300",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-500 to-orange-600",
      border: "border-amber-400/50",
      glow: "shadow-amber-500/30",
      iconBg: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-300",
    },
  };

  const config = colorConfigs[type] || colorConfigs.success;
  const Icon = icons[type] || CheckCircle2;

  return (
    <div
      className="fixed top-24 right-6 z-[100] animate-in slide-in-from-right fade-in"
      role="alert"
      aria-live="polite"
    >
      <div className={`relative flex items-start gap-4 px-5 py-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 ${config.border} min-w-[320px] max-w-md ${config.glow} shadow-lg`}>
        {/* Decorative gradient background */}
        <div className={`absolute inset-0 ${config.bg} opacity-10 rounded-2xl`}></div>
        
        {/* Animated sparkle effect for success toasts */}
        {type === "success" && (
          <div className="absolute -top-1 -right-1 animate-pulse">
            <Sparkles size={16} className="text-green-400" />
          </div>
        )}
        
        <div className={`relative p-2.5 rounded-xl ${config.iconBg} text-white shadow-lg flex-shrink-0`}>
          <Icon size={20} className="drop-shadow-sm" />
        </div>
        
        <div className="relative flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-bold mb-1 ${config.text}`}>
              {title}
            </h4>
          )}
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="relative p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 active:scale-95 flex-shrink-0"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "info", "warning"]),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Toast;

