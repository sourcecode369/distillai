import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { X, Mail, Lock, Loader2, Github } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const { signIn, signInWithOAuth } = useAuth();
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  // Focus management and trap
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
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
          onClose();
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
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Add timeout to prevent infinite loading
      const signInPromise = signIn(email, password);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Sign in timeout. Please try again.")), 10000);
      });

      const result = await Promise.race([signInPromise, timeoutPromise]);
      const signInError = result?.error;
      
      if (signInError) {
        // Provide more helpful error messages
        let errorMessage = signInError.message || "Failed to sign in. Please check your credentials.";
        
        // Check for common error cases
        if (signInError.message?.includes("Invalid login credentials") || 
            signInError.message?.includes("Email not confirmed") ||
            errorMessage.includes("Invalid login")) {
          errorMessage = t('signIn.errors.invalidCredentials');
        }
        
        setError(errorMessage);
        setLoading(false);
      } else {
        setIsClosing(true);
        await new Promise(resolve => setTimeout(resolve, 250));
        setEmail("");
        setPassword("");
        setError("");
        setLoading(false);
        setIsClosing(false);
        onClose();
      }
      } catch (err) {
        console.error("Sign in error:", err);
        setError(err.message || t('signIn.errors.unexpected'));
        setLoading(false);
      }
  };

  useEffect(() => {
    if (!isOpen && isClosing) {
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
      onClick={(e) => e.target === e.currentTarget && !loading && !oauthLoading && onClose()}
    >
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={lastFocusableRef}
          onClick={onClose}
          disabled={loading || oauthLoading}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 touch-manipulation active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('signIn.close') || 'Close login dialog'}
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
        </button>

        <div className="mb-4 sm:mb-6 pr-8">
          <h2 id="login-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2 break-words">
            {t('signIn.title')}
          </h2>
          <p id="login-modal-description" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
            {t('signIn.subtitle')}
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
            aria-label="Sign in with Google"
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
            aria-label="Sign in with GitHub"
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
              {t('signIn.orContinueWithEmail') || 'Or continue with email'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loading && !error && (
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2" role="status" aria-live="polite">
              <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <p className="text-sm text-indigo-600 dark:text-indigo-400">{t('signIn.signingIn')}</p>
            </div>
          )}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert" aria-live="assertive">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('signIn.email')}
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
              {t('signIn.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                aria-required="true"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || oauthLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={loading ? t('signIn.signingIn') : t('signIn.signIn')}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                <span aria-live="polite">{t('signIn.signingIn')}</span>
              </>
            ) : (
              t('signIn.signIn')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('signIn.noAccount')}{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
              aria-label={t('signIn.signUp')}
            >
              {t('signIn.signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToSignup: PropTypes.func.isRequired,
};

export default LoginModal;

