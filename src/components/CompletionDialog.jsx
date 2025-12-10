import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { X, Trophy, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { dbHelpers } from "../lib/supabase";

/**
 * CompletionDialog Component
 * 
 * Subtle notification that slides in from the right when user reaches the end
 * Non-blocking, allows user to mark as complete or dismiss
 */
const CompletionDialog = ({ 
  isOpen, 
  onClose, 
  categoryId, 
  topicId, 
  topicTitle,
  onComplete 
}) => {
  const { t } = useTranslation("app");
  const { user } = useAuth();
  const { showToast } = useApp();
  const [isClosing, setIsClosing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleMarkComplete = async () => {
    if (!user?.id) {
      showToast(t("completionDialog.signInRequired"), "info");
      return;
    }

    setIsCompleting(true);

    try {
      const { error } = await dbHelpers.updateProgress(user.id, {
        categoryId,
        topicId,
        completed: true,
        quizScore: null,
      });

      if (error) {
        throw error;
      }

      setIsCompleted(true);
      if (onComplete) {
        onComplete();
      }

      showToast(t("completionDialog.topicMarkedComplete"), "success");

      // Auto-dismiss after showing success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating completion status:", error);
      showToast(t("completionDialog.failedToUpdate"), "error");
      setIsCompleting(false);
    }
  };

  const handleDismiss = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const notificationContent = (
    <div 
      className={`fixed right-4 top-24 z-50 transition-all duration-300 ease-out ${
        isClosing 
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100'
      }`}
      style={{ maxWidth: '400px' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-dialog-title"
      aria-describedby="completion-dialog-message"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/40 p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-600 rounded-xl blur-lg opacity-30"></div>
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-600 rounded-xl shadow-md" aria-hidden="true">
              <Trophy size={20} className="text-white drop-shadow-sm" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 id="completion-dialog-title" className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              {t("completionDialog.reachedEnd")}
            </h3>
            <p id="completion-dialog-message" className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              {t("completionDialog.markComplete", { title: topicTitle })}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={t("completionDialog.dismissAriaLabel")}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Actions */}
        {isCompleted ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" role="status" aria-live="polite">
            <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {t("completionDialog.markedComplete")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkComplete}
              disabled={isCompleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label={isCompleting ? t("completionDialog.markingAriaLabel") : t("completionDialog.markCompleteAriaLabel")}
            >
              {isCompleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                  <span aria-live="polite">{t("completionDialog.marking")}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>{t("completionDialog.yesMarkComplete")}</span>
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label={t("completionDialog.dismiss")}
            >
              {t("completionDialog.no")}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(notificationContent, document.body)
    : null;
};

CompletionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categoryId: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
  topicTitle: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};

export default CompletionDialog;

