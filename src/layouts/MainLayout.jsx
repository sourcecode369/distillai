import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { useAuthModal } from "../context/AuthModalContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";
import ScrollIndicator from "../components/ScrollIndicator";
import LoginModal from "../components/Auth/LoginModal";
import SignupModal from "../components/Auth/SignupModal";
import AutoSignupPrompt from "../components/AutoSignupPrompt";
import ErrorBoundary from "../components/ErrorBoundary";
import { ArrowUp } from "lucide-react";
import { dbHelpers } from "../lib/supabase";

const MainLayout = () => {
  const { t } = useTranslation('common');
  const { toasts, removeToast, syncUserData, clearUserData, showToast, showScrollTop } = useApp();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isDesktopSidebarOpen,
    isMobileSidebarOpen,
    toggleDesktop,
    toggleMobile,
    setIsMobileSidebarOpen,
    setIsDesktopSidebarOpen
  } = useSidebar();

  const {
    isLoginModalOpen,
    isSignupModalOpen,
    isAutoSignupTriggered,
    setIsLoginModalOpen,
    setIsSignupModalOpen,
    setIsAutoSignupTriggered,
    switchToSignup,
    switchToLogin
  } = useAuthModal();

  const prevUserIdRef = useRef(null);
  const welcomeToastShownRef = useRef(false);

  // Sync user data when user logs in, clear when logs out
  useEffect(() => {
    if (user?.id) {
      // Show welcome toast if this is a new login (user changed from previous)
      if (prevUserIdRef.current !== user.id) {
        // Reset welcome toast flag for new user
        welcomeToastShownRef.current = false;
        prevUserIdRef.current = user.id;
      }

      // Show welcome toast only once per session
      if (!welcomeToastShownRef.current) {
        welcomeToastShownRef.current = true;
        // Fetch profile to get the most up-to-date name
        dbHelpers.getUserProfile(user.id).then(({ data: profileData }) => {
          const userName = profileData?.full_name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "there";
          showToast(`Welcome back, ${userName}!`, "success");
        }).catch(() => {
          // Fallback if profile fetch fails
          const userName = user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "there";
          showToast(`Welcome back, ${userName}!`, "success");
        });
      }

      // Only sync once per user change to prevent flickering
      syncUserData(user.id);
    } else {
      // User signed out, clear all user data
      prevUserIdRef.current = null;
      welcomeToastShownRef.current = false;
      // Clear user data immediately (don't await to avoid blocking)
      clearUserData().catch(err => {
        console.error("Error clearing user data:", err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id to prevent multiple syncs

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname, setIsMobileSidebarOpen]);

  return (
    <ErrorBoundary showHomeButton={true}>
      <div className="min-h-screen font-sans text-slate-900 dark:text-gray-100 relative">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          {t('accessibility.skipToContent')}
        </a>
        <Sidebar />

        <div
          className={`flex flex-col min-h-screen transition-all duration-500 ease-out relative z-10 ${isDesktopSidebarOpen ? "lg:pl-72" : "lg:pl-20"
            }`}
        >
          <Topbar
            toggleMobile={toggleMobile}
            toggleDesktop={() => setIsDesktopSidebarOpen(true)}
            isDesktopOpen={isDesktopSidebarOpen}
          />

          <main id="main-content" className="flex-1 relative" tabIndex={-1}>
            <Outlet />
          </main>

          {location.pathname === '/' && (
            <Footer
              onAboutClick={() => navigate('/about')}
              onFAQClick={() => navigate('/faq')}
              onContributingClick={() => navigate('/contributing')}
              onCodeOfConductClick={() => navigate('/code-of-conduct')}
              onContactClick={() => navigate('/contact')}
            />
          )}

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 min-w-[44px] min-h-[44px] p-3 sm:p-4 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 backdrop-blur-sm border border-indigo-400/20 touch-manipulation flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ArrowUp size={22} className="relative group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-sm" strokeWidth={2.5} />
            </button>
          )}

          {/* Toast Container */}
          <ToastContainer toasts={toasts} removeToast={removeToast} />

          {/* Scroll Progress Indicator */}
          <ScrollIndicator />
        </div>

        {/* Auto Signup Prompt - shows signup modal after 5 seconds for unauthenticated users */}
        <AutoSignupPrompt
          isLoginModalOpen={isLoginModalOpen}
          isSignupModalOpen={isSignupModalOpen}
          onShowSignup={() => {
            setIsAutoSignupTriggered(true);
            setIsSignupModalOpen(true);
          }}
          currentView={location.pathname}
        />

        {/* Auth Modals */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => {
            setIsLoginModalOpen(false);
            setIsAutoSignupTriggered(false);
          }}
          onSwitchToSignup={switchToSignup}
        />
        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={() => {
            setIsSignupModalOpen(false);
            setIsAutoSignupTriggered(false);
          }}
          onSwitchToLogin={switchToLogin}
          promotionalMessage={isAutoSignupTriggered ? "Sign up — it's free!" : undefined}
        />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
