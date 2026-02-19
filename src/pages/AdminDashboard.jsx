import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  BookOpen,
  Users,
  BarChart3,
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  TrendingUp,
  Clock,
  Shield,
  Activity,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Tag,
  Bookmark,
  Star,
  UserPlus,
  UserMinus,
  Mail,
  Globe,
  Database,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Info,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { dbHelpers } from "../lib/supabase";
import { importStaticTopics } from "../utils/importStaticTopics";
import { importStaticData } from "../utils/importStaticData";
import { AdminDashboardSkeleton, ListItemSkeleton } from "../components/LoadingSkeleton";
import { EmptyUsers, EmptySearch } from "../components/EmptyState";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Tooltip from "../components/Tooltip";
import Button from "../components/Button";
import Card, { MetricCard } from "../components/Card";
import VirtualList from "../components/VirtualList";
import { Badge } from "../components/ui/badge";
import { Card as UICard } from "../components/ui/card";
import { Button as UIButton } from "../components/ui/button";
import { AnalyticsLineChart, AnalyticsBarChart, AnalyticsAreaChart, AnalyticsPieChart } from "../components/charts/RechartsWrapper";
import Hero from "../components/Hero";
import StatCard from "../components/admin/StatCard";
import { formatRelativeTime } from "../utils/formatting";
import AdminLayout from "../components/admin/AdminLayout";
import AnalyticsPage from "../components/admin/AnalyticsPage";
import UsersPage from "../components/admin/users/users-page";
import ContentPage from "../components/admin/content/content-page";
import NotificationsPage from "../components/admin/notifications/notifications-page";
import ActivityPage from "../components/admin/activity/activity-page";
import SettingsPage from "../components/admin/settings/settings-page";
import FeaturedModelsPage from "../components/admin/featured-models/featured-models-page";
import UserDetailsModal from "../components/admin/UserDetailsModal";
import { useAdminData } from "../hooks/useAdminData";
// Lazy load heavy admin components - TopicModal is large and only needed when editing topics
// This reduces initial bundle size for non-admin users and improves load time
const TopicModal = lazy(() => import("../components/admin/TopicModal"));

// Reusable Page Section Header Component
const PageSectionHeader = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {description}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

PageSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

