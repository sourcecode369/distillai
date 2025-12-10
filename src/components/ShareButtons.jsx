import React, { useState } from "react";
import PropTypes from "prop-types";
import { Share2, Twitter, Linkedin, Link2, Check } from "lucide-react";

const ShareButtons = ({ title, url, description }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareText = `${title} - ${description || "AI Handbook"}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 touch-manipulation flex items-center justify-center"
          title="Share"
          aria-label="Share"
        >
          <Share2 size={20} />
        </button>
      )}
      <button
        onClick={shareToTwitter}
        className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 touch-manipulation flex items-center justify-center"
        title="Share on Twitter"
        aria-label="Share on Twitter"
      >
        <Twitter size={20} />
      </button>
      <button
        onClick={shareToLinkedIn}
        className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 touch-manipulation flex items-center justify-center"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </button>
      <button
        onClick={handleCopyLink}
        className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm hover:shadow-md relative active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 touch-manipulation flex items-center justify-center"
        title="Copy link"
        aria-label="Copy link"
      >
        {copied ? (
          <Check size={20} className="text-green-600 dark:text-green-400" />
        ) : (
          <Link2 size={20} />
        )}
      </button>
    </div>
  );
};

ShareButtons.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  description: PropTypes.string,
};

export default ShareButtons;

