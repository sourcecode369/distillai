export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "—") return "—";
  if (typeof value === "string") return value;
  return new Intl.NumberFormat("en-US").format(value);
};

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

export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};


