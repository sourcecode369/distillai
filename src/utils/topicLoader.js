import { dbHelpers } from "../lib/supabase";
import { DATA } from "../data";

export const loadTopicsFromDatabase = async () => {
  try {
    const { data, error } = await dbHelpers.getAllTopics();
    
    if (error) {
      console.error("Error loading topics from database:", error);
      return {};
    }

    // Group topics by category
    const topicsByCategory = {};
    (data || []).forEach((dbTopic) => {
      const categoryId = dbTopic.category_id;
      if (!topicsByCategory[categoryId]) {
        topicsByCategory[categoryId] = [];
      }

      // Transform database format to match static topic format
      const content = dbTopic.content || {};
      topicsByCategory[categoryId].push({
        id: dbTopic.topic_id, // Use topic_id as id for compatibility
        topic_id: dbTopic.topic_id,
        title: dbTopic.title,
        description: dbTopic.description,
        difficulty: dbTopic.difficulty,
        section: dbTopic.section || dbTopic.difficulty || 'Fundamentals',
        sectionDescription: dbTopic.section_description || null,
        readTime: dbTopic.read_time,
        tags: dbTopic.tags || [],
        video: dbTopic.video || content.video || null, // Use video column first, fallback to content.video
        content: content,
        lastUpdated: dbTopic.updated_at ? new Date(dbTopic.updated_at).toLocaleDateString() : null,
        is_custom: dbTopic.is_custom,
        // Keep database ID for editing
        _dbId: dbTopic.id,
      });
    });

    return topicsByCategory;
  } catch (error) {
    console.error("Error loading topics from database:", error);
    return {};
  }
};

export const loadTopicsForCategory = async (categoryId) => {
  try {
    const { data, error } = await dbHelpers.getTopicsByCategory(categoryId);
    
    if (error) {
      console.error("Error loading topics for category:", error);
      return [];
    }

    // Transform database format to match static topic format
    return (data || []).map((dbTopic) => {
      const content = dbTopic.content || {};
      return {
        id: dbTopic.topic_id,
        topic_id: dbTopic.topic_id,
        title: dbTopic.title,
        description: dbTopic.description,
        difficulty: dbTopic.difficulty,
        section: dbTopic.section || dbTopic.difficulty || 'Fundamentals',
        sectionDescription: dbTopic.section_description || null,
        readTime: dbTopic.read_time,
        tags: dbTopic.tags || [],
        video: dbTopic.video || content.video || null, // Use video column first, fallback to content.video
        content: content,
        lastUpdated: dbTopic.updated_at ? new Date(dbTopic.updated_at).toLocaleDateString() : null,
        is_custom: dbTopic.is_custom,
        _dbId: dbTopic.id,
      };
    });
  } catch (error) {
    console.error("Error loading topics for category:", error);
    return [];
  }
};

export const loadTopic = async (categoryId, topicId) => {
  try {
    const { data, error } = await dbHelpers.getTopic(categoryId, topicId);
    
    if (error || !data) {
      return null;
    }

    // Transform database format
    const content = data.content || {};
    return {
      id: data.topic_id,
      topic_id: data.topic_id,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      section: data.section || data.difficulty || 'Fundamentals',
      sectionDescription: data.section_description || null,
      readTime: data.read_time,
      tags: data.tags || [],
      video: data.video || content.video || null, // Use video column first, fallback to content.video
      content: content,
      lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : null,
      is_custom: data.is_custom,
      _dbId: data.id,
    };
  } catch (error) {
    console.error("Error loading topic:", error);
    return null;
  }
};

export const loadCategoriesWithTopics = async () => {
  try {
    // Get all topics from database
    const topicsByCategory = await loadTopicsFromDatabase();

    // Merge with category metadata from static files
    return DATA.categories.map((category) => ({
      ...category,
      topics: topicsByCategory[category.id] || [],
    }));
  } catch (error) {
    console.error("Error loading categories with topics:", error);
    // Fallback to static categories (empty topics)
    return DATA.categories.map((category) => ({
      ...category,
      topics: [],
    }));
  }
};

export default {
  loadTopicsFromDatabase,
  loadTopicsForCategory,
  loadTopic,
  loadCategoriesWithTopics,
};



