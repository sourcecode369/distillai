import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

/**
 * AutoSignupPrompt component
 * Automatically shows the signup modal after 5 seconds for unauthenticated users
 * Only shows once per session (unless user manually opens modals)
 */
const AutoSignupPrompt = ({ 
  isLoginModalOpen, 
  isSignupModalOpen, 
  onShowSignup,
  currentView 
}) => {
  const { user, loading } = useAuth();
  const hasShownRef = useRef(false);
  const timeoutRef = useRef(null);
  const dismissedInSessionRef = useRef(false);

  // Check if user dismissed the auto-popup in this session (only check once on mount)
  useEffect(() => {
    const dismissed = sessionStorage.getItem("autoSignupDismissed");
    dismissedInSessionRef.current = dismissed === "true";
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Don't show if:
    // 1. Auth is still loading
    // 2. User is authenticated
    // 3. Already shown in this component instance
    // 4. User dismissed it in this session
    // 5. A modal is already open
    if (
      loading ||
      user ||
      hasShownRef.current ||
      dismissedInSessionRef.current ||
      isLoginModalOpen ||
      isSignupModalOpen
    ) {
      return;
    }

    // Wait 5 seconds before showing
    timeoutRef.current = setTimeout(() => {
      // Double-check conditions before showing (user might have logged in or opened modal)
      if (
        !user &&
        !loading &&
        !isLoginModalOpen &&
        !isSignupModalOpen &&
        !dismissedInSessionRef.current
      ) {
        hasShownRef.current = true;
        onShowSignup();
      }
    }, 5000);

    // Cleanup timeout on unmount or when conditions change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [
    user,
    loading,
    isLoginModalOpen,
    isSignupModalOpen,
    onShowSignup,
    currentView,
  ]);

  // Reset hasShown when view changes (new page load), but only if not dismissed
  useEffect(() => {
    if (!dismissedInSessionRef.current) {
      hasShownRef.current = false;
    }
  }, [currentView]);

  // This component doesn't render anything
  return null;
};

AutoSignupPrompt.propTypes = {
  isLoginModalOpen: PropTypes.bool.isRequired,
  isSignupModalOpen: PropTypes.bool.isRequired,
  onShowSignup: PropTypes.func.isRequired,
  currentView: PropTypes.string,
};

export default AutoSignupPrompt;

