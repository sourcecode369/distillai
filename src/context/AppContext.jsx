import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { dbHelpers } from "../lib/supabase";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true; // Default to dark mode
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [readingHistory, setReadingHistory] = useState(() => {
    const saved = localStorage.getItem("readingHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState([]);
  const currentUserIdRef = useRef(null);

  const showToast = useCallback((message, type = "success", duration = 2500, title = null) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration, title }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Apply dark mode class to document immediately on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Apply initial dark mode class on mount (before React hydration)
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const initialDarkMode = saved !== null ? JSON.parse(saved) : true;
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Save bookmarks to localStorage (fallback for offline)
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save reading history to localStorage (fallback for offline)
  useEffect(() => {
    localStorage.setItem("readingHistory", JSON.stringify(readingHistory));
  }, [readingHistory]);

  // Sync user data from database
  const syncUserData = useCallback(async (userId) => {
    if (!userId) {
      // Clear data if no user
      setBookmarks([]);
      setReadingHistory([]);
      localStorage.removeItem("bookmarks");
      localStorage.removeItem("readingHistory");
      currentUserIdRef.current = null;
      return;
    }

    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured, skip sync
      return;
    }

    // Clear existing data first to prevent showing stale data
    setBookmarks([]);
    setReadingHistory([]);
    currentUserIdRef.current = userId;

    try {
      // Sync bookmarks
      const { data: dbBookmarks, error: bookmarksError } = await dbHelpers.getBookmarks(userId);
      if (!bookmarksError && dbBookmarks) {
        // Remove duplicates by item_id
        const bookmarkMap = new Map();
        dbBookmarks.forEach((b) => {
          const itemId = b.item_id || `${b.category_id}-${b.topic_id}`;
          if (!bookmarkMap.has(itemId)) {
            const bookmark = {
              id: itemId,
              type: "topic",
              title: b.title,
              categoryTitle: b.category_title,
              categoryId: b.category_id,
              topicId: b.topic_id,
              timestamp: new Date(b.created_at).getTime(),
            };

            bookmarkMap.set(itemId, bookmark);
          }
        });
        const formattedBookmarks = Array.from(bookmarkMap.values());
        setBookmarks(formattedBookmarks);
      } else {
        setBookmarks([]);
      }

      // Sync reading history from database on login
      const { data: dbHistory, error: historyError } = await dbHelpers.getReadingHistory(userId, 10);
      if (!historyError && dbHistory && dbHistory.length > 0) {
        const formattedHistory = dbHistory.map((h) => ({
          id: `${h.category_id}-${h.topic_id}`,
          type: "topic",
          categoryId: h.category_id,
          topicId: h.topic_id,
          title: h.title,
          categoryTitle: h.category_title,
          timestamp: new Date(h.last_read_at || h.created_at).getTime(),
        }));
        setReadingHistory(formattedHistory);
      } else {
        setReadingHistory([]);
      }
    } catch (error) {
      console.error("Error syncing user data:", error);
      // Clear data on error
      setBookmarks([]);
      setReadingHistory([]);
    }
  }, []);


  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const addBookmark = useCallback(async (item, userId = null) => {
    const bookmark = {
      id: item.id || `${item.categoryId}-${item.topicId}`,
      type: item.type || "topic",
      categoryId: item.categoryId,
      topicId: item.topicId,
      title: item.title,
      categoryTitle: item.categoryTitle,
      timestamp: Date.now(),
    };

    // Update local state
    setBookmarks((prev) => {
      if (prev.find((b) => b.id === bookmark.id)) return prev;
      return [...prev, bookmark];
    });

    // Sync to database if logged in and Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    if ((userId || currentUserIdRef.current) && supabaseUrl && supabaseAnonKey) {
      const uid = userId || currentUserIdRef.current;
      try {
        await dbHelpers.addBookmark(uid, bookmark);
      } catch (error) {
        console.error("Error adding bookmark to database:", error);
        // Continue with localStorage fallback
      }
    }
  }, []);

  const removeBookmark = useCallback(async (id, userId = null) => {
    // Find bookmark to get type and related IDs
    const bookmark = bookmarks.find((b) => b.id === id);

    // Update local state
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    // Sync to database if logged in and Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    if ((userId || currentUserIdRef.current) && bookmark && supabaseUrl && supabaseAnonKey) {
      const uid = userId || currentUserIdRef.current;
      try {
        await dbHelpers.removeBookmark(uid, bookmark.categoryId, bookmark.topicId);
      } catch (error) {
        console.error("Error removing bookmark from database:", error);
        // Continue with localStorage fallback
      }
    }
  }, [bookmarks]);

  const isBookmarked = useCallback((id) => {
    return bookmarks.some((b) => b.id === id);
  }, [bookmarks]);

  const addToHistory = useCallback(async (item, userId = null) => {
    // Only add to history if user is signed in
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    const uid = userId || currentUserIdRef.current;

    if (!uid || !supabaseUrl || !supabaseAnonKey) {
      // User not signed in or Supabase not configured, don't add to history
      return;
    }

    const historyItem = {
      id: item.id || `${item.categoryId}-${item.topicId}`,
      type: item.type || "topic",
      categoryId: item.categoryId,
      topicId: item.topicId,
      title: item.title,
      categoryTitle: item.categoryTitle,
      timestamp: Date.now(),
    };

    // Update local state - remove duplicates and keep most recent
    setReadingHistory((prev) => {
      // Remove any existing item with the same id
      const filtered = prev.filter((h) => h.id !== historyItem.id);
      // Add new item at the beginning and limit to 5
      return [historyItem, ...filtered].slice(0, 5);
    });

    // Sync to database
    try {
      await dbHelpers.addToHistory(uid, {
        categoryId: historyItem.categoryId,
        topicId: historyItem.topicId,
        title: historyItem.title,
        categoryTitle: historyItem.categoryTitle,
        progressPercentage: item.progressPercentage || 0,
      });
    } catch (error) {
      console.error("Error adding to history in database:", error);
      // Continue with localStorage fallback
    }
  }, []);

  // Clear user data function (called on sign out)
  const clearUserData = useCallback(async () => {
    const userId = currentUserIdRef.current;

    // Clear state immediately and synchronously (before any async operations)
    setBookmarks([]);
    setReadingHistory([]);
    localStorage.removeItem("bookmarks");
    localStorage.removeItem("readingHistory");
    currentUserIdRef.current = null;

  }, []);

  const value = useMemo(() => ({
    darkMode,
    toggleDarkMode,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    readingHistory,
    addToHistory,
    toasts,
    showToast,
    removeToast,
    syncUserData,
    clearUserData,
  }), [
    darkMode,
    toggleDarkMode,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    readingHistory,
    addToHistory,
    toasts,
    showToast,
    removeToast,
    syncUserData,
    clearUserData,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

