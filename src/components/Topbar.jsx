import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, Github, Bookmark, Globe, User, TrendingUp, Shield, LogOut, LogIn, Loader2, LayoutDashboard, BookOpen, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import NotificationBell from "./NotificationBell";
import SearchDropdown from "./SearchDropdown";
import BookmarkDropdown from "./BookmarkDropdown";
import { LanguageDropdown } from "./LanguageSelector";

const getInitials = (user) => {
  if (!user) return "U";
  const name = user.user_metadata?.full_name || user.email || "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0]?.toUpperCase() || "U";
};

const Topbar = () => {
  const { t } = useTranslation("header");
  const { t: tCommon } = useTranslation("common");
  const { bookmarks } = useApp();
  const { user, isAdmin, signOut } = useAuth();
  const { setIsLoginModalOpen } = useAuthModal();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showBookmarkDropdown, setShowBookmarkDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const searchRef = useRef(null);
  const bookmarkRef = useRef(null);
  const languageRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Close all dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current?.contains(e.target) && !document.querySelector("[data-search-dropdown]")?.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (!bookmarkRef.current?.contains(e.target) && !document.querySelector("[data-bookmark-dropdown]")?.contains(e.target)) {
        setShowBookmarkDropdown(false);
      }
      if (!languageRef.current?.contains(e.target) && !document.querySelector("[data-language-dropdown]")?.contains(e.target)) {
        setShowLanguageDropdown(false);
      }
      if (!userRef.current?.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, []);

  // Ctrl+K to open search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchDropdown(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeAll = () => {
    setShowSearchDropdown(false);
    setShowBookmarkDropdown(false);
    setShowLanguageDropdown(false);
    setShowUserDropdown(false);
    setShowMobileMenu(false);
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setShowSearchDropdown(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [navigate]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    closeAll();
    try { await signOut(); navigate("/"); } catch { /* ignore */ }
    finally { setIsSigningOut(false); }
  };

  const iconBtn = "min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 relative";

  const initials = getInitials(user);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";


  return (
    <>
    <header
      className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/60 h-16 shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/4 via-transparent to-violet-500/4 pointer-events-none" />

      <div className="relative h-full max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* ── MOBILE: Hamburger ─────────────────────────────────────── */}
        <button
          onClick={() => setShowMobileMenu(p => !p)}
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-gray-700/50 bg-gray-800/50 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all duration-200 shrink-0"
          aria-label="Menu"
        >
          {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* ── LEFT: Logo ───────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-[1.05] transition-all duration-200 ring-2 ring-indigo-400/20 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-5 h-5" aria-hidden="true">
              <defs>
                <linearGradient id="navD" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#c7d2fe" />
                </linearGradient>
              </defs>
              <path
                d="M28 20 L28 80 L52 80 C70 80 78 68 78 50 C78 32 70 20 52 20 Z M40 32 L50 32 C62 32 66 39 66 50 C66 61 62 68 50 68 L40 68 Z"
                fill="url(#navD)"
              />
            </svg>
          </div>
          <span className="hidden sm:flex items-baseline gap-1 leading-none">
            <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Distill</span>
            <span className="font-semibold text-lg text-gray-400">AI</span>
          </span>
        </Link>

        {/* ── CENTER: Nav ──────────────────────────────────────────────── */}
        <nav className="hidden md:flex items-stretch h-full gap-1">
          {user && (
            <NavLink to="/" end>
              {({ isActive }) => (
                <span className={`relative flex items-center gap-2 px-4 h-full text-sm font-semibold transition-colors duration-200 select-none ${
                  isActive ? "text-gray-100" : "text-gray-500 hover:text-gray-300"
                }`}>
                  <LayoutDashboard size={14} className={isActive ? "text-indigo-400" : ""} />
                  Dashboard
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                  )}
                </span>
              )}
            </NavLink>
          )}
          <NavLink to="/handbooks">
            {({ isActive }) => (
              <span className={`relative flex items-center gap-2 px-4 h-full text-sm font-semibold transition-colors duration-200 select-none ${
                isActive ? "text-gray-100" : "text-gray-500 hover:text-gray-300"
              }`}>
                <BookOpen size={14} className={isActive ? "text-indigo-400" : ""} />
                Handbooks
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                )}
              </span>
            )}
          </NavLink>
        </nav>

        {/* ── RIGHT: Actions ───────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Search */}
          {user && (
            <div ref={searchRef} className="relative">
              <button
                onClick={() => { closeAll(); setShowSearchDropdown(p => !p); }}
                className={iconBtn}
                title={`${t("search")} (Ctrl+K)`}
                aria-label={t("search")}
              >
                <Search size={18} />
              </button>
              {showSearchDropdown && (
                <div className="fixed sm:absolute top-16 sm:top-full left-2 right-2 sm:left-auto sm:right-0 sm:mt-2 z-50">
                  <SearchDropdown
                    onClose={() => setShowSearchDropdown(false)}
                    onSearch={handleSearch}
                    searchQuery={searchQuery}
                    onQueryChange={setSearchQuery}
                  />
                </div>
              )}
            </div>
          )}

          {/* Bookmarks */}
          {user && (
            <div ref={bookmarkRef} className="relative">
              <button
                onClick={() => { closeAll(); setShowBookmarkDropdown(p => !p); }}
                className={iconBtn}
                title={t("bookmarks")}
                aria-label={t("bookmarks")}
              >
                <Bookmark size={18} />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-gray-950">
                    {bookmarks.length > 9 ? "9+" : bookmarks.length}
                  </span>
                )}
              </button>
              {showBookmarkDropdown && (
                <div className="fixed sm:absolute top-16 sm:top-full left-2 right-2 sm:left-auto sm:right-0 sm:mt-2 z-50">
                  <BookmarkDropdown onClose={() => setShowBookmarkDropdown(false)} />
                </div>
              )}
            </div>
          )}

          <NotificationBell />

          {/* Language */}
          <div ref={languageRef} className="relative">
            <button
              onClick={() => { closeAll(); setShowLanguageDropdown(p => !p); }}
              className={iconBtn}
              title={t("selectLanguage")}
              aria-label={t("selectLanguage")}
            >
              <Globe size={18} />
            </button>
            {showLanguageDropdown && (
              <div className="fixed sm:absolute top-16 sm:top-full left-2 right-2 sm:left-auto sm:right-0 sm:mt-2 z-50">
                <LanguageDropdown onClose={() => setShowLanguageDropdown(false)} />
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden sm:block h-7 w-px bg-gray-800 mx-1" aria-hidden="true" />

          {/* GitHub */}
          <a
            href="https://github.com/sourcecode369"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:text-gray-100 hover:bg-gray-800 hover:border-gray-600 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
            aria-label={t("starOnGitHub")}
          >
            <Github size={16} />
            <span className="hidden lg:inline">{t("star")}</span>
          </a>

          {/* User avatar or Login */}
          <div ref={userRef} className="relative">
            {user ? (
              <>
                <button
                  onClick={() => { closeAll(); setShowUserDropdown(p => !p); }}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 hover:scale-[1.05] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 select-none"
                  aria-label="User menu"
                  aria-expanded={showUserDropdown}
                >
                  {initials}
                </button>

                {showUserDropdown && (
                  <div className="fixed sm:absolute top-16 sm:top-full left-2 right-2 sm:left-auto sm:right-0 sm:mt-2 sm:w-56 rounded-2xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info */}
                    <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-100 truncate">{displayName}</p>
                          <p className="text-[11px] text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-1.5 px-1.5 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={closeAll}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 transition-all duration-150"
                      >
                        <User size={14} className="text-indigo-400 flex-shrink-0" />
                        {tCommon("nav.profile")}
                      </Link>
                      <Link
                        to="/progress"
                        onClick={closeAll}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 transition-all duration-150"
                      >
                        <TrendingUp size={14} className="text-indigo-400 flex-shrink-0" />
                        {tCommon("nav.progress")}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={closeAll}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/10 transition-all duration-150"
                        >
                          <Shield size={14} className="flex-shrink-0" />
                          {tCommon("nav.admin")}
                        </Link>
                      )}
                    </div>

                    {/* Sign out */}
                    <div className="px-2.5 pb-2.5 pt-1 border-t border-gray-800/60">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 disabled:opacity-60"
                      >
                        {isSigningOut
                          ? <Loader2 size={14} className="animate-spin flex-shrink-0" />
                          : <LogOut size={14} className="flex-shrink-0" />}
                        {isSigningOut ? (tCommon("messages.signingOut") || "Signing out…") : tCommon("nav.signOut")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-500/60 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
              >
                <LogIn size={14} />
                <span>Login / Signup</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>

    {/* ── MOBILE MENU DRAWER ──────────────────────────────────────────── */}
    {showMobileMenu && (
      <div className="md:hidden fixed inset-0 z-30 top-16" onClick={closeAll}>
        <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" />
        <div className="relative border-b border-gray-800/60 bg-gray-950 shadow-xl px-4 py-4 space-y-1.5" onClick={e => e.stopPropagation()}>
          {user && (
            <NavLink to="/" end onClick={closeAll}>
              {({ isActive }) => (
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? "bg-indigo-600/15 border border-indigo-500/25 text-indigo-300" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                }`}>
                  <LayoutDashboard size={15} />
                  Dashboard
                </span>
              )}
            </NavLink>
          )}
          <NavLink to="/handbooks" onClick={closeAll}>
            {({ isActive }) => (
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive ? "bg-indigo-600/15 border border-indigo-500/25 text-indigo-300" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}>
                <BookOpen size={15} />
                Handbooks
              </span>
            )}
          </NavLink>
          {!user && (
            <button
              onClick={() => { closeAll(); setIsLoginModalOpen(true); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-300 hover:bg-indigo-600/15 transition-colors"
            >
              <LogIn size={15} />
              Login / Signup
            </button>
          )}
        </div>
      </div>
    )}
  </>
  );
};

export default Topbar;
