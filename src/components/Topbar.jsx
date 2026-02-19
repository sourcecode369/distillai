import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Search, Menu, ChevronRight, Github, Bookmark, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import SearchDropdown from "./SearchDropdown";
import BookmarkDropdown from "./BookmarkDropdown";
import { LanguageDropdown } from "./LanguageSelector";

const Topbar = ({
  toggleMobile,
  toggleDesktop,
  isDesktopOpen,
}) => {
  const { t } = useTranslation('header');
  const { bookmarks } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showBookmarkDropdown, setShowBookmarkDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const bookmarkButtonRef = useRef(null);
  const languageButtonRef = useRef(null);

  // Sync local state with URL param
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside search container and dropdown
      const searchDropdown = document.querySelector('[data-search-dropdown]');
      const isClickInSearchContainer = searchContainerRef.current?.contains(event.target);
      const isClickInSearchDropdown = searchDropdown?.contains(event.target);

      if (!isClickInSearchContainer && !isClickInSearchDropdown) {
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
        setShowSearchDropdown(false);
      }

      // Check if click is outside bookmark button and dropdown
      const bookmarkDropdown = document.querySelector('[data-bookmark-dropdown]');
      const isClickInBookmarkButton = bookmarkButtonRef.current?.contains(event.target);
      const isClickInBookmarkDropdown = bookmarkDropdown?.contains(event.target);

      if (!isClickInBookmarkButton && !isClickInBookmarkDropdown) {
        setShowBookmarkDropdown(false);
      }

      // Check if click is outside language button and dropdown
      const languageDropdown = document.querySelector('[data-language-dropdown]');
      const isClickInLanguageButton = languageButtonRef.current?.contains(event.target);
      const isClickInLanguageDropdown = languageDropdown?.contains(event.target);

      if (!isClickInLanguageButton && !isClickInLanguageDropdown) {
        setShowLanguageDropdown(false);
      }
    };

    // Use capture phase to catch clicks before they bubble
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

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearchClose = useCallback(() => {
    setShowSearchDropdown(false);
  }, []);

  const handleBookmarkClose = useCallback(() => {
    setShowBookmarkDropdown(false);
  }, []);

  const handleLanguageClose = useCallback(() => {
    setShowLanguageDropdown(false);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setShowSearchDropdown(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [navigate]);

  const handleSearchButtonClick = useCallback((e) => {
    e.stopPropagation();
    // Toggle dropdown state
    setShowSearchDropdown(prev => !prev);
    setShowBookmarkDropdown(false);
    setShowLanguageDropdown(false);
  }, []);

  const handleBookmarkButtonClick = useCallback((e) => {
    e.stopPropagation();
    // Toggle dropdown state
    setShowBookmarkDropdown(prev => !prev);
    setShowSearchDropdown(false);
    setShowLanguageDropdown(false);
  }, []);

  const handleLanguageButtonClick = useCallback((e) => {
    e.stopPropagation();
    // Toggle dropdown state
    setShowLanguageDropdown(prev => !prev);
    setShowSearchDropdown(false);
    setShowBookmarkDropdown(false);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b h-16 transition-all shadow-2xl" style={{
      borderImage: 'linear-gradient(to right, transparent, rgba(148, 163, 184, 0.25), transparent) 1'
    }}>
      {/* Gradient overlay for premium effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
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

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          {/* Search Icon with Dropdown - Only show when logged in */}
          {user && (
            <div
              ref={searchContainerRef}
              className="relative"
            >
              <button
                onClick={handleSearchButtonClick}
                className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 touch-manipulation relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                title={`${t('search')} (Ctrl+K)`}
                aria-label={t('search')}
              >
                <Search size={20} />
              </button>
              {showSearchDropdown && (
                <div className="absolute top-full right-0 sm:right-0 left-auto sm:left-auto mt-2 z-50" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
                  <SearchDropdown
                    onClose={handleSearchClose}
                    onSearch={handleSearch}
                    searchQuery={searchQuery}
                    onQueryChange={setSearchQuery}
                  />
                </div>
              )}
            </div>
          )}

          {/* Bookmark Icon with Dropdown - Only show when logged in */}
          {user && (
            <div
              ref={bookmarkButtonRef}
              className="relative"
            >
              <button
                onClick={handleBookmarkButtonClick}
                className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 touch-manipulation relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                title={t('bookmarks')}
                aria-label={t('bookmarks')}
              >
                <Bookmark size={20} />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-950">
                    {bookmarks.length > 9 ? '9+' : bookmarks.length}
                  </span>
                )}
              </button>
              {showBookmarkDropdown && (
                <div className="absolute top-full right-0 sm:right-0 left-auto sm:left-auto mt-2 z-50" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
                  <BookmarkDropdown
                    onClose={handleBookmarkClose}
                  />
                </div>
              )}
            </div>
          )}

          <NotificationBell />

          <div
            ref={languageButtonRef}
            className="relative"
          >
            <button
              onClick={handleLanguageButtonClick}
              className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 touch-manipulation relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
              title={t('selectLanguage')}
              aria-label={t('selectLanguage')}
            >
              <Globe size={20} />
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-full right-0 sm:right-0 left-auto sm:left-auto mt-2 z-50" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
                <LanguageDropdown onClose={handleLanguageClose} />
              </div>
            )}
          </div>

          {/* Visual separator for grouping */}
          <div className="hidden lg:block h-8 w-px bg-gray-700/50 mx-2" aria-hidden="true"></div>

          {/* Action buttons group */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-200 border border-gray-700/50 hover:border-gray-600 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-gray-900/30 hover:scale-105 active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
              aria-label={t('starOnGitHub')}
            >
              <Github size={18} aria-hidden="true" />
              <span className="hidden sm:inline">{t('star')}</span>
            </button>
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
