import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Search, Menu, ChevronRight, Github, Bookmark, Globe, User, TrendingUp, Settings, Shield, LogOut, LogIn, Moon, Sun, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const Topbar = ({
  toggleMobile,
  toggleDesktop,
  isDesktopOpen,
}) => {
  const { t } = useTranslation('header');
  const { t: tCommon } = useTranslation('common');
  const { bookmarks, darkMode, toggleDarkMode } = useApp();
  const { user, isAdmin, signOut } = useAuth();
  const { setIsLoginModalOpen } = useAuthModal();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showBookmarkDropdown, setShowBookmarkDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const bookmarkButtonRef = useRef(null);
  const languageButtonRef = useRef(null);
  const userButtonRef = useRef(null);

  // Sync local state with URL param
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchDropdown = document.querySelector('[data-search-dropdown]');
      const isClickInSearchContainer = searchContainerRef.current?.contains(event.target);
      const isClickInSearchDropdown = searchDropdown?.contains(event.target);
      if (!isClickInSearchContainer && !isClickInSearchDropdown) {
        if (!searchQuery) setIsSearchExpanded(false);
        setShowSearchDropdown(false);
      }

      const bookmarkDropdown = document.querySelector('[data-bookmark-dropdown]');
      if (!bookmarkButtonRef.current?.contains(event.target) && !bookmarkDropdown?.contains(event.target)) {
        setShowBookmarkDropdown(false);
      }

      const languageDropdown = document.querySelector('[data-language-dropdown]');
      if (!languageButtonRef.current?.contains(event.target) && !languageDropdown?.contains(event.target)) {
        setShowLanguageDropdown(false);
      }

      if (!userButtonRef.current?.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchExpanded(true);
      }
      if (e.key === "Escape" && isSearchExpanded) {
        setIsSearchExpanded(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchExpanded]);

  const handleSearchClose = useCallback(() => setShowSearchDropdown(false), []);
  const handleBookmarkClose = useCallback(() => setShowBookmarkDropdown(false), []);
  const handleLanguageClose = useCallback(() => setShowLanguageDropdown(false), []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setShowSearchDropdown(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [navigate]);

  const handleSearchButtonClick = useCallback((e) => {
    e.stopPropagation();
    setShowSearchDropdown(prev => !prev);
    setShowBookmarkDropdown(false);
    setShowLanguageDropdown(false);
    setShowUserDropdown(false);
  }, []);

  const handleBookmarkButtonClick = useCallback((e) => {
    e.stopPropagation();
    setShowBookmarkDropdown(prev => !prev);
    setShowSearchDropdown(false);
    setShowLanguageDropdown(false);
    setShowUserDropdown(false);
  }, []);

  const handleLanguageButtonClick = useCallback((e) => {
    e.stopPropagation();
    setShowLanguageDropdown(prev => !prev);
    setShowSearchDropdown(false);
    setShowBookmarkDropdown(false);
    setShowUserDropdown(false);
  }, []);

  const handleUserButtonClick = useCallback((e) => {
    e.stopPropagation();
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setShowUserDropdown(prev => !prev);
    setShowSearchDropdown(false);
    setShowBookmarkDropdown(false);
    setShowLanguageDropdown(false);
  }, [user, setIsLoginModalOpen]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setShowUserDropdown(false);
    try {
      await signOut();
      navigate("/");
    } catch {
      // ignore
    } finally {
      setIsSigningOut(false);
    }
  };

  const initials = getInitials(user);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b h-16 transition-all shadow-2xl" style={{
      borderImage: 'linear-gradient(to right, transparent, rgba(148, 163, 184, 0.25), transparent) 1'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: hamburger */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleMobile}
            className="lg:hidden min-w-[44px] min-h-[44px] p-2.5 -ml-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800/50 rounded-xl transition-all duration-300 flex items-center justify-center touch-manipulation border border-transparent hover:border-indigo-500/30"
            aria-label={t('toggleMobileMenu')}
          >
            <Menu size={22} aria-hidden="true" />
          </button>

          {!isDesktopOpen && (
            <button
              onClick={toggleDesktop}
              className="hidden lg:flex items-center justify-center w-9 h-9 -ml-2 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 rounded-xl border border-gray-800 hover:border-transparent transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-indigo-500/30"
              title={t('expandSidebar')}
            >
              <ChevronRight size={18} className="group-hover:translate-x-[2px] transition-transform duration-300" strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Search */}
          {user && (
            <div ref={searchContainerRef} className="relative">
              <button
                onClick={handleSearchButtonClick}
                className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                title={`${t('search')} (Ctrl+K)`}
                aria-label={t('search')}
              >
                <Search size={20} />
              </button>
              {showSearchDropdown && (
                <div className="absolute top-full right-0 mt-2 z-50" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
                  <SearchDropdown onClose={handleSearchClose} onSearch={handleSearch} searchQuery={searchQuery} onQueryChange={setSearchQuery} />
                </div>
              )}
            </div>
          )}

          {/* Bookmarks */}
          {user && (
            <div ref={bookmarkButtonRef} className="relative">
              <button
                onClick={handleBookmarkButtonClick}
                className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 relative"
                title={t('bookmarks')}
                aria-label={t('bookmarks')}
              >
                <Bookmark size={20} />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-gray-950">
                    {bookmarks.length > 9 ? '9+' : bookmarks.length}
                  </span>
                )}
              </button>
              {showBookmarkDropdown && (
                <div className="absolute top-full right-0 mt-2 z-50" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
                  <BookmarkDropdown onClose={handleBookmarkClose} />
                </div>
              )}
            </div>
          )}

          <NotificationBell />

          {/* Language */}
          <div ref={languageButtonRef} className="relative">
            <button
              onClick={handleLanguageButtonClick}
              className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
              title={t('selectLanguage')}
              aria-label={t('selectLanguage')}
            >
              <Globe size={20} />
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-full right-0 mt-2 z-50" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
                <LanguageDropdown onClose={handleLanguageClose} />
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden sm:block h-8 w-px bg-gray-800 mx-1" aria-hidden="true" />

          {/* GitHub */}
          <a
            href="https://github.com/sourcecode369"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-gray-800/60 hover:bg-gray-800 text-gray-300 border border-gray-700/50 hover:border-gray-600 h-9 px-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            aria-label={t('starOnGitHub')}
          >
            <Github size={16} aria-hidden="true" />
            <span className="hidden md:inline">{t('star')}</span>
          </a>

          {/* User avatar / Sign In */}
          <div ref={userButtonRef} className="relative">
            {user ? (
              <>
                <button
                  onClick={handleUserButtonClick}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 hover:scale-[1.05] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 select-none"
                  aria-label="User menu"
                  aria-expanded={showUserDropdown}
                >
                  {initials}
                </button>

                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-60 rounded-2xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-100 truncate">{displayName}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5 px-1.5 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 transition-all duration-150"
                      >
                        <User size={15} className="text-indigo-400 flex-shrink-0" />
                        {tCommon('nav.profile')}
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-800/60 transition-all duration-150"
                      >
                        <TrendingUp size={15} className="text-violet-400 flex-shrink-0" />
                        {tCommon('nav.progress')}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/10 transition-all duration-150"
                        >
                          <Shield size={15} className="flex-shrink-0" />
                          {tCommon('nav.admin')}
                        </Link>
                      )}
                    </div>

                    <div className="px-2.5 py-2 border-t border-gray-800/60">
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-400">
                          {darkMode ? <Moon size={14} /> : <Sun size={14} />}
                          {tCommon('nav.darkMode') || 'Dark Mode'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleDarkMode(); }}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${darkMode ? 'bg-indigo-600' : 'bg-gray-600'}`}
                          role="switch"
                          aria-checked={darkMode}
                        >
                          <span className={`${darkMode ? 'translate-x-4' : 'translate-x-0.5'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                        </button>
                      </div>
                    </div>

                    <div className="px-2.5 pb-2 border-t border-gray-800/60 pt-1.5">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 disabled:opacity-60"
                      >
                        {isSigningOut ? <Loader2 size={15} className="animate-spin flex-shrink-0" /> : <LogOut size={15} className="flex-shrink-0" />}
                        {isSigningOut ? (tCommon('messages.signingOut') || 'Signing out…') : tCommon('nav.signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 h-9 px-3.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                aria-label={tCommon('nav.signIn')}
              >
                <LogIn size={15} />
                <span className="hidden sm:inline">Login / Signup</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Topbar.propTypes = {
  toggleMobile: PropTypes.func.isRequired,
  toggleDesktop: PropTypes.func.isRequired,
  isDesktopOpen: PropTypes.bool.isRequired,
};

export default Topbar;
