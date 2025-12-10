import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { AlertTriangle, X, CheckCircle2, Info, Trash2 } from "lucide-react";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "danger", // danger, warning, info
  icon: Icon,
}) => {
  const { t } = useTranslation('common');
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  
  // Use translations as defaults if not provided
  const finalConfirmText = confirmText || t('dialog.confirm');
  const finalCancelText = cancelText || t('dialog.cancel');

  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before dialog opened
      previousActiveElementRef.current = document.activeElement;
      
      // Focus the confirm button when dialog opens
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      
      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      // Handle Tab key for focus trapping
      const handleTab = (e) => {
        if (!dialogRef.current) return;
        
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTab);
      
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleTab);
        document.body.style.overflow = "";
        
        // Return focus to the element that had focus before dialog opened
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: Trash2,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      buttonBg: "bg-red-600 hover:bg-red-700",
      buttonText: "text-white",
      border: "border-red-200 dark:border-red-800/50",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      buttonBg: "bg-amber-600 hover:bg-amber-700",
      buttonText: "text-white",
      border: "border-amber-200 dark:border-amber-800/50",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      buttonText: "text-white",
      border: "border-blue-200 dark:border-blue-800/50",
    },
  };

  const config = variants[variant] || variants.danger;
  const DialogIcon = Icon || config.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-message"
    >
      <div
        ref={dialogRef}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label={t('dialog.close')}
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl ${config.iconBg} flex-shrink-0`} aria-hidden="true">
            <DialogIcon size={24} className={config.iconColor} />
          </div>
          <div className="flex-1 pt-1">
            <h3 id="confirmation-dialog-title" className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              {title}
            </h3>
            <p id="confirmation-dialog-message" className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={finalCancelText}
          >
            {finalCancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl font-semibold ${config.buttonBg} ${config.buttonText} shadow-lg shadow-red-500/20 hover:shadow-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50`}
            aria-label={finalConfirmText}
          >
            {finalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(["danger", "warning", "info"]),
  icon: PropTypes.elementType,
};

export default ConfirmationDialog;