const AdminDashboard = () => {
  const { t } = useTranslation("admin");
  const { user, isAdmin } = useAuth();
  const { showToast } = useApp();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("analytics");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states (some are now managed by React Query, kept for compatibility)
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userFilter, setUserFilter] = useState("all"); // all, admin, regular
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCategoryForTopic, setSelectedCategoryForTopic] = useState(null);
  const [showDeleteTopicConfirm, setShowDeleteTopicConfirm] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [importingTopics, setImportingTopics] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, currentTopic: "" });
  const [importingData, setImportingData] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState(30); // days

  // Use custom hook for all admin data fetching
  const {
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
    refreshData: refreshAdminData,
    isLoadingAny: isLoadingAnyData,
  } = useAdminData(activeTab, analyticsTimeframe);

  // Fetch user stats
  const fetchUserStats = async (userId) => {
    try {
      const { data, error } = await dbHelpers.getUserStats(userId);
      if (error) {
        console.error("Error fetching user stats:", error);
      } else {
        setUserStats(data);
      }
    } catch (err) {
      console.error("Error fetching user stats:", err);
    }
  };

  // Refresh all data using custom hook + UI feedback
  const refreshData = async () => {
    setRefreshing(true);
    await refreshAdminData();
    setRefreshing(false);
    showToast("All data has been refreshed successfully.", "success", 2000, "Refreshed");
  };

  // Update loading state when derived value changes
  useEffect(() => {
    setLoading(isLoadingAnyData);
  }, [isLoadingAnyData]);

  // Handle user admin status toggle
  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      const { error } = await dbHelpers.updateUserAdminStatus(userId, !currentStatus);
      if (error) {
        showToast("Unable to update user status. Please check your permissions and try again.", "error", 3000, "Update Failed");
      } else {
        showToast(
          `User ${!currentStatus ? "promoted to" : "removed from"} admin successfully.`,
          "success",
          2500,
          "Status Updated"
        );
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        await queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      }
    } catch {
      showToast("Error updating user", "error");
    }
  };

  // Handle user deletion
  const handleAddTopic = () => {
    setSelectedTopic(null);
    setSelectedCategoryForTopic(null);
    setShowTopicModal(true);
  };

  const handleEditTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedCategoryForTopic(topic.categoryId);
    setShowTopicModal(true);
  };

  const handleDeleteTopic = (topic) => {
    setTopicToDelete(topic);
    setShowDeleteTopicConfirm(true);
  };

  const confirmDeleteTopic = async () => {
    if (!topicToDelete) return;

    try {
      let result;
      if (topicToDelete.id && topicToDelete.is_custom) {
        // Delete from database using UUID
        result = await dbHelpers.deleteTopic(topicToDelete.id);
      } else if (topicToDelete.categoryId && topicToDelete.topic_id) {
        // Delete by category and topic_id
        result = await dbHelpers.deleteTopicByCategoryAndTopicId(
          topicToDelete.categoryId,
          topicToDelete.topic_id
        );
      } else {
        showToast("Cannot delete topic: missing identifier", "error");
        return;
      }

      if (result.error) {
        console.error("Error deleting topic:", result.error);
        showToast(
          result.error.message || "Failed to delete topic. Please try again.",
          "error"
        );
        return;
      }

      showToast("Topic deleted successfully! ✓", "success");
      setShowDeleteTopicConfirm(false);
      setTopicToDelete(null);

      // Refresh topics list
      await queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
    } catch (error) {
      console.error("Error deleting topic:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
    }
  };

  const handleSaveTopic = async () => {
    // TopicModal already shows success toast, just refresh the list
    await queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
  };

  const handleImportStaticData = async () => {
    if (importingData) return;

    const confirmed = window.confirm(
      "This will import all sections and categories from your code files into the database. " +
      "Items that already exist will be skipped. This must be done before importing topics. Continue?"
    );

    if (!confirmed) return;

    setImportingData(true);

    try {
      await importStaticData(
        (processed, total, item) => {
          // Progress callback
        },
        async (importResults) => {
          // Completion callback
          setImportingData(false);

          const totalSuccess = importResults.sections.success + importResults.categories.success;
          const totalErrors = importResults.sections.errors + importResults.categories.errors;

          if (totalErrors === 0) {
            showToast(
              `Successfully imported ${importResults.sections.success} section(s) and ${importResults.categories.success} category/categories! ✓`,
              "success",
              5000
            );
          } else {
            showToast(
              `Imported ${totalSuccess} item(s) with ${totalErrors} error(s). Check console for details.`,
              "warning",
              5000
            );
          }

          // Refresh categories and topics
          await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
          await queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
        }
      );
    } catch (error) {
      console.error("Import failed:", error);
      showToast("Failed to import sections and categories. Please check console for details.", "error", 5000);
      setImportingData(false);
    }
  };

  const handleImportStaticTopics = async () => {
    if (importingTopics) return;

    const confirmed = window.confirm(
      "This will import all static topics from your code files into the database. " +
      "Topics that already exist will be skipped. Continue?"
    );

    if (!confirmed) return;

    setImportingTopics(true);
    setImportProgress({ current: 0, total: 0, currentTopic: "" });

    try {
      await importStaticTopics(
        (current, total, topicTitle) => {
          setImportProgress({ current, total, currentTopic: topicTitle });
        },
        async (successCount, updatedCount, errorCount) => {
          setImportingTopics(false);
          setImportProgress({ current: 0, total: 0, currentTopic: "" });

          if (errorCount === 0) {
            showToast(
              `Successfully imported ${successCount} new and updated ${updatedCount} topic(s)! ✓`,
              "success",
              4000
            );
          } else {
            showToast(
              `Processed ${successCount + updatedCount} topic(s) with ${errorCount} error(s). Check console for details.`,
              "warning",
              5000
            );
          }

          // Refresh topics list
          await queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
        }
      );
    } catch (error) {
      console.error("Import failed:", error);
      showToast("Failed to import topics. Please try again.", "error");
      setImportingTopics(false);
      setImportProgress({ current: 0, total: 0, currentTopic: "" });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const { error } = await dbHelpers.deleteUser(userToDelete.id);
      if (error) {
        showToast("Unable to delete user. This action requires service role permissions. Please contact your administrator.", "error", 4000, "Permission Error");
      } else {
        showToast("User has been deleted successfully. All associated data has been removed.", "success", 2500, "User Deleted");
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        await queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      }
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch {
      showToast("Error deleting user", "error");
    }
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Apply filter
    if (userFilter === "admin") {
      filtered = filtered.filter(u => u.is_admin);
    } else if (userFilter === "regular") {
      filtered = filtered.filter(u => !u.is_admin);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.email?.toLowerCase().includes(query) ||
        u.full_name?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => {
        const nameA = (a.full_name || a.email || "").toLowerCase();
        const nameB = (b.full_name || b.email || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    return filtered;
  }, [allUsers, userFilter, searchQuery, sortBy]);

  // Get all topics for content management (from database only)
  const allTopics = databaseTopics;

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return allTopics;
    const query = searchQuery.toLowerCase();
    return allTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.categoryTitle.toLowerCase().includes(query) ||
        topic.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [allTopics, searchQuery]);

  // formatDate and formatRelativeTime are now imported from utils/formatting

  // Export data
  const exportData = async (type) => {
    try {
      let data, filename, mimeType;

      if (type === "users") {
        data = allUsers;
        filename = `users-export-${new Date().toISOString().split("T")[0]}.json`;
        mimeType = "application/json";
      } else if (type === "analytics") {
        data = { ...analytics, staticStats, timestamp: new Date().toISOString() };
        filename = `analytics-export-${new Date().toISOString().split("T")[0]}.json`;
        mimeType = "application/json";
      } else if (type === "activity") {
        data = activityLogs;
        filename = `activity-logs-${new Date().toISOString().split("T")[0]}.json`;
        mimeType = "application/json";
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`${type} exported successfully`, "success");
    } catch {
      showToast("Failed to export data", "error");
    }
  };

  // Memoize translated error message
  const accessDeniedMessage = useMemo(() => t("errors.accessDenied"), [t]);

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      showToast(accessDeniedMessage, "error", 3000, accessDeniedMessage);
    }
  }, [user, isAdmin, showToast, accessDeniedMessage]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
          <Shield className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            {t("errors.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            {t("errors.accessDenied")}
          </p>
        </div>
      </div>
    );
  }


  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <>
      <AdminLayout
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={refreshData}
        refreshing={refreshing}
      >
        {/* Analytics Tab - Using shadcn components */}
        {activeTab === "analytics" && (
          <AnalyticsPage
            analytics={analytics}
            detailedAnalyticsData={detailedAnalyticsData}
            loadingAnalytics={loadingAnalytics}
            loadingDetailedAnalytics={loadingDetailedAnalytics}
            analyticsTimeframe={analyticsTimeframe}
            onTimeframeChange={setAnalyticsTimeframe}
            staticStats={staticStats}
          />
        )}

        {/* Other tabs */}
        {activeTab !== "analytics" && (
          <>
            {/* Users Tab */}
            {activeTab === "users" && (
              <UsersPage
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                userFilter={userFilter}
                sortBy={sortBy}
                onFilterChange={setUserFilter}
                onSortChange={setSortBy}
                filteredUsers={filteredUsers}
                onViewDetails={(userItem) => {
                  setSelectedUser(userItem);
                  setShowUserModal(true);
                  fetchUserStats(userItem.id);
                }}
                onToggleAdmin={(userId, currentStatus) => handleToggleAdmin(userId, currentStatus)}
                onDelete={(userItem) => {
                  setUserToDelete(userItem);
                  setShowDeleteConfirm(true);
                }}
                currentUserId={user.id}
                onExport={() => exportData("users")}
              />
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <ContentPage
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddTopic={handleAddTopic}
                onEditTopic={handleEditTopic}
                onDeleteTopic={handleDeleteTopic}
                onImportStaticData={handleImportStaticData}
                onImportStaticTopics={handleImportStaticTopics}
                importingData={importingData}
                importingTopics={importingTopics}
                importProgress={importProgress}
                categoriesLength={categories.length}
                loadingTopics={loadingTopics}
                filteredTopics={filteredTopics}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <NotificationsPage user={user} showToast={showToast} allUsers={allUsers} />
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <ActivityPage
                activityLogs={activityLogs}
                formatRelativeTime={formatRelativeTime}
                onExport={() => exportData("activity")}
              />
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <SettingsPage exportData={exportData} />
            )}

            {/* Featured Models Tab */}
            {activeTab === "featured-models" && (
              <FeaturedModelsPage showToast={showToast} />
            )}
          </>
        )}
      </AdminLayout>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          stats={userStats}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
            setUserStats(null);
          }}
          onToggleAdmin={() => {
            handleToggleAdmin(selectedUser.id, selectedUser.is_admin);
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          currentUserId={user.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      {/* Topic Management Modals - Lazy loaded with Suspense fallback */}
      {showTopicModal && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        }>
          <TopicModal
            isOpen={showTopicModal}
            onClose={() => {
              setShowTopicModal(false);
              setSelectedTopic(null);
              setSelectedCategoryForTopic(null);
            }}
            topic={selectedTopic}
            categoryId={selectedCategoryForTopic}
            onSave={handleSaveTopic}
          />
        </Suspense>
      )}

      {showDeleteTopicConfirm && topicToDelete && (
        <ConfirmationDialog
          isOpen={showDeleteTopicConfirm}
          title="Delete Topic"
          message={t("confirmations.deleteTopic.message", { title: topicToDelete.title })}
          confirmText={t("common.delete")}
          cancelText="Cancel"
          onConfirm={confirmDeleteTopic}
          onCancel={() => {
            setShowDeleteTopicConfirm(false);
            setTopicToDelete(null);
          }}
          variant="destructive"
        />
      )}

      {showDeleteConfirm && userToDelete && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={t("confirmations.deleteUser.message", { email: userToDelete.email })}
          confirmText={t("users.modals.deleteUser.confirm")}
          cancelText={t("common.cancel")}
          variant="danger"
        />
      )}
    </>
  );
};

// StatCard is now imported from components/admin/StatCard
// UserCard, TopicCard, ActivityCard, NotificationsTab, and SettingsTab are now in separate component files
// UserDetailsModal is now in components/admin/UserDetailsModal

export default AdminDashboard;
