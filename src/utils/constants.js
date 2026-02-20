/**
 * Application-wide constants
 *
 * Replace every magic number / magic string with a named reference here.
 * Groups: Query, UI, Auth, Pagination, Toast, Animation, Breakpoints
 */

// ── React Query ─────────────────────────────────────────────────────────────

/** Stale times (ms) — how long cached data is considered fresh */
export const STALE_TIME = {
  SHORT:    30_000,    // 30 s  — frequently updated data (notifications, unread counts)
  MEDIUM:  300_000,    //  5 m  — moderately updated data (user profile, bookmarks)
  LONG:  3_600_000,    //  1 h  — rarely updated data (categories, static topics)
};

/** Query key factory — prevents typos and makes invalidation discoverable */
export const QUERY_KEYS = {
  // Auth / profile
  userProfile:      (userId)          => ["user-profile", userId],
  adminStatus:      (userId)          => ["admin-status", userId],

  // Content
  sections:         ()                => ["sections"],
  categories:       ()                => ["categories"],
  category:         (categoryId)      => ["category", categoryId],
  topic:            (catId, topicId)  => ["topic", catId, topicId],
  topicCompletion:  (uid, cId, tId)   => ["topic-completion", uid, cId, tId],
  topicsForCategory:(categoryId)      => ["topics", categoryId],

  // User data
  bookmarks:        (userId)          => ["bookmarks", userId],
  readingHistory:   (userId)          => ["reading-history", userId],
  userProgress:     (userId)          => ["user-progress", userId],
  userProgressFull: (userId)          => ["user-progress-with-quizzes", userId],
  categoryProgress: (uid, catId)      => ["category-progress", uid, catId],

  // Notifications
  notifications:    (userId, scope)   => ["notifications", userId, scope],
  notificationsUnread:(userId)        => ["notifications-unread", userId],

  // Admin
  adminAnalytics:   ()                => ["admin-analytics"],
  adminUsers:       ()                => ["admin-users"],
  adminTopics:      ()                => ["admin-topics"],
  adminCategories:  ()                => ["admin-categories"],
  adminActivity:    ()                => ["admin-activity"],

  // Search
  globalSearch:     (q, filter, sort) => ["global-search", q, filter, sort],

  // Contact
  contactSubmissions: ()              => ["contact-submissions"],
};

// ── UI / Layout ──────────────────────────────────────────────────────────────

/** Header height in px — keep in sync with h-16 (Tailwind) */
export const TOPBAR_HEIGHT = 64;

/** Minimum accessible touch-target size (WCAG 2.5.5) */
export const TOUCH_TARGET_MIN = 44;

/** Max content width for reading (TopicView, content pages) */
export const CONTENT_MAX_WIDTH = 768;

/** Admin content max width */
export const ADMIN_MAX_WIDTH = 1280;

// ── Pagination ───────────────────────────────────────────────────────────────

export const PAGE_SIZE = {
  NOTIFICATIONS: 50,
  READING_HISTORY: 10,
  SEARCH_RESULTS: 20,
  ADMIN_USERS: 50,
};

// ── Toast ────────────────────────────────────────────────────────────────────

export const TOAST_DURATION = {
  SHORT:  2000,   // Quick confirmations
  BASE:   2500,   // Default
  LONG:   4000,   // Warnings / complex info
  STICKY: 0,      // Must be manually dismissed
};

// ── Animation ────────────────────────────────────────────────────────────────

export const ANIMATION_DURATION = {
  FAST:   150,
  BASE:   200,
  SLOW:   300,
  SLOWER: 500,
  STAGGER:160,  // Delay between sequential animations
};

// ── Auth ─────────────────────────────────────────────────────────────────────

/** How long to wait before showing the auto sign-up prompt (ms) */
export const AUTO_SIGNUP_DELAY = 5000;

/** Admin check retry config */
export const ADMIN_CHECK = {
  MAX_RETRIES: 2,
  RETRY_BASE_DELAY: 500,  // ms — multiplied by (retryCount + 1)
};

// ── Storage keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  BOOKMARKS:          "bookmarks",
  READING_HISTORY:    "readingHistory",
  READING_MILESTONES: "readingMilestones",
  DARK_MODE:          "darkMode",
  LANGUAGE:           "ai-handbooks-lang",
};

// ── Reading milestones ────────────────────────────────────────────────────────

export const READING_MILESTONES = {
  1:  { title: "First handbook read!",   body: "You've started your AI learning journey on Distill AI. Keep going!" },
  5:  { title: "5 handbooks read!",      body: "Great momentum — you've explored 5 topics. You're building real knowledge." },
  10: { title: "10 handbooks read!",     body: "Double digits! You're making serious progress on Distill AI." },
  20: { title: "20 handbooks read!",     body: "Impressive! 20 handbooks read. You're on a roll." },
  50: { title: "50 handbooks read!",     body: "50 handbooks — that's serious dedication. You're an AI expert in the making." },
};

// ── Supported locales ─────────────────────────────────────────────────────────

export const SUPPORTED_LOCALES = ["en", "de", "es", "fr", "it", "pt"];
export const DEFAULT_LOCALE = "en";

// ── Search scoring ─────────────────────────────────────────────────────────────

export const SEARCH_SCORE = {
  EXACT_MATCH:  100,
  STARTS_WITH:   80,
  CONTAINS:      50,
  WORD_MATCH:    30,
};
