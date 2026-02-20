import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
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
  const { t } = useTranslation("common");
  const { toasts, removeToast, syncUserData, clearUserData, showToast, showScrollTop } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isLoginModalOpen,
    isSignupModalOpen,
    isAutoSignupTriggered,
    setIsLoginModalOpen,
    setIsSignupModalOpen,
    setIsAutoSignupTriggered,
    switchToSignup,
    switchToLogin,
  } = useAuthModal();

  const prevUserIdRef = useRef(null);
  const welcomeToastShownRef = useRef(false);

  // Sync user data on login / logout
  useEffect(() => {
    if (user?.id) {
      if (prevUserIdRef.current !== user.id) {
        welcomeToastShownRef.current = false;
        prevUserIdRef.current = user.id;
      }
      if (!welcomeToastShownRef.current) {
        welcomeToastShownRef.current = true;
        dbHelpers.getUserProfile(user.id).then(({ data }) => {
          const name = data?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
          showToast(`Welcome back, ${name}!`, "success");
        }).catch(() => {
          const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
          showToast(`Welcome back, ${name}!`, "success");
        });
      }
      syncUserData(user.id);
    } else {
      prevUserIdRef.current = null;
      welcomeToastShownRef.current = false;
      clearUserData().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <ErrorBoundary showHomeButton={true}>
      <div className="min-h-screen font-sans text-gray-100 relative">
        <a href="#main-content" className="skip-to-content">
          {t("accessibility.skipToContent")}
        </a>

        <div className="flex flex-col min-h-screen">
          <Topbar />

          <main id="main-content" className="flex-1 relative" tabIndex={-1}>
            <Outlet />
          </main>

          {location.pathname === "/" && <Footer />}

          {/* Scroll to top */}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 z-50 h-11 w-11 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-manipulation"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          )}

          <ToastContainer toasts={toasts} removeToast={removeToast} />
          <ScrollIndicator />
        </div>

        <AutoSignupPrompt
          isLoginModalOpen={isLoginModalOpen}
          isSignupModalOpen={isSignupModalOpen}
          onShowSignup={() => { setIsAutoSignupTriggered(true); setIsSignupModalOpen(true); }}
          currentView={location.pathname}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => { setIsLoginModalOpen(false); setIsAutoSignupTriggered(false); }}
          onSwitchToSignup={switchToSignup}
        />
        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={() => { setIsSignupModalOpen(false); setIsAutoSignupTriggered(false); }}
          onSwitchToLogin={switchToLogin}
          promotionalMessage={isAutoSignupTriggered ? "Sign up — it's free!" : undefined}
        />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
