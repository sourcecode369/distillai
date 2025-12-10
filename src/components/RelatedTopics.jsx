import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { ArrowRight } from "lucide-react";
import { CardSkeleton } from "./LoadingSkeleton";
import { loadTopicsForCategory, loadTopicsFromDatabase } from "../utils/topicLoader";
import { loadAllCategories } from "../utils/dataLoader";

// Memoized topic card component to prevent re-renders when parent updates
// Only re-renders when its own topic data changes
const RelatedTopicCard = React.memo(({ topic, isSameCategory, categoryTitle, onSelectTopic }) => {
  const handleClick = useCallback(() => {
    onSelectTopic(topic);
  }, [topic, onSelectTopic]);

  return (
    <div
      onClick={handleClick}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {!isSameCategory && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {topic.categoryTitle || categoryTitle}
            </p>
          )}
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
            {topic.title}
          </h4>
          {isSameCategory && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {topic.description}
            </p>
          )}
        </div>
        <ArrowRight
          size={16}
          className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
        />
      </div>
    </div>
  );
});

const RelatedTopics = ({ currentTopic, currentCategory, onSelectTopic, category }) => {
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedTopics = async () => {
      setLoading(true);
      try {
        // Load topics from database for current category
        const categoryTopics = await loadTopicsForCategory(currentCategory.id);

        // Find related topics from the same category
        const sameCategoryTopics = categoryTopics
          .filter((topic) => topic.id !== currentTopic.id)
          .slice(0, 3);

        if (sameCategoryTopics.length > 0) {
          setRelatedTopics(sameCategoryTopics);
        } else {
          // Find topics from other categories with similar tags
          const [allTopicsByCategory, allCategories] = await Promise.all([
            loadTopicsFromDatabase(),
            loadAllCategories(),
          ]);

          const categoryMap = new Map();
          allCategories.forEach((cat) => {
            categoryMap.set(cat.category_id, cat);
          });

          const allTopics = Object.entries(allTopicsByCategory)
            .flatMap(([categoryId, topics]) =>
              topics.map((topic) => ({
                ...topic,
                categoryId,
                categoryTitle: categoryMap.get(categoryId)?.title || "",
              }))
            )
            .filter((topic) => topic.id !== currentTopic.id);

          const topicsWithCommonTags = allTopics.filter((topic) =>
            topic.tags.some((tag) => currentTopic.tags.includes(tag))
          );

          const related = topicsWithCommonTags.slice(0, 3);
          setRelatedTopics(related);
        }
      } catch (error) {
        console.error("Error loading related topics:", error);
        setRelatedTopics([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentTopic && currentCategory) {
      fetchRelatedTopics();
    }
  }, [currentTopic, currentCategory]);

  // Memoize the category check to avoid recalculating on every render
  const isSameCategory = useMemo(() => {
    return relatedTopics[0]?.categoryId === currentCategory?.id;
  }, [relatedTopics, currentCategory?.id]);

  // Memoize the topic cards list to prevent recreating on every render
  // Only recalculates when relatedTopics, isSameCategory, or category changes
  const topicCards = useMemo(() => {
    return relatedTopics.map((topic) => (
      <RelatedTopicCard
        key={topic.id}
        topic={topic}
        isSameCategory={isSameCategory}
        categoryTitle={category?.title}
        onSelectTopic={onSelectTopic}
      />
    ));
  }, [relatedTopics, isSameCategory, category?.title, onSelectTopic]);

  if (loading) {
    // Using CardSkeleton instead of spinner for better UX
    // Shows the expected card layout while related topics load
    return (
      <div className="mt-12 p-6 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-indigo-100 dark:border-gray-700">
        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse mb-4"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedTopics.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-indigo-100 dark:border-gray-700">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight">
        {isSameCategory ? `More from ${currentCategory.title}` : "Related Topics"}
      </h3>
      <div className="grid gap-4">
        {topicCards}
      </div>
    </div>
  );
};

RelatedTopicCard.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    categoryId: PropTypes.string,
    categoryTitle: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isSameCategory: PropTypes.bool.isRequired,
  categoryTitle: PropTypes.string,
  onSelectTopic: PropTypes.func.isRequired,
};

RelatedTopics.propTypes = {
  currentTopic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  currentCategory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  onSelectTopic: PropTypes.func.isRequired,
  category: PropTypes.shape({
    title: PropTypes.string,
  }),
};

export default RelatedTopics;

