import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { loadAllCategories } from "../utils/dataLoader";
import { dbHelpers } from "../lib/supabase";

/**
 * Custom hook to manage all admin dashboard data fetching
 * Consolidates multiple React Query hooks for better organization
 */
export const useAdminData = (activeTab = "analytics", analyticsTimeframe = 30) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useApp();
  const queryClient = useQueryClient();

  // Check if we should fetch data
  const shouldFetch = !!user && isAdmin;

  // Fetch analytics
  const {
    data: analyticsData,
    isLoading: loadingAnalytics,
  } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getAnalytics();
      if (error) {
        console.error("Error fetching analytics:", error);
        showToast("Unable to load analytics data. Please refresh the page or try again later.", "error", 3000, "Loading Error");
        throw error;
      }
      return data;
    },
    enabled: shouldFetch,
  });

  // Fetch detailed analytics (only when Analytics tab is active)
  const {
    data: detailedAnalyticsData,
    isLoading: loadingDetailedAnalytics,
  } = useQuery({
    queryKey: ["admin-detailed-analytics", analyticsTimeframe],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getDetailedAnalytics(analyticsTimeframe);
      if (error) {
        console.error("Error fetching detailed analytics:", error);
        showToast("Unable to load detailed analytics. Please refresh the page or try again later.", "error", 3000, "Loading Error");
        throw error;
      }
      return data;
    },
    enabled: shouldFetch && activeTab === "analytics",
  });

  // Fetch all users
  const {
    data: usersData,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getAllUsers();
      if (error) {
        console.error("Error fetching users:", error);
        showToast("Unable to load user list. Please refresh the page or try again later.", "error", 3000, "Loading Error");
        throw error;
      }
      return data || [];
    },
    enabled: shouldFetch,
  });

  // Load categories
  const {
    data: categoriesData,
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: loadAllCategories,
    enabled: shouldFetch,
  });

  const categories = categoriesData || [];

  // Fetch topics (depends on categories)
  const {
    data: topicsData,
    isLoading: loadingTopics,
  } = useQuery({
    queryKey: ["admin-topics", categories?.length],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getAllTopics();
      if (error) {
        console.error("Error fetching topics:", error);
        showToast("Unable to load topics from database.", "warning");
        throw error;
      }
      
      // Create category map for lookups
      const categoryMap = new Map();
      if (categories && categories.length > 0) {
        categories.forEach((cat) => {
          categoryMap.set(cat.category_id, cat);
        });
      }
      
      // Transform database format to match static topic format
      return (data || []).map((dbTopic) => ({
        id: dbTopic.id,
        topic_id: dbTopic.topic_id,
        categoryId: dbTopic.category_id,
        categoryTitle: categoryMap.get(dbTopic.category_id)?.title || "",
        title: dbTopic.title,
        description: dbTopic.description,
        difficulty: dbTopic.difficulty,
        readTime: dbTopic.read_time,
        tags: dbTopic.tags || [],
        content: dbTopic.content || {},
        is_custom: dbTopic.is_custom,
        created_at: dbTopic.created_at,
        updated_at: dbTopic.updated_at,
      }));
    },
    enabled: shouldFetch && categories.length >= 0,
  });

  // Fetch activity logs
  const {
    data: activityLogsData,
  } = useQuery({
    queryKey: ["admin-activity-logs"],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getActivityLogs(30);
      if (error) {
        console.error("Error fetching activity logs:", error);
        return [];
      }
      return data || [];
    },
    enabled: shouldFetch,
  });

  // Memoized computed values
  const analytics = useMemo(() => analyticsData || null, [analyticsData]);
  const allUsers = useMemo(() => usersData || [], [usersData]);
  const databaseTopics = useMemo(() => topicsData || [], [topicsData]);
  const activityLogs = useMemo(() => activityLogsData || [], [activityLogsData]);

  // Calculate static stats
  const staticStats = useMemo(() => {
    return {
      totalCategories: categories.length,
      totalTopics: databaseTopics.length,
    };
  }, [categories.length, databaseTopics.length]);

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] }),
    ]);
  };

  // Loading state
  const isLoadingAny = useMemo(() => {
    if (!user || !isAdmin) return false;
    return loadingTopics || (analyticsData === undefined && usersData === undefined);
  }, [user, isAdmin, loadingTopics, analyticsData, usersData]);

  return {
    analytics,
    detailedAnalyticsData,
    loadingAnalytics,
    loadingDetailedAnalytics,
    allUsers,
    categories,
    databaseTopics,
    loadingTopics,
    activityLogs,
    staticStats,
    refreshData,
    isLoadingAny,
  };
};

