import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Save,
  Loader2,
  Edit2,
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Sparkles,
  Bell,
  BellOff,
  Settings,
  Shield,
  Lock,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { dbHelpers, supabase, authHelpers } from "../lib/supabase";
import AvatarSelector from "../components/AvatarSelector";
import Breadcrumbs from "../components/Breadcrumbs";
import { ProfileSkeleton } from "../components/LoadingSkeleton";
import EmptyState, { ErrorState } from "../components/EmptyState";
import Tooltip from "../components/Tooltip";
import Button from "../components/Button";
import Hero from "../components/Hero";

const ProfilePage = () => {
  const { t } = useTranslation('app');
  const { user, signOut } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    newsletter_enabled: false,
    handbook_alerts_enabled: false,
    product_updates_enabled: false,
  });
  const [errors, setErrors] = useState({});
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Account & Security state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Fetch profile using React Query
  const {
    data: profile,
    isLoading: loading,
    error: profileError,
  } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await dbHelpers.getUserProfile(user.id);

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist yet, return default profile
          return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            bio: "",
            github_url: "",
            linkedin_url: "",
            twitter_url: "",
            newsletter_enabled: false,
            handbook_alerts_enabled: false,
            product_updates_enabled: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
    onError: (error) => {
      console.error("Error loading profile:", error);
      showToast(t('profile.errors.loadFailed'), "error");
    },
  });

  // Update formData when profile loads
  useEffect(() => {
    if (profile && user) {
      setFormData({
        full_name: profile.full_name || user.user_metadata?.full_name || "",
        avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || "",
        bio: profile.bio || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        newsletter_enabled: profile.newsletter_enabled || false,
        handbook_alerts_enabled: profile.handbook_alerts_enabled || false,
        product_updates_enabled: profile.product_updates_enabled || false,
      });
    }
  }, [profile, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.full_name && formData.full_name.length > 100) {
      newErrors.full_name = t('profile.validation.fullNameMaxLength');
    }

    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = t('profile.validation.bioMaxLength');
    }

    if (formData.github_url && !isValidUrl(formData.github_url)) {
      newErrors.github_url = t('profile.validation.invalidUrl');
    }

    if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) {
      newErrors.linkedin_url = t('profile.validation.invalidUrl');
    }

    if (formData.twitter_url && !isValidUrl(formData.twitter_url)) {
      newErrors.twitter_url = t('profile.validation.invalidUrl');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    if (!string.trim()) return true; // Empty is valid
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast(t('profile.errors.fixErrors'), "error", 3000, t('profile.errors.validationError'));
      return;
    }

    try {
      setSaving(true);
      const { error } = await dbHelpers.updateUserProfile(user.id, {
        full_name: formData.full_name || null,
        avatar_url: formData.avatar_url || null,
        bio: formData.bio || null,
        github_url: formData.github_url || null,
        linkedin_url: formData.linkedin_url || null,
        twitter_url: formData.twitter_url || null,
        newsletter_enabled: formData.newsletter_enabled,
        handbook_alerts_enabled: formData.handbook_alerts_enabled,
        product_updates_enabled: formData.product_updates_enabled,
      });

      if (error) {
        console.error("Error updating profile:", error);
        showToast(t('profile.errors.updateFailed'), "error");
        return;
      }

      // Update user metadata in Supabase auth
      try {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: formData.full_name || null,
            avatar_url: formData.avatar_url || null,
          }
        });

        if (metadataError) {
        }
      } catch (metadataErr) {
      }

      setIsEditing(false);
      showToast(t('profile.success.updated'), "success", 2500, t('profile.success.title'));

      // Invalidate and refetch profile data to ensure everything is in sync
      queryClient.invalidateQueries({ queryKey: ["user-profile", user.id] });
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(t('profile.errors.updateFailed'), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile && user) {
      setFormData({
        full_name: profile.full_name || user.user_metadata?.full_name || "",
        avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || "",
        bio: profile.bio || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        newsletter_enabled: profile.newsletter_enabled || false,
        handbook_alerts_enabled: profile.handbook_alerts_enabled || false,
        product_updates_enabled: profile.product_updates_enabled || false,
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const getInitials = () => {
    const name = formData.full_name || user?.email?.split("@")[0] || "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('profile.labels.notSet');
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return t('time.justNow');
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('time.minutesAgo', { count: minutes });
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('time.hoursAgo', { count: hours });
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return t('time.daysAgo', { count: days });
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return t('time.monthsAgo', { count: months });
    }
    const years = Math.floor(diffInSeconds / 31536000);
    return t('time.yearsAgo', { count: years });
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 7; // full_name, avatar_url, bio, github_url, linkedin_url, twitter_url, preferences

    if (formData.full_name) completed++;
    if (formData.avatar_url) completed++;
    if (formData.bio) completed++;
    if (formData.github_url) completed++;
    if (formData.linkedin_url) completed++;
    if (formData.twitter_url) completed++;
    // Count preferences as one item if at least one is enabled
    if (formData.newsletter_enabled || formData.handbook_alerts_enabled || formData.product_updates_enabled) {
      completed++;
    }

    const percentage = Math.round((completed / total) * 100);
    return { percentage, completed, total };
  };

  const getCompletionHint = () => {
    const missing = [];
    if (!formData.full_name) missing.push('fullName');
    if (!formData.avatar_url) missing.push('avatar');
    if (!formData.bio) missing.push('bio');
    if (!formData.github_url && !formData.linkedin_url && !formData.twitter_url) {
      missing.push('socialLinks');
    }
    if (!formData.newsletter_enabled && !formData.handbook_alerts_enabled && !formData.product_updates_enabled) {
      missing.push('preferences');
    }

    if (missing.length === 0) return t('profile.completion.complete');
    const items = missing.slice(0, 2).map(key => t(`profile.completion.missing.${key}`)).join(` ${t('profile.completion.and')} `);
    return t('profile.completion.hint', { items });
  };

  // Account & Security handlers
  const handleChangeEmail = async () => {
    if (!newEmail.trim()) {
      showToast(t('profile.security.email.enterNew'), "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showToast(t('profile.security.email.invalid'), "error");
      return;
    }

    if (newEmail === user.email) {
      showToast(t('profile.security.email.mustBeDifferent'), "error");
      return;
    }

    try {
      setChangingEmail(true);
      const { error } = await authHelpers.updateEmail(newEmail);

      if (error) {
        console.error("Error changing email:", error);
        showToast(error.message || t('profile.security.email.changeFailed'), "error");
        return;
      }

      showToast(t('profile.security.email.changeRequestSent'), "success");
      setNewEmail("");
      // Reload user to get updated email
      window.location.reload();
    } catch (error) {
      console.error("Error changing email:", error);
      showToast(t('profile.security.email.changeFailed'), "error");
    } finally {
      setChangingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showToast(t('profile.security.password.fillAll'), "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast(t('profile.security.password.minLength'), "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(t('profile.security.password.mismatch'), "error");
      return;
    }

    try {
      setChangingPassword(true);
      const { error } = await authHelpers.updatePassword(newPassword);

      if (error) {
        console.error("Error changing password:", error);
        showToast(error.message || t('profile.security.password.changeFailed'), "error");
        return;
      }

      showToast(t('profile.security.password.changeSuccess'), "success");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPassword(false);

      // Sign out the user after password change for security
      setTimeout(async () => {
        await signOut();
        // Redirect to home after sign out
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Error changing password:", error);
      showToast(t('profile.security.password.changeFailed'), "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showToast(t('profile.security.delete.typeDelete'), "error");
      return;
    }

    try {
      setDeletingAccount(true);

      // Delete user data from our tables (cascade should handle most, but let's be explicit)
      // Note: RLS policies should allow users to delete their own data
      const userId = user.id;

      // Delete bookmarks
      await supabase.from("bookmarks").delete().eq("user_id", userId);

      // Delete progress
      await supabase.from("user_progress").delete().eq("user_id", userId);

      // Delete notifications
      await supabase.from("notifications").delete().eq("user_id", userId);

      // Delete user profile
      await supabase.from("user_profiles").delete().eq("id", userId);

      // Sign out the user
      await authHelpers.signOut();

      // Show success message
      showToast(t('profile.security.delete.success'), "success");

      // Redirect to home after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast(t('profile.security.delete.failed'), "error");
      setDeletingAccount(false);
    }
  };


  if (loading) {
    return <ProfileSkeleton />;
  }

  if (profileError && profileError.code !== "PGRST116") {
    return (
      <div className="min-h-screen bg-slate-950">
        <Hero
          title={t('profile.title')}
          subtitle={t('profile.subtitle')}
          icon={<User size={22} className="text-white drop-shadow-sm" />}
          onBack={() => navigate(-1)}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState
            title={t('profile.errors.loadFailed', { defaultValue: 'Failed to load profile' })}
            description={profileError?.message || t('profile.errors.loadFailedDescription', { defaultValue: 'Unable to load your profile. Please try again.' })}
            error={profileError}
            onRetry={() => queryClient.invalidateQueries({ queryKey: ["user-profile", user?.id] })}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="relative overflow-hidden border-b border-gray-800/50">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-pink-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumbs
              items={[{ label: t('profile.title') }]}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={AlertCircle}
            title={t('profile.empty.signInRequired')}
            description={t('profile.empty.description')}
            action={t('buttons.back')}
            onAction={() => navigate(-1)}
            variant="default"
          />
        </div>
      </div>
    );
  }

  const completion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Dark header */}
      <div className="relative overflow-hidden border-b border-gray-800/50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-0 top-0 w-72 h-44 rounded-full bg-indigo-600/8 blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200 hover:border-gray-700 transition-all"
              aria-label="Back"
            >
              <ArrowRight size={16} className="rotate-180" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-100">{t('profile.title')}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{t('profile.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-600/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 hover:bg-indigo-600/20 hover:border-indigo-500/60 transition-all"
              >
                <Edit2 size={14} /> {t('profile.actions.edit')}
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-all"
                >
                  <X size={14} /> {t('buttons.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? t('messages.saving') : t('profile.actions.saveChanges')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content - Two Column Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Left Profile Summary Card - Fixed Width */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/60 shadow-xl p-6 lg:sticky lg:top-32 transition-all duration-300">
              {/* Avatar - Larger */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt={t('profile.title')}
                      className="w-40 h-40 rounded-2xl object-cover border-4 border-indigo-200 dark:border-indigo-800 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-indigo-200 dark:border-indigo-800 shadow-lg ${formData.avatar_url ? "hidden" : "flex"
                      }`}
                  >
                    {getInitials()}
                  </div>
                  {isEditing && (
                    <Tooltip content={t('profile.labels.changeAvatar')} position="top">
                      <button
                        onClick={() => setShowAvatarSelector(true)}
                        className="absolute bottom-0 right-0 p-2.5 bg-gray-900/50 backdrop-blur-sm rounded-full shadow-lg border-2 border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:scale-110 active:scale-95"
                        aria-label={t('profile.labels.changeAvatar')}
                      >
                        <Camera size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </Tooltip>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-gray-100 text-center mb-2">
                  {formData.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                </h2>

                {/* Bio */}
                {formData.bio && (
                  <p className="text-sm text-gray-400 text-center mb-3 leading-relaxed">
                    {formData.bio}
                  </p>
                )}

                {/* Email Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-4">
                  <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    {user.email}
                  </span>
                  <CheckCircle2 size={12} className="text-green-500" />
                </div>

                {/* Social Links */}
                {(formData.github_url || formData.linkedin_url || formData.twitter_url) && (
                  <div className="flex items-center gap-3 mb-4">
                    {formData.github_url && (
                      <a
                        href={formData.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                        aria-label="GitHub"
                      >
                        <Github size={18} className="text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      </a>
                    )}
                    {formData.linkedin_url && (
                      <a
                        href={formData.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={18} className="text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      </a>
                    )}
                    {formData.twitter_url && (
                      <a
                        href={formData.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                        aria-label="Twitter/X"
                      >
                        <Twitter size={18} className="text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4"></div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t('profile.labels.memberSince')}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-100">
                      {new Date(profile?.created_at || user.created_at).getFullYear()}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {formatDate(profile?.created_at || user.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t('profile.labels.lastUpdated')}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-100">
                      {profile?.updated_at ? formatDate(profile.updated_at) : t('profile.labels.never')}
                    </span>
                    {profile?.updated_at && (
                      <span className="text-[10px] text-gray-600">
                        ({getRelativeTime(profile.updated_at)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editable Sections - Full Width */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/60 p-6 sm:p-8">
              {/* Profile Completion Indicator */}
              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-950/60 to-violet-950/40 rounded-xl border border-indigo-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-semibold text-gray-100">
                      {t('profile.completion.percentage', { percentage: completion.percentage })}
                    </span>
                  </div>
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
                      style={{ width: `${completion.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {getCompletionHint()}
                </p>
              </div>

              <div className="space-y-5">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={14} />
                    {t('profile.sections.personalInfo')}
                  </h3>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-sm font-semibold text-gray-300 mb-2"
                      >
                        {t('profile.fields.fullName')}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder={t('profile.placeholders.fullName')}
                            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${errors.full_name
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                            maxLength={100}
                          />
                          {errors.full_name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.full_name}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-800/50 rounded-xl border border-gray-800/50">
                          <p className="text-gray-100">
                            {formData.full_name || (
                              <span className="text-gray-600 italic">
                                {t('profile.labels.notSet')}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Email (Read-only Badge) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        {t('profile.fields.email')}
                      </label>
                      <div className="px-4 py-2.5 bg-gray-800/50 rounded-xl border border-gray-800/50 flex items-center gap-2">
                        <Mail size={16} className="text-gray-600" />
                        <p className="text-gray-100 flex-1">{user.email}</p>
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md font-semibold">
                          {t('profile.labels.verified')}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {t('profile.labels.emailCannotChange')}
                      </p>
                    </div>

                    {/* Bio */}
                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-semibold text-gray-300 mb-2"
                      >
                        {t('profile.fields.bio')}
                      </label>
                      {isEditing ? (
                        <>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder={t('profile.placeholders.bio')}
                            rows={4}
                            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all resize-none ${errors.bio
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                            maxLength={200}
                          />
                          <div className="flex justify-between mt-1">
                            {errors.bio && (
                              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.bio}
                              </p>
                            )}
                            <p className="text-xs text-gray-600 ml-auto">
                              {formData.bio.length}/200
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-800/50 rounded-xl border border-gray-800/50 min-h-[100px]">
                          <p className="text-gray-100 whitespace-pre-wrap">
                            {formData.bio || (
                              <span className="text-gray-600 italic">
                                {t('profile.labels.notSet')}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800"></div>

                {/* Social Links Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ExternalLink size={14} />
                    {t('profile.sections.socialLinks')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* GitHub */}
                    <div>
                      <label
                        htmlFor="github_url"
                        className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2"
                      >
                        <Github size={16} />
                        GitHub
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="url"
                            id="github_url"
                            name="github_url"
                            value={formData.github_url}
                            onChange={handleInputChange}
                            placeholder="https://github.com/username"
                            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${errors.github_url
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                          />
                          {errors.github_url && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.github_url}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-800/50 rounded-xl border border-gray-800/50 truncate">
                          {formData.github_url ? (
                            <a
                              href={formData.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              {formData.github_url.replace("https://", "")}
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-gray-600 italic">
                              {t('profile.labels.notSet')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label
                        htmlFor="linkedin_url"
                        className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2"
                      >
                        <Linkedin size={16} />
                        LinkedIn
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="url"
                            id="linkedin_url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/username"
                            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${errors.linkedin_url
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                          />
                          {errors.linkedin_url && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.linkedin_url}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-800/50 rounded-xl border border-gray-800/50 truncate">
                          {formData.linkedin_url ? (
                            <a
                              href={formData.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              {formData.linkedin_url.replace("https://", "")}
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-gray-600 italic">
                              {t('profile.labels.notSet')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Twitter */}
                    <div>
                      <label
                        htmlFor="twitter_url"
                        className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2"
                      >
                        <Twitter size={16} />
                        Twitter / X
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="url"
                            id="twitter_url"
                            name="twitter_url"
                            value={formData.twitter_url}
                            onChange={handleInputChange}
                            placeholder="https://twitter.com/username"
                            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${errors.twitter_url
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                              }`}
                          />
                          {errors.twitter_url && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.twitter_url}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-800/50 rounded-xl border border-gray-800/50 truncate">
                          {formData.twitter_url ? (
                            <a
                              href={formData.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              {formData.twitter_url.replace("https://", "")}
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-gray-600 italic">
                              {t('profile.labels.notSet')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800"></div>

                {/* Preferences Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Bell size={14} />
                    {t('profile.sections.preferences')}
                  </h3>

                  <div className="space-y-3">
                    {/* Newsletter */}
                    <div className={`p-4 rounded-xl border transition-all ${formData.newsletter_enabled
                      ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                      : "bg-gray-800/50 border-gray-800/50"
                      }`}>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData.newsletter_enabled
                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                            : "bg-gray-800 text-gray-500"
                            }`}>
                            <Mail size={18} />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-gray-100">
                              {t('profile.preferences.newsletter.title')}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {t('profile.preferences.newsletter.description')}
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="newsletter_enabled"
                            checked={formData.newsletter_enabled}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </div>
                      </label>
                    </div>

                    {/* Handbook Alerts */}
                    <div className={`p-4 rounded-xl border transition-all ${formData.handbook_alerts_enabled
                      ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                      : "bg-gray-800/50 border-gray-800/50"
                      }`}>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData.handbook_alerts_enabled
                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                            : "bg-gray-800 text-gray-500"
                            }`}>
                            <Bell size={18} />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-gray-100">
                              {t('profile.preferences.handbookAlerts.title')}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {t('profile.preferences.handbookAlerts.description')}
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="handbook_alerts_enabled"
                            checked={formData.handbook_alerts_enabled}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </div>
                      </label>
                    </div>

                    {/* Product Updates */}
                    <div className={`p-4 rounded-xl border transition-all ${formData.product_updates_enabled
                      ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                      : "bg-gray-800/50 border-gray-800/50"
                      }`}>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData.product_updates_enabled
                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                            : "bg-gray-800 text-gray-500"
                            }`}>
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-gray-100">
                              {t('profile.preferences.productUpdates.title')}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {t('profile.preferences.productUpdates.description')}
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="product_updates_enabled"
                            checked={formData.product_updates_enabled}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Security Section - Separate Card */}
            <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/60 shadow-xl p-6 sm:p-8">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Shield size={14} />
                {t('profile.sections.accountSecurity')}
              </h3>

              <div className="space-y-8">
                {/* Change Email */}
                <div>
                  <h4 className="text-base font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Mail size={18} className="text-slate-400" />
                    {t('profile.security.changeEmail.title')}
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder={t('profile.security.email.placeholder')}
                      className="flex-1 px-4 py-2.5 border border-gray-700 rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <Button
                      variant="outline"
                      onClick={handleChangeEmail}
                      disabled={changingEmail || !newEmail}
                      isLoading={changingEmail}
                    >
                      {t('profile.security.changeEmail.updateButton')}
                    </Button>
                  </div>
                </div>

                <div className="h-px bg-gray-800"></div>

                {/* Change Password */}
                <div>
                  <h4 className="text-base font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-slate-400" />
                    {t('profile.security.changePassword.title')}
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t('profile.placeholders.newPassword')}
                        className="px-4 py-2.5 border border-gray-700 rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('profile.placeholders.confirmPassword')}
                        className="px-4 py-2.5 border border-gray-700 rounded-xl bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={handleChangePassword}
                        disabled={changingPassword || !newPassword || !confirmPassword}
                        isLoading={changingPassword}
                      >
                        {t('profile.security.changePassword.updateButton')}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-800"></div>

                {/* Delete Account */}
                <div>
                  <h4 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    {t('profile.security.delete.title')}
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    {t('profile.security.delete.description')}
                  </p>

                  {!showDeleteModal ? (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2.5 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      {t('profile.security.delete.button')}
                    </button>
                  ) : (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">
                        {t('profile.security.delete.confirmMessage')}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                          className="flex-1 px-4 py-2 border border-red-300 dark:border-red-800 rounded-lg bg-gray-800/60 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowDeleteModal(false);
                              setDeleteConfirmText("");
                            }}
                            className="px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                          >
                            {t('buttons.cancel')}
                          </button>
                          <Button
                            variant="danger"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmText !== "DELETE" || deletingAccount}
                            isLoading={deletingAccount}
                          >
                            {t('profile.security.delete.confirmButton')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        currentAvatar={formData.avatar_url}
        onSelect={(url) => {
          setFormData(prev => ({ ...prev, avatar_url: url }));
          setShowAvatarSelector(false);
        }}
      />
    </div>
  );
};

export default ProfilePage;
