/**
 * Formatting Utilities
 * 
 * Common formatting functions used across the application
 * for consistent number, date, and text formatting.
 */

/**
 * Formats a number with thousand separators
 * 
 * Handles null, undefined, and string values gracefully.
 * Returns "—" for invalid values to maintain UI consistency.
 * 
 * @param {number|string|null|undefined} value - The value to format
 * @returns {string} Formatted number string or "—" for invalid values
 * 
 * @example
 * formatNumber(1234) // Returns: "1,234"
 * formatNumber(null) // Returns: "—"
 * formatNumber("—") // Returns: "—"
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "—") return "—";
  if (typeof value === "string") return value;
  return new Intl.NumberFormat("en-US").format(value);
};

/**
 * Formats a date string to a readable format
 * 
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "—";
  }
};

/**
 * Formats a relative time string (e.g., "2h ago", "3d ago")
 * 
 * Calculates the time difference and returns a human-readable
 * relative time string. Falls back to formatted date for older dates.
 * 
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Relative time string or formatted date
 * 
 * @example
 * formatRelativeTime("2024-01-15T10:00:00Z") // Returns: "2h ago" (if 2 hours ago)
 * formatRelativeTime("2024-01-01T10:00:00Z") // Returns: "Jan 1, 2024" (if older)
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // For older dates, return formatted date
    return formatDate(dateString);
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "—";
  }
};

/**
 * Truncates text to a specified length with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} suffix - Suffix to append (default: "...")
 * @returns {string} Truncated text with suffix
 * 
 * @example
 * truncateText("This is a long text", 10) // Returns: "This is a ..."
 */
export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};


