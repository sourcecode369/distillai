import React, { useEffect, useRef, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card as UICard } from "../ui/card";
import { Button as UIButton } from "../ui/button";

/**
 * Modal component for displaying detailed user information
 * Extracted from AdminDashboard for better code organization
 * Memoized to prevent unnecessary re-renders
 */
const UserDetailsModal = memo(({ user, stats, onClose, onToggleAdmin, currentUserId }) => {
  const { t } = useTranslation("admin");
  const isCurrentUser = user.id === currentUserId;
  const modalRef = useRef(null);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Prevent body scroll
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        animation: "fade-in 0.2s ease-out"
      }}
    >
      <div
        ref={modalRef}
        className="bg-background rounded-2xl shadow-2xl max-w-lg md:max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border/60 p-6 md:p-8"
        style={{
          animation: "fade-in 0.2s ease-out",
          transform: "scale(1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">{t("users.modals.userDetails.title")}</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl">
              {(user.full_name || user.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {user.full_name || t("users.table.noName")}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.is_admin && (
                <Badge variant="default" className="mt-2 text-xs font-semibold">
                  {t("users.table.adminBadge")}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <UICard className="p-4 border-border/60 bg-muted/40">
              <p className="text-xs text-muted-foreground mb-1">{t("users.modals.userDetails.joined")}</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </UICard>
            <UICard className="p-4 border-border/60 bg-muted/40">
              <p className="text-xs text-muted-foreground mb-1">{t("users.modals.userDetails.lastUpdated")}</p>
              <p className="text-sm font-semibold text-foreground">
                {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : t("users.modals.userDetails.noData")}
              </p>
            </UICard>
          </div>

          {stats && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">{t("users.modals.userDetails.stats")}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <UICard className="p-4 border-border/60 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">{t("users.modals.userDetails.bookmarks")}</p>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{stats.bookmarks}</p>
                </UICard>
                <UICard className="p-4 border-border/60 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">{t("users.modals.userDetails.readingHistory")}</p>
                  <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">{stats.readingHistory}</p>
                </UICard>
                <UICard className="p-4 border-border/60 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">{t("users.modals.userDetails.topicsCompleted")}</p>
                  <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">{stats.completedTopics}</p>
                </UICard>
                <UICard className="p-4 border-border/60 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">{t("users.modals.userDetails.totalProgress")}</p>
                  <p className="text-sm font-semibold text-pink-600 dark:text-pink-400">{stats.totalProgress}</p>
                </UICard>
                <UICard className="p-4 border-border/60 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">{t("users.modals.userDetails.averageScore")}</p>
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">{stats.averageScore}%</p>
                </UICard>
              </div>
            </div>
          )}

          {!isCurrentUser && (
            <div className="pt-4 border-t border-border/60 flex justify-end">
              <UIButton
                onClick={onToggleAdmin}
                variant={user.is_admin ? "destructive" : "default"}
                className="w-full sm:w-auto"
              >
                {user.is_admin ? t("users.actions.removeAdmin") : t("users.actions.makeAdmin")}
              </UIButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

UserDetailsModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    is_admin: PropTypes.bool,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  stats: PropTypes.shape({
    bookmarks: PropTypes.number,
    readingHistory: PropTypes.number,
    completedTopics: PropTypes.number,
    totalProgress: PropTypes.number,
    averageScore: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onToggleAdmin: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
};

UserDetailsModal.displayName = 'UserDetailsModal';

export default UserDetailsModal;

