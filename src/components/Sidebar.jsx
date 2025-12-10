import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Zap,
  X,
  ChevronLeft,
  BookOpen,
  Map as MapIcon,
  User,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  Bookmark,
  History,
  Network,
  Library,
  Briefcase,
  FileText,
  ExternalLink,
  LogIn,
  Shield,
  TrendingUp,
  Loader2,
  Moon,
  Beaker,
  Newspaper,
  Award,
  Users,
  ShieldCheck,
  Box,
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
  const [expandedCategories, setExpandedCategories] = useState({
    roadmaps: false,
    ecosystem: false,
    resources: false,
    opportunities: false,
    learning: false,
    community: false,
    ethics: false,
  });
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
  const { bookmarks, readingHistory, removeBookmark, showToast, darkMode, toggleDarkMode } = useApp();

  // Deduplicate reading history to prevent duplicates and flickering
  // Also ensure we only show history when user is logged in
  const uniqueHistory = useMemo(() => {
    if (!user || !readingHistory || readingHistory.length === 0) return [];
    // Use Map to deduplicate by ID, keeping the first (most recent) occurrence
    const seen = new Map();
    readingHistory.forEach((item) => {
      if (!item || !item.id) return;
      // Only add if we haven't seen this ID yet (first occurrence is most recent)
      if (!seen.has(item.id)) {
        seen.set(item.id, item);
      }
    });
    // Convert to array and limit to 5 (already sorted by most recent first)
    return Array.from(seen.values()).slice(0, 5);
  }, [user, readingHistory]);

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
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xl"
          onClick={toggleMobile}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full backdrop-blur-xl bg-white/10 dark:bg-white/5 transform transition-all duration-500 ease-out rounded-r-2xl overflow-hidden
          ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"}
          ${!isMobileOpen && "lg:block"}
          ${isDesktopOpen ? "lg:translate-x-0 lg:w-72" : "lg:translate-x-0 lg:w-20"}
        `}
        style={{
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.1),
            0 4px 16px 0 rgba(0, 0, 0, 0.05)
          `,
          isolation: 'isolate',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="flex flex-col h-full relative">
          {/* Header */}
          <div className={`relative h-20 flex items-center justify-between backdrop-blur-xl transition-all duration-300 ${isDesktopOpen ? "px-5" : "lg:px-2 lg:justify-center"
            }`}
            style={{
              borderTopLeftRadius: '0.75rem',
              borderTopRightRadius: '0.75rem',
              boxShadow: 'inset 0 -1px 0 0 rgba(255, 255, 255, 0.15)'
            }}>
            <Link
              to="/"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex-shrink-0 w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-lg shadow-indigo-500/40 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all duration-300 ring-2 ring-indigo-400/30 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-7 h-7"
                  aria-hidden="true"
                >
                  {/* Background glow effect */}
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#E0E7FF', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>

                  {/* 3D Shadow layers */}
                  <path d="M25 20 L75 70 M75 20 L25 70"
                    stroke="#1E1B4B"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.2"
                    transform="translate(2, 2)"
                  />

                  {/* Main X with gradient */}
                  <path d="M25 20 L75 70 M75 20 L25 70"
                    stroke="url(#xGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />

                  {/* Highlight accent */}
                  <path d="M25 20 L40 35"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <span className={`text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight transition-all duration-300 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                }`}>
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent font-extrabold text-xl drop-shadow-sm">X</span>
                {tSidebar('appNameShort').substring(1)}<span className="text-slate-500 dark:text-slate-400 font-semibold">{tSidebar('appNameSuffix')}</span>
              </span>
            </Link>

            <button
              className="lg:hidden min-w-[44px] min-h-[44px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/10 dark:hover:bg-white/10 p-2.5 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 touch-manipulation flex items-center justify-center hover:shadow-inner"
              onClick={toggleMobile}
              aria-label={tSidebar('toggleMobileMenu')}
            >
              <X size={22} strokeWidth={2.5} aria-hidden="true" />
            </button>

            {isDesktopOpen && (
              <button
                className="hidden lg:flex items-center justify-center w-10 h-10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-xl border border-white/15 dark:border-white/10 hover:border-white/20 dark:hover:border-white/15 transition-all duration-200 group hover:shadow-inner"
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
              {/* Handbooks - No dropdown */}
              <NavLink
                to="/handbooks"
                className={({ isActive }) => `w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 touch-manipulation min-h-[44px] ${isActive
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-500/40"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-inner"
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
                          : "text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
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

              {/* AI Weekly - Available to all users */}
              <NavLink
                to="/weekly-report"
                className={({ isActive }) => `w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 touch-manipulation min-h-[44px] ${isActive
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-500/40"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-inner"
                  } ${isDesktopOpen ? "gap-3 pl-2 pr-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"} ${isMobileOpen ? "gap-3 pl-2 pr-4 py-3.5" : ""}`}
                aria-label={tSidebar('weeklyReport.ariaLabel', { defaultValue: 'AI Weekly' })}
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
                      <FileText
                        size={18}
                        className={`flex-shrink-0 transition-all duration-300 ${isActive
                          ? "text-white drop-shadow-md scale-110"
                          : "text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          }`}
                        strokeWidth={isActive ? 3 : 2.5}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Text */}
                    <span className={`relative z-10 whitespace-nowrap transition-all duration-300 tracking-wide font-medium ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      } ${isActive ? "text-white drop-shadow-sm font-semibold" : ""}`}>
                      {tSidebar('weeklyReport.title')}
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

              {/* Roadmaps - Available to all users */}
              <NavLink
                to="/roadmaps"
                className={({ isActive }) => `w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 touch-manipulation min-h-[44px] ${isActive
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-500/40"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-inner"
                  } ${isDesktopOpen ? "gap-3 pl-2 pr-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"} ${isMobileOpen ? "gap-3 pl-2 pr-4 py-3.5" : ""}`}
                aria-label={tSidebar('roadmaps.ariaLabel', { defaultValue: 'Career Roadmaps' })}
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
                      <MapIcon
                        size={18}
                        className={`flex-shrink-0 transition-all duration-300 ${isActive
                          ? "text-white drop-shadow-md scale-110"
                          : "text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          }`}
                        strokeWidth={isActive ? 3 : 2.5}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Text */}
                    <span className={`relative z-10 whitespace-nowrap transition-all duration-300 tracking-wide font-medium ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      } ${isActive ? "text-white drop-shadow-sm font-semibold" : ""}`}>
                      {tSidebar('roadmaps.title', { defaultValue: 'Roadmaps' })}
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


              {/* Ecosystem - Admin only */}
              {isAdmin && (
                <div className="space-y-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isDesktopOpen || isMobileOpen) {
                        setExpandedCategories(prev => ({ ...prev, ecosystem: !prev.ecosystem }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedCategories(prev => ({ ...prev, ecosystem: !prev.ecosystem }));
                      }
                    }}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 relative group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer touch-manipulation min-h-[44px] hover:shadow-inner ${isDesktopOpen ? "gap-3 px-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"
                      } ${isMobileOpen ? "gap-3 px-4 py-3.5" : ""}`}
                    aria-label={tSidebar('ecosystem.ariaLabel')}
                    aria-expanded={expandedCategories.ecosystem}
                    aria-controls="ecosystem-submenu"
                  >
                    {isDesktopOpen && (
                      expandedCategories.ecosystem ? (
                        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} aria-hidden="true" />
                      ) : (
                        <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} aria-hidden="true" />
                      )
                    )}
                    <Network size={18} className="flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    <span className={`whitespace-nowrap transition-all duration-300 tracking-wide flex-1 text-left ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>{tSidebar('ecosystem.title')}</span>
                    <span className={`text-[10px] bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border border-indigo-200/50 dark:border-indigo-800/50 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>
                      {tSidebar('ecosystem.comingSoon')}
                    </span>
                  </button>

                  {expandedCategories.ecosystem && (isDesktopOpen || isMobileOpen) && (
                    <div id="ecosystem-submenu" className="ml-6 pl-4 border-l-2 border-white/15 dark:border-white/10 space-y-0.5 animate-in fade-in slide-in-from-top-2" role="region" aria-label={tSidebar('ecosystem.submenu.ariaLabel')}>
                      <NavLink
                        to="/tools"
                        className={({ isActive }) => `block px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 tracking-wide ${isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 hover:shadow-inner"
                          }`}
                      >
                        {tSidebar('ecosystem.submenu.tools')}
                      </NavLink>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('ecosystem.submenu.benchmarks')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('ecosystem.submenu.models')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('ecosystem.submenu.datasets')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('ecosystem.submenu.mlops')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('ecosystem.submenu.promptLibrary')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('ecosystem.submenu.guides')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resources - Admin only */}
              {isAdmin && (
                <div className="space-y-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isDesktopOpen || isMobileOpen) {
                        setExpandedCategories(prev => ({ ...prev, resources: !prev.resources }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedCategories(prev => ({ ...prev, resources: !prev.resources }));
                      }
                    }}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 relative group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer touch-manipulation min-h-[44px] hover:shadow-inner ${isDesktopOpen ? "gap-3 px-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"
                      } ${isMobileOpen ? "gap-3 px-4 py-3.5" : ""}`}
                    aria-label={tSidebar('resources.ariaLabel')}
                    aria-expanded={expandedCategories.resources}
                    aria-controls="resources-submenu"
                  >
                    {isDesktopOpen && (
                      expandedCategories.resources ? (
                        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} aria-hidden="true" />
                      ) : (
                        <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} aria-hidden="true" />
                      )
                    )}
                    <Library size={18} className="flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    <span className={`whitespace-nowrap transition-all duration-300 tracking-wide flex-1 text-left ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>{tSidebar('resources.title')}</span>
                    <span className={`text-[10px] bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border border-indigo-200/50 dark:border-indigo-800/50 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>
                      {tSidebar('resources.comingSoon')}
                    </span>
                  </button>

                  {expandedCategories.resources && (isDesktopOpen || isMobileOpen) && (
                    <div id="resources-submenu" className="ml-6 pl-4 border-l-2 border-white/15 dark:border-white/10 space-y-0.5 animate-in fade-in slide-in-from-top-2" role="region" aria-label={tSidebar('resources.submenu.ariaLabel')}>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.books')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.courses')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.tutorials')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.blog')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.news')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.papers')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.podcasts')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('resources.submenu.interviewPrep')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide flex items-center gap-1.5 hover:shadow-inner">
                        {tSidebar('resources.submenu.cheatsheets')}
                        <ExternalLink size={12} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Opportunities - Admin only */}
              {isAdmin && (
                <div className="space-y-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isDesktopOpen || isMobileOpen) {
                        setExpandedCategories(prev => ({ ...prev, opportunities: !prev.opportunities }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedCategories(prev => ({ ...prev, opportunities: !prev.opportunities }));
                      }
                    }}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 relative group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer touch-manipulation min-h-[44px] hover:shadow-inner ${isDesktopOpen ? "gap-3 px-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"
                      } ${isMobileOpen ? "gap-3 px-4 py-3.5" : ""}`}
                    aria-label={tSidebar('opportunities.ariaLabel')}
                    aria-expanded={expandedCategories.opportunities}
                    aria-controls="opportunities-submenu"
                  >
                    {isDesktopOpen && (
                      expandedCategories.opportunities ? (
                        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} aria-hidden="true" />
                      ) : (
                        <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} aria-hidden="true" />
                      )
                    )}
                    <Briefcase size={18} className="flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    <span className={`whitespace-nowrap transition-all duration-300 tracking-wide flex-1 text-left ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>{tSidebar('opportunities.title')}</span>
                    <span className={`text-[10px] bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border border-indigo-200/50 dark:border-indigo-800/50 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>
                      {tSidebar('opportunities.comingSoon')}
                    </span>
                  </button>

                  {expandedCategories.opportunities && (isDesktopOpen || isMobileOpen) && (
                    <div id="opportunities-submenu" className="ml-6 pl-4 border-l-2 border-white/15 dark:border-white/10 space-y-0.5 animate-in fade-in slide-in-from-top-2" role="region" aria-label={tSidebar('opportunities.submenu.ariaLabel')}>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('opportunities.submenu.jobs')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('opportunities.submenu.internships')}
                      </div>
                      <NavLink
                        to="/conferences"
                        className={({ isActive }) =>
                          `block px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 tracking-wide hover:shadow-inner ${isActive
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/30'
                            : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10'
                          }`
                        }
                      >
                        {tSidebar('opportunities.submenu.conferences')}
                      </NavLink>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('opportunities.submenu.scholarships')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('opportunities.submenu.competitions')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('opportunities.submenu.hackathons')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('opportunities.submenu.consulting')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide hover:shadow-inner">
                        {tSidebar('opportunities.submenu.careerServices')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Learning - Admin only */}
              {isAdmin && (
                <div className="space-y-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isDesktopOpen || isMobileOpen) {
                        setExpandedCategories(prev => ({ ...prev, learning: !prev.learning }));
                      }
                    }}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 relative group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer touch-manipulation min-h-[44px] hover:shadow-inner ${isDesktopOpen ? "gap-3 px-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"
                      } ${isMobileOpen ? "gap-3 px-4 py-3.5" : ""}`}
                    aria-label={tSidebar('learning.ariaLabel')}
                    aria-expanded={expandedCategories.learning}
                  >
                    {isDesktopOpen && (
                      expandedCategories.learning ? (
                        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} />
                      ) : (
                        <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} />
                      )
                    )}
                    <Beaker size={18} className="flex-shrink-0" strokeWidth={2.5} />
                    <span className={`whitespace-nowrap transition-all duration-300 tracking-wide flex-1 text-left ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>{tSidebar('learning.title')}</span>
                    <span className={`text-[10px] bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border border-indigo-200/50 dark:border-indigo-800/50 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>
                      {tSidebar('learning.comingSoon')}
                    </span>
                  </button>

                  {expandedCategories.learning && (isDesktopOpen || isMobileOpen) && (
                    <div className="ml-6 pl-4 border-l-2 border-white/15 dark:border-white/10 space-y-0.5 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('learning.submenu.playground')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('learning.submenu.notebooks')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('learning.submenu.codeEditor')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('learning.submenu.tryModels')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('learning.submenu.workshops')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('learning.submenu.certifications')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('learning.submenu.exams')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Community - Admin only */}
              {isAdmin && (
                <div className="space-y-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isDesktopOpen || isMobileOpen) {
                        setExpandedCategories(prev => ({ ...prev, community: !prev.community }));
                      }
                    }}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 relative group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer touch-manipulation min-h-[44px] hover:shadow-inner ${isDesktopOpen ? "gap-3 px-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"
                      } ${isMobileOpen ? "gap-3 px-4 py-3.5" : ""}`}
                    aria-label={tSidebar('community.ariaLabel')}
                    aria-expanded={expandedCategories.community}
                  >
                    {isDesktopOpen && (
                      expandedCategories.community ? (
                        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} />
                      ) : (
                        <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} />
                      )
                    )}
                    <Users size={18} className="flex-shrink-0" strokeWidth={2.5} />
                    <span className={`whitespace-nowrap transition-all duration-300 tracking-wide flex-1 text-left ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>{tSidebar('community.title')}</span>
                    <span className={`text-[10px] bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border border-indigo-200/50 dark:border-indigo-800/50 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>
                      {tSidebar('community.comingSoon')}
                    </span>
                  </button>

                  {expandedCategories.community && (isDesktopOpen || isMobileOpen) && (
                    <div className="ml-6 pl-4 border-l-2 border-white/15 dark:border-white/10 space-y-0.5 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('community.submenu.projects')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('community.submenu.mentorship')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('community.submenu.studyGroups')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('community.submenu.discussions')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('community.submenu.collaboration')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('community.submenu.events')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Ethics & Safety - Admin only */}
              {isAdmin && (
                <div className="space-y-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isDesktopOpen || isMobileOpen) {
                        setExpandedCategories(prev => ({ ...prev, ethics: !prev.ethics }));
                      }
                    }}
                    className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 relative group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer touch-manipulation min-h-[44px] hover:shadow-inner ${isDesktopOpen ? "gap-3 px-4 py-3" : "lg:justify-center lg:px-2 lg:py-3"
                      } ${isMobileOpen ? "gap-3 px-4 py-3.5" : ""}`}
                    aria-label={tSidebar('ethics.ariaLabel')}
                    aria-expanded={expandedCategories.ethics}
                  >
                    {isDesktopOpen && (
                      expandedCategories.ethics ? (
                        <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} />
                      ) : (
                        <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200" strokeWidth={2.5} />
                      )
                    )}
                    <ShieldCheck size={18} className="flex-shrink-0" strokeWidth={2.5} />
                    <span className={`whitespace-nowrap transition-all duration-300 tracking-wide flex-1 text-left ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>{tSidebar('ethics.title')}</span>
                    <span className={`text-[10px] bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border border-indigo-200/50 dark:border-indigo-800/50 ${isDesktopOpen ? "opacity-100 max-w-full" : "lg:hidden"
                      }`}>
                      {tSidebar('ethics.comingSoon')}
                    </span>
                  </button>

                  {expandedCategories.ethics && (isDesktopOpen || isMobileOpen) && (
                    <div className="ml-6 pl-4 border-l-2 border-white/15 dark:border-white/10 space-y-0.5 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('ethics.submenu.guidelines')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('ethics.submenu.biasDetection')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('ethics.submenu.privacy')}
                      </div>
                      <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-default tracking-wide">
                        {tSidebar('ethics.submenu.compliance')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isDesktopOpen && (
              <>
                {bookmarks.length > 0 && (() => {
                  // Group bookmarks by category
                  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
                    const categoryTitle = bookmark.categoryTitle || "Uncategorized";
                    if (!acc[categoryTitle]) {
                      acc[categoryTitle] = [];
                    }
                    acc[categoryTitle].push(bookmark);
                    return acc;
                  }, {});

                  return (
                    <div className="mt-6 pt-6 border-t border-white/15 dark:border-white/10">
                      <div className="px-3 mb-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {tSidebar('bookmarks.sectionTitle')}
                      </div>
                      <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                        {Object.entries(groupedBookmarks).map(([categoryTitle, categoryBookmarks]) => (
                          <div key={categoryTitle}>
                            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                              {categoryTitle}
                            </div>
                            <div className="space-y-1">
                              {categoryBookmarks.map((bookmark) => (
                                <Link
                                  key={bookmark.id}
                                  to={bookmark.topicId ? `/topic/${bookmark.categoryId}/${bookmark.topicId}` : `/category/${bookmark.categoryId}`}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 group text-left active:scale-[0.98] hover:shadow-inner"
                                >
                                  <Bookmark size={14} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" strokeWidth={2.5} fill="currentColor" aria-hidden="true" />
                                  <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1 font-medium tracking-wide">
                                    {bookmark.title}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeBookmark(bookmark.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 min-w-[36px] min-h-[36px] p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 touch-manipulation flex items-center justify-center hover:shadow-inner"
                                    aria-label={tSidebar('bookmarks.removeBookmark')}
                                  >
                                    <X size={16} strokeWidth={2.5} aria-hidden="true" />
                                  </button>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {user && uniqueHistory.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/15 dark:border-white/10">
                    <div className="px-3 mb-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {tSidebar('history.sectionTitle')}
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {uniqueHistory.map((item) => (
                        <Link
                          key={item.id}
                          to={`/topic/${item.categoryId}/${item.topicId}`}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 active:scale-[0.98] focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500/50 cursor-pointer hover:shadow-inner"
                          aria-label={tSidebar('bookmarks.viewTopic', { title: item.title })}
                        >
                          <History size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium tracking-wide">
                            {item.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={`relative border-t border-white/15 dark:border-white/10 backdrop-blur-xl transition-all duration-300 ${isDesktopOpen ? "p-4" : "lg:p-2"
            } ${isMobileOpen ? "p-3" : ""}`}>
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
                  className={`w-full flex items-center rounded-xl hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 touch-manipulation min-h-[56px] hover:shadow-inner ${isDesktopOpen ? "gap-3 p-3 text-left" : "lg:justify-center lg:p-2"
                    } ${isMobileOpen ? "gap-3 p-3.5 text-left" : ""}`}
                  aria-label={tSidebar('profile.menu.ariaLabel')}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="profile-menu"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold border-2 border-white/20 dark:border-slate-800/50 shadow-lg shadow-indigo-500/40 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all flex-shrink-0 ring-2 ring-indigo-500/20">
                    <User size={22} strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <div className={`transition-all duration-300 ${isDesktopOpen ? "opacity-100 max-w-full flex-1 min-w-0" : "lg:hidden"
                    }`}>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
                      {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-semibold uppercase tracking-wider">
                      {isAdmin ? tCommon('status.admin') : tCommon('status.member')}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 dark:text-slate-500 transition-all duration-300 flex-shrink-0 ${isProfileOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                      } ${!isDesktopOpen ? "lg:hidden" : ""}`}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </button>

                {isProfileOpen && (
                  <div
                    id="profile-menu"
                    className={`absolute bottom-full mb-2 bg-white dark:bg-slate-900 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2 ${isDesktopOpen ? "left-0 w-full" : "lg:left-20 lg:w-56"
                      }`}
                    role="menu"
                    aria-label={tSidebar('profile.menu.ariaLabel')}
                  >
                    <div className="py-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        role="menuitem"
                        aria-label={tSidebar('profile.menu.ariaLabelMyProfile')}
                      >
                        <User size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.profile')}
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        role="menuitem"
                        aria-label={tCommon('nav.progress')}
                      >
                        <TrendingUp size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.progress')}
                      </Link>
                      <button
                        className="w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        role="menuitem"
                        aria-label={tCommon('nav.settings')}
                      >
                        <Settings size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.settings')}
                      </button>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-white/10 dark:hover:bg-white/10 flex items-center gap-3 transition-all duration-200 font-semibold tracking-wide rounded-lg mx-1 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          role="menuitem"
                          aria-label={tCommon('nav.admin')}
                        >
                          <Shield size={16} strokeWidth={2.5} aria-hidden="true" /> {tCommon('nav.admin')}
                        </Link>
                      )}
                      <div className="h-px bg-gradient-to-r from-transparent via-white/15 dark:via-white/10 to-transparent my-1.5 mx-2" role="separator" aria-hidden="true"></div>

                      <div className="px-4 py-2.5 flex items-center justify-between gap-3 mx-1">
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
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
