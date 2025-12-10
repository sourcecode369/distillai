import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { X, Mail, Lock, User, Loader2, Github } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, promotionalMessage }) => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const { signUp, signInWithOAuth } = useAuth();
  const { showToast } = useApp();
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  // Track dismissal for auto-popup
  const handleClose = useCallback(() => {
    // If this was shown with promotional message, mark as dismissed
    if (promotionalMessage) {
      sessionStorage.setItem("autoSignupDismissed", "true");
    }
    onClose();
  }, [promotionalMessage, onClose]);

  // Focus management and trap
  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before modal opened
      previousActiveElementRef.current = document.activeElement;
      
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      
      // Focus the first focusable element
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);

      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      // Handle Tab key for focus trapping
      const handleTab = (e) => {
        if (!modalRef.current) return;
        
        const focusableElements = modalRef.current.querySelectorAll(
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
        
        // Return focus to the element that had focus before modal opened
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password strength
    if (password.length < 6) {
      setError(t('signUp.errors.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(email, password, fullName);
      if (signUpError) {
        setError(signUpError.message || "Failed to create account. Please try again.");
      } else {
        // Check if email confirmation is required
        if (data?.user && !data?.session) {
          // Email confirmation required
          showToast("Account created! Please check your email to verify your account before signing in.", "success");
          setError(""); // Clear any errors
          // Show success message in the form
          setTimeout(() => {
            handleClose();
            setEmail("");
            setPassword("");
            setFullName("");
            onSwitchToLogin();
          }, 3000);
        } else if (data?.session) {
          // User is automatically logged in (email confirmation disabled)
          showToast("Account created successfully!", "success");
          handleClose();
          setEmail("");
          setPassword("");
          setFullName("");
        } else {
          showToast("Account created! Please check your email to verify your account.", "success");
          handleClose();
          setEmail("");
          setPassword("");
          setFullName("");
          setTimeout(() => {
            onSwitchToLogin();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError(t('signUp.errors.unexpected'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
      aria-describedby="signup-modal-description"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 touch-manipulation active:scale-95"
          aria-label="Close signup dialog"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
        </button>

        <div className="mb-4 sm:mb-6 pr-8">
          <h2 id="signup-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2 break-words">
            {t('signUp.title')}
          </h2>
          <p id="signup-modal-description" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
            {promotionalMessage || t('signUp.subtitle')}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="mb-4 sm:mb-6 space-y-2.5 sm:space-y-3">
          <button
            ref={firstFocusableRef}
            onClick={async () => {
              setOauthLoading("google");
              setError("");
              try {
                const { error } = await signInWithOAuth("google");
                if (error) {
                  setError(error.message || "Failed to sign in with Google. Please try again.");
                  setOauthLoading(null);
                }
              } catch (err) {
                console.error("Google sign in error:", err);
                setError(err.message || "Failed to sign in with Google. Please try again.");
                setOauthLoading(null);
              }
            }}
            disabled={loading || oauthLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[44px] touch-manipulation active:scale-95"
            aria-label="Sign up with Google"
          >
            {oauthLoading === "google" ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <button
            onClick={async () => {
              setOauthLoading("github");
              setError("");
              try {
                const { error } = await signInWithOAuth("github");
                if (error) {
                  setError(error.message || "Failed to sign in with GitHub. Please try again.");
                  setOauthLoading(null);
                }
              } catch (err) {
                console.error("GitHub sign in error:", err);
                setError(err.message || "Failed to sign in with GitHub. Please try again.");
                setOauthLoading(null);
              }
            }}
            disabled={loading || oauthLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-gray-900 dark:bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Sign up with GitHub"
          >
            {oauthLoading === "github" ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <Github size={18} aria-hidden="true" />
            )}
            <span>Continue with GitHub</span>
          </button>

        </div>

        {/* Divider */}
        <div className="relative mb-6" role="separator" aria-label="Or continue with email">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert" aria-live="assertive">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" role="note" aria-label="Email verification notice">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Note:</strong> After signing up, you'll receive a confirmation email. You must verify your email before you can sign in.
            </p>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('signUp.fullName')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('signUp.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('signUp.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                aria-required="true"
                aria-describedby="password-help"
              />
            </div>
            <p id="password-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={loading ? t('signUp.signingUp') : t('signUp.signUp')}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                <span aria-live="polite">{t('signUp.signingUp')}</span>
              </>
            ) : (
              t('signUp.signUp')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('signUp.haveAccount')}{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
              aria-label={t('signUp.signIn')}
            >
              {t('signUp.signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

SignupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
  promotionalMessage: PropTypes.string,
};

export default SignupModal;

