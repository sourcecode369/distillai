import { dbHelpers } from "../lib/supabase";
import { loadAllCategories } from "./dataLoader";

/**
 * Global Search Utility
 * 
 * Indexes and searches across all content types:
 * - Topics (from database)
 * - Categories (Handbooks)
 * - Quizzes (from topic content)
 */

export const SEARCH_TYPES = {
  TOPIC: "topic",
  CATEGORY: "category",
  QUIZ: "quiz",
};

/**
 * Builds a search index from all content (topics from database)
 */
export const buildSearchIndex = async () => {
  const index = {
    topics: [],
    categories: [],
    quizzes: [],
  };

  // Load categories from database and create map for lookups
  let categories = [];
  const categoryMap = new Map();
  
  try {
    categories = await loadAllCategories();
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        // Add to map for topic lookups
        categoryMap.set(category.category_id, category);
        // Index category (handbook)
        index.categories.push({
          id: category.category_id,
          title: category.title,
          description: category.description || "",
          icon: category.icon,
          color: category.color,
          type: SEARCH_TYPES.CATEGORY,
          lastUpdated: null, // Categories don't have lastUpdated
        });
      });
    }
  } catch (error) {
    console.error("Error loading categories for search index:", error);
  }

  // Load topics from database
  try {
    const { data: dbTopics, error } = await dbHelpers.getAllTopics();
    
    if (!error && dbTopics && dbTopics.length > 0) {
      // Index topics from database
      dbTopics.forEach((dbTopic) => {
        const topic = {
          id: dbTopic.topic_id,
          title: dbTopic.title || "",
          description: dbTopic.description || "",
          tags: dbTopic.tags || [],
          difficulty: dbTopic.difficulty,
          readTime: dbTopic.read_time,
          lastUpdated: dbTopic.updated_at ? new Date(dbTopic.updated_at).toLocaleDateString() : null,
          categoryId: dbTopic.category_id,
          categoryTitle: categoryMap.get(dbTopic.category_id)?.title || "",
          type: SEARCH_TYPES.TOPIC,
          content: dbTopic.content || {},
        };

        index.topics.push(topic);

        // Index quiz if it exists
        if (topic.content?.quiz && Array.isArray(topic.content.quiz) && topic.content.quiz.length > 0) {
          const quizQuestions = topic.content.quiz;
          const quizText = quizQuestions
            .map((q) => q.question + " " + (q.options || []).join(" "))
            .join(" ");

          index.quizzes.push({
            id: `${topic.id}-quiz`,
            title: `${topic.title} Quiz`,
            description: `Quiz for ${topic.title} with ${quizQuestions.length} questions`,
            topicId: topic.id,
            topicTitle: topic.title,
            categoryId: topic.categoryId,
            categoryTitle: topic.categoryTitle,
            questionCount: quizQuestions.length,
            quizText: quizText, // For searching within quiz content
            type: SEARCH_TYPES.QUIZ,
            lastUpdated: topic.lastUpdated,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error loading topics for search index:", error);
  }

  return index;
};

/**
 * Scores a search result based on query match
 */
const scoreMatch = (text, query) => {
  if (!text) return 0;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Exact match gets highest score
  if (lowerText === lowerQuery) return 100;

  // Starts with query gets high score
  if (lowerText.startsWith(lowerQuery)) return 80;

  // Contains query gets medium score
  if (lowerText.includes(lowerQuery)) return 50;

  // Word boundary match gets lower score
  const words = lowerQuery.split(/\s+/);
  let wordMatches = 0;
  words.forEach((word) => {
    if (lowerText.includes(word)) wordMatches++;
  });
  if (wordMatches > 0) {
    return (wordMatches / words.length) * 30;
  }

  return 0;
};

/**
 * Performs a global search across all indexed content
 * Note: This is now async since it loads topics from database
 */
export const performGlobalSearch = async (query, filters = {}) => {
  if (!query || !query.trim()) {
    return {
      topics: [],
      categories: [],
      quizzes: [],
      total: 0,
    };
  }

  const index = await buildSearchIndex();
  const lowerQuery = query.toLowerCase().trim();
  const { typeFilter = null, sortBy = "relevance" } = filters;

  const results = {
    topics: [],
    categories: [],
    quizzes: [],
  };

  // Search topics
  if (!typeFilter || typeFilter === SEARCH_TYPES.TOPIC) {
    index.topics.forEach((topic) => {
      const titleScore = scoreMatch(topic.title, lowerQuery);
      const descScore = scoreMatch(topic.description, lowerQuery);
      const tagMatches = topic.tags.filter((tag) =>
        tag.toLowerCase().includes(lowerQuery)
      ).length;
      const tagScore = tagMatches > 0 ? 40 : 0;

      const totalScore = Math.max(titleScore, descScore * 0.7, tagScore);

      if (totalScore > 0) {
        results.topics.push({
          ...topic,
          relevanceScore: totalScore,
        });
      }
    });
  }

  // Search categories (handbooks)
  if (!typeFilter || typeFilter === SEARCH_TYPES.CATEGORY) {
    index.categories.forEach((category) => {
      const titleScore = scoreMatch(category.title, lowerQuery);
      const descScore = scoreMatch(category.description, lowerQuery);

      const totalScore = Math.max(titleScore, descScore * 0.7);

      if (totalScore > 0) {
        results.categories.push({
          ...category,
          relevanceScore: totalScore,
        });
      }
    });
  }

  // Search quizzes
  if (!typeFilter || typeFilter === SEARCH_TYPES.QUIZ) {
    index.quizzes.forEach((quiz) => {
      const titleScore = scoreMatch(quiz.title, lowerQuery);
      const descScore = scoreMatch(quiz.description, lowerQuery);
      const quizTextScore = scoreMatch(quiz.quizText, lowerQuery) * 0.5;

      const totalScore = Math.max(titleScore, descScore * 0.7, quizTextScore);

      if (totalScore > 0) {
        results.quizzes.push({
          ...quiz,
          relevanceScore: totalScore,
        });
      }
    });
  }

  // Sort results
  const sortResults = (items) => {
    if (sortBy === "relevance") {
      return items.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === "lastUpdated") {
      return items.sort((a, b) => {
        const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
        const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
        return dateB - dateA;
      });
    }
    return items;
  };

  results.topics = sortResults(results.topics);
  results.categories = sortResults(results.categories);
  results.quizzes = sortResults(results.quizzes);

  results.total =
    results.topics.length +
    results.categories.length +
    results.quizzes.length;

  return results;
};

