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
  // Dark mode is permanently on — no toggle
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

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
      const filtered = prev.filter((h) => h.id !== historyItem.id);
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

      // Check reading milestones and fire notifications
      const { data: allHistory } = await dbHelpers.getReadingHistory(uid, 200);
      const totalRead = allHistory?.length || 0;

      const MILESTONES = {
        1:  { title: "First handbook read!",    body: "You've started your AI learning journey on Distill AI. Keep going!" },
        5:  { title: "5 handbooks read!",        body: "Great momentum — you've explored 5 topics. You're building real knowledge." },
        10: { title: "10 handbooks read!",       body: "Double digits! You're making serious progress on Distill AI." },
        20: { title: "20 handbooks read!",       body: "Impressive! 20 handbooks read. You're on a roll." },
        50: { title: "50 handbooks read!",       body: "50 handbooks — that's serious dedication. You're an AI expert in the making." },
      };

      let notified;
      try { notified = new Set(JSON.parse(localStorage.getItem("readingMilestones") || "[]")); }
      catch { notified = new Set(); }

      for (const [milestone, msg] of Object.entries(MILESTONES)) {
        const m = Number(milestone);
        if (totalRead >= m && !notified.has(m)) {
          notified.add(m);
          localStorage.setItem("readingMilestones", JSON.stringify([...notified]));
          dbHelpers.createNotification({ userId: uid, title: msg.title, body: msg.body }).catch(() => {});
        }
      }
    } catch (error) {
      console.error("Error adding to history in database:", error);
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
    localStorage.removeItem("readingMilestones");
    currentUserIdRef.current = null;

  }, []);

  const value = useMemo(() => ({
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

