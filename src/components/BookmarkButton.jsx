import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

const BookmarkButton = ({ item, className = "" }) => {
  const { t } = useTranslation('bookmark');
  const { isBookmarked, addBookmark, removeBookmark, showToast } = useApp();
  const bookmarked = isBookmarked(item.id || `${item.categoryId}-${item.topicId}`);

  const handleToggle = (e) => {
    e.stopPropagation();
    const id = item.id || `${item.categoryId}-${item.topicId}`;
    if (bookmarked) {
      removeBookmark(id);
      showToast(t('button.toast.removed'), "info");
    } else {
      addBookmark({
        id,
        type: item.type || "topic",
        categoryId: item.categoryId,
        topicId: item.topicId,
        title: item.title,
        categoryTitle: item.categoryTitle,
      });
      showToast(t('button.toast.added'), "success");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`min-w-[44px] min-h-[44px] p-2.5 rounded-lg transition-all duration-300 active:scale-95 touch-manipulation flex items-center justify-center ${
        bookmarked
          ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      } ${className}`}
      title={bookmarked ? t('button.remove') : t('button.add')}
      aria-label={bookmarked ? t('button.remove') : t('button.add')}
    >
      {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
    </button>
  );
};

BookmarkButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    categoryId: PropTypes.string,
    topicId: PropTypes.string,
    title: PropTypes.string,
    categoryTitle: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default BookmarkButton;

