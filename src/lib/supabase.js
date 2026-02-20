import { createClient } from "@supabase/supabase-js";

// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
}

// Create client with fallback empty strings to prevent errors
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Helper functions for common operations
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Additional user metadata
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with OAuth provider
  signInWithOAuth: async (provider, options = {}) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}`,
        ...options,
      },
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    // Sign out from Supabase - this should clear the session
    const { error } = await supabase.auth.signOut();

    // Explicitly clear all auth-related storage to prevent session restoration
    // This is a safety measure in case Supabase doesn't clear everything
    try {
      // Get the project reference from URL to clear the correct storage key
      const projectRef = supabaseUrl
        ? supabaseUrl.split("//")[1]?.split(".")[0]
        : null;

      // Clear Supabase session storage with project-specific key
      if (projectRef) {
        const storageKey = `sb-${projectRef}-auth-token`;
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
      }

      // Clear all Supabase-related localStorage items (comprehensive cleanup)
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith("sb-") ||
            key.includes("supabase") ||
            key.includes("auth"))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Also clear sessionStorage
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (
          key &&
          (key.startsWith("sb-") ||
            key.includes("supabase") ||
            key.includes("auth"))
        ) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));
    } catch (storageError) {
      // Continue even if storage clear fails
    }

    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Update user email
  updateEmail: async (newEmail) => {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    return { data, error };
  },

  // Update user password
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },
};

// Database helpers
export const dbHelpers = {
  // Bookmarks
  getBookmarks: async (userId) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  addBookmark: async (userId, bookmark) => {
    const insertData = {
      user_id: userId,
      type: 'topic',
      title: bookmark.title,
      category_title: bookmark.categoryTitle,
      category_id: bookmark.categoryId,
      topic_id: bookmark.topicId,
      item_id: `${bookmark.categoryId}-${bookmark.topicId}`,
    };

    const { data, error } = await supabase
      .from("bookmarks")
      .insert(insertData)
      .select()
      .single();
    return { data, error };
  },

  removeBookmark: async (userId, categoryId, topicId) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .eq("topic_id", topicId);
    return { data, error };
  },

  // Reading History
  getReadingHistory: async (userId, limit = 5) => {
    const { data, error } = await supabase
      .from("reading_history")
      .select("*")
      .eq("user_id", userId)
      .order("last_read_at", { ascending: false })
      .limit(limit);
    return { data, error };
  },

  addToHistory: async (userId, item) => {
    // First, check if record exists
    const { data: existing } = await supabase
      .from("reading_history")
      .select("id")
      .eq("user_id", userId)
      .eq("category_id", item.categoryId)
      .eq("topic_id", item.topicId)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from("reading_history")
        .update({
          last_read_at: new Date().toISOString(),
          progress_percentage: item.progressPercentage || 0,
        })
        .eq("id", existing.id)
        .select()
        .single();
      return { data, error };
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from("reading_history")
        .insert({
          user_id: userId,
          category_id: item.categoryId,
          topic_id: item.topicId,
          title: item.title,
          category_title: item.categoryTitle,
          progress_percentage: item.progressPercentage || 0,
        })
        .select()
        .single();
      return { data, error };
    }
  },

  // Clear reading history for a user
  clearReadingHistory: async (userId) => {
    const { data, error } = await supabase
      .from("reading_history")
      .delete()
      .eq("user_id", userId);
    return { data, error };
  },

  // User Progress
  getUserProgress: async (userId, categoryId, topicId) => {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .eq("topic_id", topicId)
      .single();
    return { data, error };
  },

  getAllUserProgress: async (userId) => {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true);
    return { data, error };
  },

  getAllUserProgressWithQuizzes: async (userId) => {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    return { data, error };
  },

  getCategoryProgress: async (userId, categoryId) => {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .eq("completed", true);
    return { data, error };
  },

  updateProgress: async (userId, progress) => {
    const { data: existing } = await supabase
      .from("user_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("category_id", progress.categoryId)
      .eq("topic_id", progress.topicId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("user_progress")
        .update({
          quiz_score: progress.quizScore,
          completed: progress.completed,
          completed_at: progress.completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from("user_progress")
        .insert({
          user_id: userId,
          category_id: progress.categoryId,
          topic_id: progress.topicId,
          quiz_score: progress.quizScore,
          completed: progress.completed,
          completed_at: progress.completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      return { data, error };
    }
  },

  // Admin functions
  isAdmin: async (userId) => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Admin check timeout")), 5000);
      });

      const checkPromise = supabase
        .from("user_profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();

      const { data, error } = await Promise.race([
        checkPromise,
        timeoutPromise,
      ]);

      if (error) {
        // If user profile doesn't exist, return false (don't try to create it here)
        if (error.code === "PGRST116") {
          return { isAdmin: false, error: null };
        }
        console.error("Error checking admin status:", error);
        return { isAdmin: false, error };
      }

      return { isAdmin: data?.is_admin === true, error: null };
    } catch (err) {
      // Handle timeout or other errors
      if (err.message === "Admin check timeout") {
      } else {
        console.error("Exception checking admin status:", err);
      }
      return { isAdmin: false, error: err };
    }
  },

  // Admin: Get all users with profiles
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // Admin: Get user by ID
  getUserById: async (userId) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  // Get current user's profile (non-admin version)
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  // Admin: Update user admin status
  updateUserAdminStatus: async (userId, isAdmin) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ is_admin: isAdmin })
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  // Admin: Update user profile
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  // Admin: Delete user (cascade will handle related data)
  deleteUser: async (userId) => {
    // Note: This requires service role key or RLS policy allowing admin deletion
    // For now, we'll use auth.admin.deleteUser if available
    const { data, error } = await supabase.auth.admin.deleteUser(userId);
    return { data, error };
  },

  // Admin: Get analytics/stats
  getAnalytics: async () => {
    try {
      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      // Get admin count
      const { count: adminCount, error: adminError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_admin", true);

      // Get bookmark count
      const { count: bookmarkCount, error: bookmarkError } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact", head: true });

      // Get reading history count
      const { count: historyCount, error: historyError } = await supabase
        .from("reading_history")
        .select("*", { count: "exact", head: true });

      // Get progress count
      const { count: progressCount, error: progressError } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true });

      // Get completed topics count
      const { count: completedCount, error: completedError } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true })
        .eq("completed", true);

      // Get recent users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: recentUsersCount, error: recentUsersError } =
        await supabase
          .from("user_profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString());

      return {
        data: {
          totalUsers: userCount || 0,
          totalAdmins: adminCount || 0,
          totalBookmarks: bookmarkCount || 0,
          totalHistory: historyCount || 0,
          totalProgress: progressCount || 0,
          completedTopics: completedCount || 0,
          recentUsers: recentUsersCount || 0,
        },
        error:
          userError ||
          adminError ||
          bookmarkError ||
          historyError ||
          progressError ||
          completedError ||
          recentUsersError,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Admin: Get detailed analytics
  getDetailedAnalytics: async (days = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateISO = startDate.toISOString();

      // Active users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: activeUsersCount } = await supabase
        .from("reading_history")
        .select("*", { count: "exact", head: true })
        .gte("last_read_at", sevenDaysAgo.toISOString());

      // New users (last 7 days)
      const { count: newUsersCount } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      // Total quiz attempts
      const { count: quizAttemptsCount } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true })
        .not("quiz_score", "is", null);

      // Quiz pass rate (score >= 80)
      const { count: passedQuizzesCount } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true })
        .not("quiz_score", "is", null)
        .gte("quiz_score", 80);

      // Daily active users (last 30 days)
      const dailyActiveUsers = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const { count } = await supabase
          .from("reading_history")
          .select("*", { count: "exact", head: true })
          .gte("last_read_at", date.toISOString())
          .lt("last_read_at", nextDate.toISOString());

        dailyActiveUsers.push({
          date: date.toISOString().split("T")[0],
          count: count || 0,
        });
      }

      // Topic views & completions by category
      const { data: readingHistory } = await supabase
        .from("reading_history")
        .select("category_id, category_title")
        .gte("last_read_at", startDateISO);

      const { data: completions } = await supabase
        .from("user_progress")
        .select("category_id, completed")
        .eq("completed", true)
        .gte("updated_at", startDateISO);

      const categoryStats = {};
      (readingHistory || []).forEach((item) => {
        if (!categoryStats[item.category_id]) {
          categoryStats[item.category_id] = {
            category_id: item.category_id,
            category_title: item.category_title,
            views: 0,
            completions: 0,
          };
        }
        categoryStats[item.category_id].views++;
      });

      (completions || []).forEach((item) => {
        if (categoryStats[item.category_id]) {
          categoryStats[item.category_id].completions++;
        }
      });

      // Time-of-day activity (last 7 days)
      const { data: recentActivity } = await supabase
        .from("reading_history")
        .select("last_read_at")
        .gte("last_read_at", sevenDaysAgo.toISOString());

      const hourlyActivity = Array(24).fill(0);
      (recentActivity || []).forEach((item) => {
        const hour = new Date(item.last_read_at).getHours();
        hourlyActivity[hour]++;
      });

      // Top 5 most viewed topics
      const { data: topicViews } = await supabase
        .from("reading_history")
        .select("category_id, topic_id, title")
        .gte("last_read_at", startDateISO);

      const topicViewCounts = {};
      (topicViews || []).forEach((item) => {
        const key = `${item.category_id}-${item.topic_id}`;
        if (!topicViewCounts[key]) {
          topicViewCounts[key] = {
            category_id: item.category_id,
            topic_id: item.topic_id,
            title: item.title,
            views: 0,
          };
        }
        topicViewCounts[key].views++;
      });

      const topViewedTopics = Object.values(topicViewCounts)
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Quiz performance by topic
      const { data: quizData } = await supabase
        .from("user_progress")
        .select("category_id, topic_id, quiz_score, updated_at")
        .not("quiz_score", "is", null)
        .gte("updated_at", startDateISO);

      const topicQuizStats = {};
      (quizData || []).forEach((item) => {
        const key = `${item.category_id}-${item.topic_id}`;
        if (!topicQuizStats[key]) {
          topicQuizStats[key] = {
            category_id: item.category_id,
            topic_id: item.topic_id,
            attempts: 0,
            totalScore: 0,
            passed: 0,
            lastAttempt: null,
          };
        }
        topicQuizStats[key].attempts++;
        topicQuizStats[key].totalScore += item.quiz_score;
        if (item.quiz_score >= 80) {
          topicQuizStats[key].passed++;
        }
        if (!topicQuizStats[key].lastAttempt || new Date(item.updated_at) > new Date(topicQuizStats[key].lastAttempt)) {
          topicQuizStats[key].lastAttempt = item.updated_at;
        }
      });

      const quizPerformanceByTopic = Object.values(topicQuizStats).map((stat) => ({
        ...stat,
        avgScore: Math.round(stat.totalScore / stat.attempts),
        passRate: Math.round((stat.passed / stat.attempts) * 100),
      })).sort((a, b) => b.attempts - a.attempts);

      // Score distribution
      const scoreDistribution = {
        "0-39": 0,
        "40-59": 0,
        "60-79": 0,
        "80-89": 0,
        "90-100": 0,
      };

      (quizData || []).forEach((item) => {
        const score = item.quiz_score;
        if (score < 40) scoreDistribution["0-39"]++;
        else if (score < 60) scoreDistribution["40-59"]++;
        else if (score < 80) scoreDistribution["60-79"]++;
        else if (score < 90) scoreDistribution["80-89"]++;
        else scoreDistribution["90-100"]++;
      });

      // Completion funnel
      const { count: usersWithReading } = await supabase
        .from("reading_history")
        .select("user_id", { count: "exact", head: true });

      const { count: usersWithQuizAttempts } = await supabase
        .from("user_progress")
        .select("user_id", { count: "exact", head: true })
        .not("quiz_score", "is", null);

      const { count: usersWithPassedQuiz } = await supabase
        .from("user_progress")
        .select("user_id", { count: "exact", head: true })
        .not("quiz_score", "is", null)
        .gte("quiz_score", 80);

      // Most completed topics
      const { data: completedTopicsData } = await supabase
        .from("user_progress")
        .select("category_id, topic_id, completed")
        .eq("completed", true)
        .gte("updated_at", startDateISO);

      const topicCompletionCounts = {};
      (completedTopicsData || []).forEach((item) => {
        const key = `${item.category_id}-${item.topic_id}`;
        if (!topicCompletionCounts[key]) {
          topicCompletionCounts[key] = {
            category_id: item.category_id,
            topic_id: item.topic_id,
            completions: 0,
            views: 0,
          };
        }
        topicCompletionCounts[key].completions++;
      });

      // Get views for completed topics
      Object.keys(topicCompletionCounts).forEach((key) => {
        const [categoryId, topicId] = key.split("-");
        const views = (readingHistory || []).filter(
          (item) => item.category_id === categoryId && item.topic_id === topicId
        ).length;
        topicCompletionCounts[key].views = views;
      });

      const mostCompletedTopics = Object.values(topicCompletionCounts)
        .map((item) => ({
          ...item,
          completionRate: item.views > 0 ? Math.round((item.completions / item.views) * 100) : 0,
        }))
        .sort((a, b) => b.completions - a.completions)
        .slice(0, 5);

      return {
        data: {
          activeUsers: activeUsersCount || 0,
          newUsers: newUsersCount || 0,
          quizAttempts: quizAttemptsCount || 0,
          quizPassRate: quizAttemptsCount > 0 ? Math.round((passedQuizzesCount / quizAttemptsCount) * 100) : 0,
          dailyActiveUsers,
          categoryStats: Object.values(categoryStats),
          hourlyActivity,
          topViewedTopics,
          quizPerformanceByTopic,
          scoreDistribution,
          completionFunnel: {
            usersWithReading: usersWithReading || 0,
            usersWithQuizAttempts: usersWithQuizAttempts || 0,
            usersWithPassedQuiz: usersWithPassedQuiz || 0,
          },
          mostCompletedTopics,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Admin: Get activity logs (recent bookmarks, reading history, progress)
  getActivityLogs: async (limit = 50) => {
    try {
      // Get recent bookmarks
      const { data: recentBookmarks, error: bookmarksError } = await supabase
        .from("bookmarks")
        .select("*, user_profiles(email, full_name)")
        .order("created_at", { ascending: false })
        .limit(limit);

      // Get recent reading history
      const { data: recentHistory, error: historyError } = await supabase
        .from("reading_history")
        .select("*, user_profiles(email, full_name)")
        .order("last_read_at", { ascending: false })
        .limit(limit);

      // Get recent progress updates
      const { data: recentProgress, error: progressError } = await supabase
        .from("user_progress")
        .select("*, user_profiles(email, full_name)")
        .order("updated_at", { ascending: false })
        .limit(limit);

      // Combine and sort by date
      const activities = [
        ...(recentBookmarks || []).map((item) => ({
          type: "bookmark",
          id: item.id,
          user: item.user_profiles,
          title: item.title,
          category: item.category_title,
          timestamp: item.created_at,
        })),
        ...(recentHistory || []).map((item) => ({
          type: "reading",
          id: item.id,
          user: item.user_profiles,
          title: item.title,
          category: item.category_title,
          progress: item.progress_percentage,
          timestamp: item.last_read_at,
        })),
        ...(recentProgress || []).map((item) => ({
          type: "progress",
          id: item.id,
          user: item.user_profiles,
          category: item.category_id,
          topic: item.topic_id,
          completed: item.completed,
          score: item.quiz_score,
          timestamp: item.updated_at,
        })),
      ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      return {
        data: activities,
        error: bookmarksError || historyError || progressError,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Admin: Get user statistics
  getUserStats: async (userId) => {
    try {
      const [bookmarks, history, progress] = await Promise.all([
        supabase
          .from("bookmarks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("reading_history")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase.from("user_progress").select("*").eq("user_id", userId),
      ]);

      const completedCount =
        progress.data?.filter((p) => p.completed).length || 0;
      const avgScore =
        progress.data?.length > 0
          ? Math.round(
              progress.data.reduce((sum, p) => sum + (p.quiz_score || 0), 0) /
                progress.data.length
            )
          : 0;

      return {
        data: {
          bookmarks: bookmarks.count || 0,
          readingHistory: history.count || 0,
          totalProgress: progress.data?.length || 0,
          completedTopics: completedCount,
          averageScore: avgScore,
        },
        error: bookmarks.error || history.error || progress.error,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Topics Management (Admin Content Management)
  getAllTopics: async () => {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("updated_at", { ascending: false });
    return { data, error };
  },

  getTopic: async (categoryId, topicId) => {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("category_id", categoryId)
      .eq("topic_id", topicId)
      .single();
    return { data, error };
  },

  getTopicsByCategory: async (categoryId) => {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: true });
    return { data, error };
  },

  createTopic: async (topicData) => {
    const { data, error } = await supabase
      .from("topics")
      .insert({
        category_id: topicData.categoryId,
        topic_id: topicData.topicId || `topic-${Date.now()}`,
        title: topicData.title,
        description: topicData.description,
        difficulty: topicData.difficulty || "Beginner",
        section: topicData.section || null,
        section_description: topicData.section_description || null,
        read_time: topicData.readTime,
        tags: topicData.tags || [],
        video: topicData.video || null,
        content: topicData.content || {},
        is_custom:
          topicData.is_custom !== undefined ? topicData.is_custom : true,
      })
      .select()
      .single();
    return { data, error };
  },

  updateTopic: async (topicId, topicData) => {
    const { data, error } = await supabase
      .from("topics")
      .update({
        title: topicData.title,
        description: topicData.description,
        difficulty: topicData.difficulty,
        section: topicData.section !== undefined ? topicData.section : undefined,
        section_description: topicData.section_description !== undefined ? topicData.section_description : undefined,
        read_time: topicData.readTime,
        tags: topicData.tags || [],
        video: topicData.video !== undefined ? topicData.video : undefined,
        content: topicData.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", topicId)
      .select()
      .maybeSingle();
    return { data, error };
  },

  updateTopicByCategoryAndTopicId: async (
    categoryId,
    originalTopicId,
    topicData
  ) => {
    try {
      // Build update object with only provided fields
      const updateObj = {};

      if (topicData.title !== undefined) updateObj.title = topicData.title;
      if (topicData.description !== undefined) updateObj.description = topicData.description;
      if (topicData.difficulty !== undefined) updateObj.difficulty = topicData.difficulty;
      if (topicData.section !== undefined) updateObj.section = topicData.section;
      if (topicData.section_description !== undefined) updateObj.section_description = topicData.section_description;
      if (topicData.readTime !== undefined) updateObj.read_time = topicData.readTime;
      if (topicData.tags !== undefined) updateObj.tags = topicData.tags;
      if (topicData.video !== undefined) updateObj.video = topicData.video;
      if (topicData.content !== undefined) updateObj.content = topicData.content;
      
      // Don't manually set updated_at - let the trigger handle it
      
      // Only update if there are fields to update
      if (Object.keys(updateObj).length === 0) {
        return { data: null, error: { message: "No fields to update" } };
      }
      
      const { data, error } = await supabase
        .from("topics")
        .update(updateObj)
        .eq("category_id", categoryId)
        .eq("topic_id", originalTopicId)
        .select();
        
      if (error) {
        return { data: null, error };
      }
      
      // Return first result if available
      return { data: data && data.length > 0 ? data[0] : null, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  deleteTopic: async (topicId) => {
    const { data, error } = await supabase
      .from("topics")
      .delete()
      .eq("id", topicId);
    return { data, error };
  },

  deleteTopicByCategoryAndTopicId: async (categoryId, originalTopicId) => {
    const { data, error } = await supabase
      .from("topics")
      .delete()
      .eq("category_id", categoryId)
      .eq("topic_id", originalTopicId);
    return { data, error };
  },

  // ========== SECTIONS ==========
  getAllSections: async () => {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("display_order", { ascending: true });
    return { data, error };
  },

  getSection: async (sectionId) => {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .eq("section_id", sectionId)
      .single();
    return { data, error };
  },

  createSection: async (sectionData) => {
    const { data, error } = await supabase
      .from("sections")
      .insert(sectionData)
      .select()
      .single();
    return { data, error };
  },

  updateSection: async (id, sectionData) => {
    const { data, error } = await supabase
      .from("sections")
      .update(sectionData)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  deleteSection: async (id) => {
    const { data, error } = await supabase
      .from("sections")
      .delete()
      .eq("id", id);
    return { data, error };
  },

  // ========== CATEGORIES ==========
  getAllCategories: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    return { data, error };
  },

  getCategoriesBySection: async (sectionId) => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("section_id", sectionId)
      .order("display_order", { ascending: true });
    return { data, error };
  },

  getCategory: async (categoryId) => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("category_id", categoryId)
      .single();
    return { data, error };
  },

  createCategory: async (categoryData) => {
    const { data, error } = await supabase
      .from("categories")
      .insert(categoryData)
      .select()
      .single();
    return { data, error };
  },

  updateCategory: async (id, categoryData) => {
    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  updateCategoryByCategoryId: async (categoryId, categoryData) => {
    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("category_id", categoryId)
      .select()
      .single();
    return { data, error };
  },

  deleteCategory: async (id) => {
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    return { data, error };
  },

  deleteCategoryByCategoryId: async (categoryId) => {
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("category_id", categoryId);
    return { data, error };
  },

  // Notifications
  getNotifications: async (userId, limit = 50) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error("Error fetching notifications:", error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error in getNotifications:", error);
      return { data: null, error };
    }
  },

  getUnreadCount: async (userId) => {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      
      if (error) {
        console.error("Error fetching unread count:", error);
        return { count: 0, error };
      }
      
      return { count: count || 0, error: null };
    } catch (error) {
      console.error("Unexpected error in getUnreadCount:", error);
      return { count: 0, error };
    }
  },

  markNotificationAsRead: async (notificationId, userId) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId)
      .select()
      .single();
    return { data, error };
  },

  markAllNotificationsAsRead: async (userId) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false)
      .select();
    return { data, error };
  },

  createNotification: async (notificationData) => {
    try {
      
      const insertData = {
        user_id: notificationData.userId,
        title: notificationData.title,
        body: notificationData.body,
        created_by: notificationData.createdBy || null,
      };
      
      
      const { data, error } = await supabase
        .from("notifications")
        .insert(insertData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating notification:", error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error in createNotification:", error);
      return { data: null, error };
    }
  },

  createNotificationForAllUsers: async (title, body, createdBy) => {
    try {
      // Get all user IDs from user_profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("id");
      
      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
        return { data: null, error: profilesError };
      }

      if (!profiles || profiles.length === 0) {
        return { data: [], error: null };
      }

      // Exclude the admin who is sending the notification
      const recipientIds = profiles
        .map((profile) => profile.id)
        .filter((id) => id !== createdBy);


      // Create notifications for all users except the admin
      const notifications = recipientIds.map((userId) => ({
        user_id: userId,
        title,
        body,
        created_by: createdBy,
      }));

      // Insert in batches to avoid payload size limits
      const batchSize = 100;
      const results = [];
      const errors = [];
      
      // Get current user ID for verification
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        
        const { data, error } = await supabase
          .from("notifications")
          .insert(batch)
          .select();
        
        if (error) {
          console.error(`Error inserting batch ${batchNum}:`, error);
          console.error("Error details:", JSON.stringify(error, null, 2));
          errors.push({ batch: batchNum, error });
          // Continue with other batches instead of failing completely
        } else {
          results.push(...(data || []));
        }
      }

      if (errors.length > 0) {
        console.error("Some batches failed:", errors);
        return { 
          data: results, 
          error: { 
            message: `${errors.length} batch(es) failed`, 
            details: errors,
            partial: true 
          } 
        };
      }

      return { data: results, error: null };
    } catch (error) {
      console.error("Unexpected error in createNotificationForAllUsers:", error);
      return { data: null, error };
    }
  },

  // Search History
  getRecentSearches: async (userId, limit = 3) => {
    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return { data, error };
  },

  saveSearchHistory: async (userId, query) => {
    // Use upsert to handle unique constraint
    const { data, error } = await supabase
      .from("search_history")
      .upsert({
        user_id: userId,
        query: query.trim(),
        created_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,query",
        ignoreDuplicates: false,
      })
      .select()
      .single();
    return { data, error };
  },

  clearSearchHistory: async (userId) => {
    const { data, error } = await supabase
      .from("search_history")
      .delete()
      .eq("user_id", userId);
    return { data, error };
  },

  // Bookmark Tags
  getBookmarkTags: async (userId, categoryId, topicId) => {
    const { data, error } = await supabase
      .from("bookmark_tags")
      .select("*")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .eq("topic_id", topicId);
    return { data, error };
  },

  addBookmarkTag: async (userId, categoryId, topicId, tag) => {
    const { data, error } = await supabase
      .from("bookmark_tags")
      .insert({
        user_id: userId,
        category_id: categoryId,
        topic_id: topicId,
        tag: tag.trim(),
      })
      .select()
      .single();
    return { data, error };
  },

  removeBookmarkTag: async (userId, categoryId, topicId, tag) => {
    const { data, error } = await supabase
      .from("bookmark_tags")
      .delete()
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .eq("topic_id", topicId)
      .eq("tag", tag);
    return { data, error };
  },

  getAllBookmarkTags: async (userId) => {
    const { data, error } = await supabase
      .from("bookmark_tags")
      .select("tag")
      .eq("user_id", userId)
      .order("tag", { ascending: true });
    
    // Get unique tags
    const uniqueTags = [...new Set((data || []).map(item => item.tag))];
    return { data: uniqueTags, error };
  },

  // Weekly Reports Management
  getAllWeeklyReports: async () => {
    const { data, error } = await supabase
      .from("weekly_reports")
      .select("*")
      .order("week_start_date", { ascending: false });
    return { data, error };
  },

  getWeeklyReport: async (reportId) => {
    const { data, error } = await supabase
      .from("weekly_reports")
      .select("*")
      .eq("id", reportId)
      .single();
    return { data, error };
  },

  getWeeklyReportByDate: async (weekStartDate) => {
    const { data, error } = await supabase
      .from("weekly_reports")
      .select("*")
      .eq("week_start_date", weekStartDate)
      .single();
    return { data, error };
  },

  createWeeklyReport: async (reportData) => {
    const { data, error } = await supabase
      .from("weekly_reports")
      .insert({
        week_start_date: reportData.week_start_date,
        week_end_date: reportData.week_end_date,
        week_number: reportData.week_number || null,
        title: reportData.title,
        summary: reportData.summary,
        tags: reportData.tags || [],
        content: reportData.content || null,
        published: reportData.published !== undefined ? reportData.published : true,
      })
      .select()
      .single();
    return { data, error };
  },

  updateWeeklyReport: async (reportId, reportData) => {
    const updateObj = {
      updated_at: new Date().toISOString(),
    };
    
    if (reportData.week_start_date !== undefined) updateObj.week_start_date = reportData.week_start_date;
    if (reportData.week_end_date !== undefined) updateObj.week_end_date = reportData.week_end_date;
    if (reportData.week_number !== undefined) updateObj.week_number = reportData.week_number;
    if (reportData.title !== undefined) updateObj.title = reportData.title;
    if (reportData.summary !== undefined) updateObj.summary = reportData.summary;
    if (reportData.tags !== undefined) updateObj.tags = reportData.tags;
    if (reportData.content !== undefined) updateObj.content = reportData.content;
    if (reportData.published !== undefined) updateObj.published = reportData.published;
    
    const { data, error } = await supabase
      .from("weekly_reports")
      .update(updateObj)
      .eq("id", reportId)
      .select()
      .single();
    return { data, error };
  },

  deleteWeeklyReport: async (reportId) => {
    const { data, error } = await supabase
      .from("weekly_reports")
      .delete()
      .eq("id", reportId);
    return { data, error };
  },

  // ========== FEATURED MODELS MANAGEMENT ==========

  // Get all featured models (for display on ModelsDirectoryPage)
  getFeaturedModels: async () => {
    const { data, error } = await supabase
      .from('models_catalog')
      .select('*')
      .eq('is_featured', true)
      .order('featured_at', { ascending: false });
    return { data, error };
  },

  // Admin: Get all models with featured status (for management)
  getAllModelsForFeaturing: async () => {
    const { data, error } = await supabase
      .from('models_catalog')
      .select('id, canonical_model_id, name, publisher, category, tier, is_featured, featured_until, featured_at, featured_by, downloads, likes, access_type')
      .order('name', { ascending: true })
      .range(0, 9999); // Get up to 10,000 models (Supabase default is 1000)
    return { data, error };
  },

  // Admin: Feature a model
  featureModel: async (modelId, featuredUntil = null) => {
    const { data, error } = await supabase.rpc('feature_model', {
      p_model_id: modelId,
      p_featured_until: featuredUntil
    });
    return { data, error };
  },

  // Admin: Unfeature a model
  unfeatureModel: async (modelId) => {
    const { data, error } = await supabase.rpc('unfeature_model', {
      p_model_id: modelId
    });
    return { data, error };
  },

  // Admin: Get featured models history
  getFeaturedModelsHistory: async (limit = 100) => {
    const { data, error } = await supabase
      .from('featured_models_history')
      .select('*')
      .order('featured_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Admin: Get history for specific model
  getModelFeaturedHistory: async (modelId) => {
    const { data, error } = await supabase
      .from('featured_models_history')
      .select('*')
      .eq('model_id', modelId)
      .order('featured_at', { ascending: false });
    return { data, error };
  },

  // Admin: Get expired featured models (for warnings)
  getExpiredFeaturedModels: async () => {
    const { data, error } = await supabase
      .from('models_catalog')
      .select('id, name, publisher, featured_until, featured_at')
      .eq('is_featured', true)
      .not('featured_until', 'is', null)
      .lt('featured_until', new Date().toISOString());
    return { data, error };
  },

  saveContactSubmission: async ({ name, email, subject, message }) => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({ name, email, subject, message })
      .select()
      .single();
    return { data, error };
  },
};

// Storage helpers for file uploads
export const storageHelpers = {
  // Upload avatar image
  uploadAvatar: async (userId, file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { data: null, error };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return { data: { url: publicUrl, path: filePath }, error: null };
  },

  // Delete avatar image
  deleteAvatar: async (filePath) => {
    // Extract path from URL or use path directly
    const path = filePath.includes("/avatars/")
      ? filePath.split("/avatars/")[1]
      : filePath;

    const { error } = await supabase.storage
      .from("avatars")
      .remove([`avatars/${path}`]);

    return { error };
  },
};
