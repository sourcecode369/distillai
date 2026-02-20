import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  X,
  ChevronLeft,
  BookOpen,
  User,
  ChevronDown,
  Settings,
  LogOut,
  LogIn,
  Shield,
  TrendingUp,
  Loader2,
  Moon,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { useAuthModal } from "../context/AuthModalContext";
import { loadAllCategories } from "../utils/dataLoader";

const Sidebar = () => {
  const {
    isMobileSidebarOpen: isMobileOpen,
    toggleMobile,
    isDesktopSidebarOpen: isDesktopOpen,
    toggleDesktop
  } = useSidebar();
  const { setIsLoginModalOpen } = useAuthModal();
  const onLoginClick = () => setIsLoginModalOpen(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [categories, setCategories] = useState([]);
  const profileRef = useRef(null);
  const { user, isAdmin, signOut } = useAuth();
  const { t: tCommon } = useTranslation('common');
  const { t: tSidebar } = useTranslation('sidebar');
  const location = useLocation();
  const navigate = useNavigate();

  // Load categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await loadAllCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);
  const { showToast } = useApp();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProfileOpen]);

  useEffect(() => {
    if (!user) {
      setIsSigningOut(false);
      setIsProfileOpen(false);
    } else {
      setIsSigningOut(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setIsProfileOpen(false);

    try {
      const { error } = await signOut();

      if (error) {
        console.error("Sign out error:", error);
        setIsSigningOut(false);
        showToast(tCommon('messages.errorSigningOut'), "error", 3000, tCommon('messages.error'));
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 250));

      navigate("/");
    } catch (err) {
      console.error("Sign out exception:", err);
      setIsSigningOut(false);
      showToast(tCommon('messages.errorSigningOutRefresh'), "error", 3000, tCommon('messages.error'));
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-950/80 z-40 lg:hidden backdrop-blur-xl"
          onClick={toggleMobile}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full backdrop-blur-xl bg-gray-950/95 border-r transform transition-all duration-500 ease-out overflow-hidden
          ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"}
          ${!isMobileOpen && "lg:block"}
          ${isDesktopOpen ? "lg:translate-x-0 lg:w-72" : "lg:translate-x-0 lg:w-20"}
        `}
        style={{
          borderImage: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.25), rgba(148, 163, 184, 0.1)) 1',
          boxShadow: `
            0 8px 32px 0 rgba(0, 0, 0, 0.4),
            0 4px 16px 0 rgba(0, 0, 0, 0.2)
          `,
          isolation: 'isolate',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Gradient overlay for premium effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />

        <div className="flex flex-col h-full relative">
          {/* Header */}
          <div className={`relative h-20 flex items-center justify-between backdrop-blur-xl transition-all duration-300 border-b ${isDesktopOpen ? "px-5" : "lg:px-2 lg:justify-center"
            }`}
            style={{
              borderImage: 'linear-gradient(to right, transparent, rgba(148, 163, 184, 0.25), transparent) 1'
            }}>
            <Link
              to="/"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-lg shadow-indigo-500/40 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all duration-300 ring-2 ring-indigo-400/30 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-6 h-6" aria-hidden="true">
                  <defs>
                    <linearGradient id="dGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#C7D2FE', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  {/* Letter D */}
                  <path
                    d="M28 20 L28 80 L52 80 C70 80 78 68 78 50 C78 32 70 20 52 20 Z M40 32 L50 32 C62 32 66 39 66 50 C66 61 62 68 50 68 L40 68 Z"
                    fill="url(#dGradient)"
                  />
                </svg>
              </div>
              <span className={`font-bold text-gray-100 tracking-tight transition-all duration-300 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"}`}>
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent font-extrabold text-xl">Distill</span>
                <span className="text-gray-400 font-semibold text-xl"> AI</span>
              </span>
            </Link>

            <button
              className="lg:hidden min-w-[44px] min-h-[44px] text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 p-2.5 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 touch-manipulation flex items-center justify-center border border-transparent hover:border-indigo-500/30"
              onClick={toggleMobile}
              aria-label={tSidebar('toggleMobileMenu')}
            >
              <X size={22} strokeWidth={2.5} aria-hidden="true" />
            </button>

            {isDesktopOpen && (
              <button
                className="hidden lg:flex items-center justify-center w-10 h-10 text-gray-400 hover:text-indigo-400 hover:bg-gray-800/50 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all duration-200 group shadow-sm hover:shadow-indigo-500/20"
                onClick={toggleDesktop}
                title={tCommon('header.collapseSidebar')}
              >
                <ChevronLeft size={18} className="group-hover:translate-x-[-2px] transition-transform duration-300" strokeWidth={2.5} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className={`relative flex-1 overflow-y-auto transition-all duration-300 overscroll-contain ${isDesktopOpen ? "py-5 px-4" : "lg:py-4 lg:px-2"
            } ${isMobileOpen ? "py-4 px-3" : ""}`}>
            <div className="space-y-1.5">
              {/* Dashboard - only for logged-in users */}
              {user && (
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 touch-manipulation min-h-[44px] ${isActive
                    ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/40"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-indigo-400 border border-transparent hover:border-indigo-500/30"
                    } ${isDesktopOpen ? "gap-3 pl-2 pr-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"} ${isMobileOpen ? "gap-3 pl-2 pr-4 py-3.5" : ""}`}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full transition-all duration-300 ${isActive ? "bg-gradient-to-b from-indigo-300 via-violet-400 to-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.6)]" : "bg-transparent group-hover:bg-indigo-300/50"}`} />
                      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-violet-400/10 to-indigo-400/10 pointer-events-none" />}
                      <div className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 ml-2 ${isActive ? "bg-white/20 backdrop-blur-sm shadow-md ring-1 ring-white/30" : "group-hover:bg-white/10"}`}>
                        <LayoutDashboard size={18} className={`flex-shrink-0 transition-all duration-300 ${isActive ? "text-white drop-shadow-md scale-110" : "text-gray-400 group-hover:text-indigo-400"}`} strokeWidth={isActive ? 3 : 2.5} />
                      </div>
                      <span className={`relative z-10 whitespace-nowrap transition-all duration-300 tracking-wide font-medium ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"} ${isActive ? "text-white drop-shadow-sm font-semibold" : ""}`}>
                        Dashboard
                      </span>
                      {isActive && isDesktopOpen && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse" />}
                    </>
                  )}
                </NavLink>
              )}

              {/* Handbooks - No dropdown */}
              <NavLink
                to="/handbooks"
                className={({ isActive }) => `w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 touch-manipulation min-h-[44px] ${isActive
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/40"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-indigo-400 border border-transparent hover:border-indigo-500/30"
                  } ${isDesktopOpen ? "gap-3 pl-2 pr-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"} ${isMobileOpen ? "gap-3 pl-2 pr-4 py-3.5" : ""}`}
                aria-label={tSidebar('goToHome')}
              >
                {({ isActive }) => (
                  <>
                    {/* Left border accent indicator */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full transition-all duration-300 ${isActive
                      ? "bg-gradient-to-b from-indigo-300 via-violet-400 to-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.6),0_0_24px_rgba(139,92,246,0.4)]"
                      : "bg-transparent group-hover:bg-indigo-300/50 dark:group-hover:bg-indigo-600/50"
                      }`}></div>

                    {/* Subtle glow effect for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-violet-400/10 to-indigo-400/10 pointer-events-none"></div>
                    )}

                    {/* Icon container */}
                    <div className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 ml-2 ${isActive
                      ? "bg-white/20 backdrop-blur-sm shadow-md ring-1 ring-white/30"
                      : "group-hover:bg-white/10 dark:group-hover:bg-white/10"
                      }`}>
                      <BookOpen
                        size={18}
                        className={`flex-shrink-0 transition-all duration-300 ${isActive
                          ? "text-white drop-shadow-md scale-110"
                          : "text-gray-400 group-hover:text-indigo-400"
                          }`}
                        strokeWidth={isActive ? 3 : 2.5}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Text */}
                    <span className={`relative z-10 whitespace-nowrap transition-all duration-300 tracking-wide font-medium ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      } ${isActive ? "text-white drop-shadow-sm font-semibold" : ""}`}>
                      {tCommon('nav.home')}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && isDesktopOpen && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
                    )}

                    {/* Active indicator for collapsed state */}
                    {isActive && !isDesktopOpen && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-indigo-300 via-violet-400 to-indigo-300 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.9),0_0_20px_rgba(139,92,246,0.6)] animate-pulse"></div>
                    )}
                  </>
                )}
              </NavLink>

            </div>

          </div>

          <div className={`relative border-t backdrop-blur-xl transition-all duration-300 ${isDesktopOpen ? "p-4" : "lg:p-2"
            } ${isMobileOpen ? "p-3" : ""}`}
            style={{
              borderImage: 'linear-gradient(to right, transparent, rgba(148, 163, 184, 0.25), transparent) 1'
            }}>
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsProfileOpen(!isProfileOpen);
                    }
                  }}
                  className={`w-full flex items-center rounded-xl hover:bg-gray-800/50 transition-all duration-200 group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-950 touch-manipulation min-h-[56px] border border-transparent hover:border-indigo-500/30 ${isDesktopOpen ? "gap-3 p-3 text-left" : "lg:justify-center lg:p-2"
                    } ${isMobileOpen ? "gap-3 p-3.5 text-left" : ""}`}
                  aria-label={tSidebar('profile.menu.ariaLabel')}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="profile-menu"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold border-2 border-indigo-400/20 shadow-lg shadow-indigo-500/40 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all flex-shrink-0 ring-2 ring-indigo-500/20">
                    <User size={22} strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <div className={`transition-all duration-300 ${isDesktopOpen ? "opacity-100 max-w-full flex-1 min-w-0" : "lg:hidden"
                    }`}>
                    <p className="text-sm font-bold text-gray-100 truncate tracking-tight">
                      {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate font-semibold uppercase tracking-wider">
                      {isAdmin ? tCommon('status.admin') : tCommon('status.member')}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-all duration-300 flex-shrink-0 ${isProfileOpen ? "rotate-180 text-indigo-400" : ""
                      } ${!isDesktopOpen ? "lg:hidden" : ""}`}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </button>

                {isProfileOpen && (
                  <div
                    id="profile-menu"
                    className={`absolute bottom-full mb-2 bg-gray-900 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] border border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 backdrop-blur-xl ${isDesktopOpen ? "left-0 w-full" : "lg:left-20 lg:w-56"
                      }`}
                    role="menu"
                    aria-label={tSidebar('profile.menu.ariaLabel')}
                  >
                    <div className="py-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-indigo-400 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 border border-transparent hover:border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        role="menuitem"
                        aria-label={tSidebar('profile.menu.ariaLabelMyProfile')}
                      >
                        <User size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.profile')}
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-indigo-400 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 border border-transparent hover:border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        role="menuitem"
                        aria-label={tCommon('nav.progress')}
                      >
                        <TrendingUp size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.progress')}
                      </Link>
                      <button
                        className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-indigo-400 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 border border-transparent hover:border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        role="menuitem"
                        aria-label={tCommon('nav.settings')}
                      >
                        <Settings size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.settings')}
                      </button>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full px-4 py-2.5 text-sm text-indigo-400 hover:bg-gray-800/50 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 border border-transparent hover:border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                          role="menuitem"
                          aria-label={tCommon('nav.admin')}
                        >
                          <Shield size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.admin')}
                        </Link>
                      )}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1.5 mx-2" role="separator" aria-hidden="true"></div>

                      <div className="px-4 py-2.5 flex items-center justify-between gap-3 mx-1">
                        <div className="flex items-center gap-3 text-sm font-semibold text-gray-300">
                          <Moon size={16} strokeWidth={2.5} aria-hidden="true" />
                          <span>{tCommon('nav.darkMode') || 'Dark Mode'}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDarkMode();
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${darkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          role="switch"
                          aria-checked={darkMode}
                          aria-label={tCommon('nav.toggleDarkMode') || 'Toggle dark mode'}
                        >
                          <span
                            className={`${darkMode ? 'translate-x-6' : 'translate-x-1'
                              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-white/15 dark:via-white/10 to-transparent my-1.5 mx-2" role="separator" aria-hidden="true"></div>
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        role="menuitem"
                        aria-label={isSigningOut ? tCommon('messages.signingOut') || 'Signing you out...' : tCommon('nav.signOut')}
                        aria-busy={isSigningOut}
                      >
                        {isSigningOut ? (
                          <>
                            <Loader2 size={16} className="animate-spin" strokeWidth={2.5} aria-hidden="true" />
                            <span>{tCommon('messages.signingOut') || 'Signing you out...'}</span>
                          </>
                        ) : (
                          <>
                            <LogOut size={16} strokeWidth={2.5} aria-hidden="true" />
                            <span>{tCommon('nav.signOut')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className={`w-full flex items-center rounded-xl hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 touch-manipulation min-h-[56px] hover:shadow-inner ${isDesktopOpen ? "gap-3 p-3 text-left" : "lg:justify-center lg:p-2"
                  } ${isMobileOpen ? "gap-3 p-3.5 text-left" : ""}`}
                aria-label={tSidebar('profile.signIn.ariaLabel')}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold border-2 border-white/20 dark:border-slate-800/50 shadow-lg shadow-indigo-500/40 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all flex-shrink-0 ring-2 ring-indigo-500/20">
                  <LogIn size={22} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div className={`transition-all duration-300 ${isDesktopOpen ? "opacity-100 max-w-full flex-1 min-w-0" : "lg:hidden"
                  }`}>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
                    {tCommon('nav.signIn')}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-semibold uppercase tracking-wider">
                    {tCommon('nav.getStarted')}
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
