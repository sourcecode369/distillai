import { dbHelpers } from "../lib/supabase";
import { DATA } from "../data";

export const importStaticTopics = async (onProgress = null, onComplete = null) => {
  const results = {
    success: 0,
    updated: 0,
    errors: 0,
    details: [],
  };

  try {
    // Get all topics from static DATA
    const allStaticTopics = DATA.categories.flatMap((category) =>
      (category.topics || []).map((topic) => ({
        ...topic,
        categoryId: category.id,
        categoryTitle: category.title,
      }))
    );

    const total = allStaticTopics.length;
    let processed = 0;

    // Process each topic
    for (const topic of allStaticTopics) {
      try {
        // Check if topic already exists in database
        const { data: existing } = await dbHelpers.getTopic(
          topic.categoryId,
          topic.id || topic.topic_id
        );

        if (existing) {
          // Topic already exists - update it with new content
          const topicData = {
            title: topic.title,
            description: topic.description || "",
            difficulty: topic.difficulty || "Beginner",
            section: topic.section || null,
            section_description: topic.sectionDescription || null,
            readTime: topic.readTime || "5 min read",
            tags: topic.tags || [],
            video: topic.video || null,
            content: topic.content || {},
          };

          const { data, error } = await dbHelpers.updateTopic(
            existing.id,
            topicData
          );

          if (error) {
            throw error;
          }

          if (!data) {
            // RLS policies are configured correctly now, but keeping null check for safety
            // Let's count it but log it.
            results.details.push({
              title: topic.title,
              status: "warning",
              message: "Update successful but no data returned (check RLS policies)",
            });
          } else {
            results.updated++;
          }
          results.details.push({
            topic: topic.title,
            category: topic.categoryTitle,
            status: "updated",
            message: "Successfully updated existing topic",
          });
        } else {
          // Import new topic
          const topicData = {
            categoryId: topic.categoryId,
            topicId: topic.id || topic.topic_id || `topic-${Date.now()}`,
            title: topic.title,
            description: topic.description || "",
            difficulty: topic.difficulty || "Beginner",
            section: topic.section || null,
            section_description: topic.sectionDescription || null,
            readTime: topic.readTime || "5 min read",
            tags: topic.tags || [],
            video: topic.video || null, // Store video in dedicated column
            content: topic.content || {},
            is_custom: false, // Mark as static (not custom)
          };

          const { data, error } = await dbHelpers.createTopic(topicData);

          if (error) {
            throw error;
          }

          results.success++;
          results.details.push({
            topic: topic.title,
            category: topic.categoryTitle,
            status: "imported",
            message: "Successfully imported",
          });
        }

        processed++;
        if (onProgress) {
          onProgress(processed, total, topic.title);
        }
      } catch (error) {
        results.errors++;
        results.details.push({
          topic: topic.title,
          category: topic.categoryTitle,
          status: "error",
          message: error.message || "Unknown error",
          error: error,
        });
        console.error(`Error importing topic "${topic.title}":`, error);
        processed++;
        if (onProgress) {
          onProgress(processed, total, topic.title);
        }
      }
    }

    if (onComplete) {
      onComplete(results.success, results.updated, results.errors, results.details);
    }

    return results;
  } catch (error) {
    console.error("Fatal error during import:", error);
    if (onComplete) {
      onComplete(results.success, results.updated, results.errors, results.details);
    }
    throw error;
  }
};

export const checkImportStatus = async () => {
  try {
    const { data: dbTopics } = await dbHelpers.getAllTopics();
    const staticTopics = DATA.categories.reduce(
      (acc, cat) => acc + (cat.topics?.length || 0),
      0
    );

    const importedCount = dbTopics?.filter((t) => !t.is_custom).length || 0;

    return {
      imported: importedCount > 0,
      importedCount,
      staticCount: staticTopics,
      needsImport: staticTopics > importedCount,
    };
  } catch (error) {
    console.error("Error checking import status:", error);
    return {
      imported: false,
      importedCount: 0,
      staticCount: 0,
      needsImport: false,
    };
  }
};

export default {
  importStaticTopics,
  checkImportStatus,
};



