/**
 * Data Loader Utility
 * 
 * Loads sections and categories from database instead of static files.
 * This is the new source of truth for all content structure.
 */

import { dbHelpers } from "../lib/supabase";
import { getIcon } from "./iconMapper";

/**
 * Get all sections from database
 * @returns {Promise<Array>} Array of sections
 */
export const loadSections = async () => {
  try {
    const { data, error } = await dbHelpers.getAllSections();
    
    if (error) {
      console.error("Error loading sections from database:", error);
      return [];
    }

    // Transform database format to match static format
    return (data || []).map((dbSection) => ({
      id: dbSection.section_id,
      section_id: dbSection.section_id,
      title: dbSection.title,
      subtitle: dbSection.subtitle,
      display_order: dbSection.display_order,
      // categories will be loaded separately and attached
      categories: [],
    }));
  } catch (error) {
    console.error("Error loading sections from database:", error);
    return [];
  }
};

/**
 * Get all categories from database
 * @returns {Promise<Array>} Array of categories
 */
export const loadCategories = async () => {
  try {
    const { data, error } = await dbHelpers.getAllCategories();
    
    if (error) {
      console.error("Error loading categories from database:", error);
      return [];
    }

    // Transform database format to match static format
    return (data || []).map((dbCategory) => ({
      id: dbCategory.category_id,
      category_id: dbCategory.category_id,
      section_id: dbCategory.section_id,
      title: dbCategory.title,
      description: dbCategory.description,
      icon: getIcon(dbCategory.icon_name, { className: "w-6 h-6" }),
      iconName: dbCategory.icon_name, // Keep icon name for reference
      color: dbCategory.color_classes,
      display_order: dbCategory.display_order,
      // topics will be loaded separately
      topics: [],
    }));
  } catch (error) {
    console.error("Error loading categories from database:", error);
    return [];
  }
};

/**
 * Get categories for a specific section
 * @param {string} sectionId - The section ID
 * @returns {Promise<Array>} Array of categories for the section
 */
export const loadCategoriesForSection = async (sectionId) => {
  try {
    const { data, error } = await dbHelpers.getCategoriesBySection(sectionId);
    
    if (error) {
      console.error("Error loading categories for section:", error);
      return [];
    }

    // Transform database format
    return (data || []).map((dbCategory) => ({
      id: dbCategory.category_id,
      category_id: dbCategory.category_id,
      section_id: dbCategory.section_id,
      title: dbCategory.title,
      description: dbCategory.description,
      icon: getIcon(dbCategory.icon_name, { className: "w-6 h-6" }),
      iconName: dbCategory.icon_name,
      color: dbCategory.color_classes,
      display_order: dbCategory.display_order,
      topics: [],
    }));
  } catch (error) {
    console.error("Error loading categories for section:", error);
    return [];
  }
};

/**
 * Get a single category by ID
 * @param {string} categoryId - The category ID
 * @returns {Promise<Object|null>} The category object or null
 */
export const loadCategory = async (categoryId) => {
  try {
    const { data, error } = await dbHelpers.getCategory(categoryId);
    
    if (error || !data) {
      return null;
    }

    // Transform database format
    return {
      id: data.category_id,
      category_id: data.category_id,
      section_id: data.section_id,
      title: data.title,
      description: data.description,
      icon: getIcon(data.icon_name, { className: "w-6 h-6" }),
      iconName: data.icon_name,
      color: data.color_classes,
      display_order: data.display_order,
      topics: [],
    };
  } catch (error) {
    console.error("Error loading category:", error);
    return null;
  }
};

/**
 * Get all sections with their categories
 * This is the main function that replaces DATA.sections
 * @returns {Promise<Array>} Array of sections with categories
 */
export const loadSectionsWithCategories = async () => {
  try {
    // Load sections and categories in parallel
    const [sections, categories] = await Promise.all([
      loadSections(),
      loadCategories(),
    ]);

    // Group categories by section
    const categoriesBySection = {};
    categories.forEach((category) => {
      const sectionId = category.section_id;
      if (!categoriesBySection[sectionId]) {
        categoriesBySection[sectionId] = [];
      }
      categoriesBySection[sectionId].push(category);
    });

    // Attach categories to sections
    return sections.map((section) => ({
      ...section,
      categories: categoriesBySection[section.section_id] || [],
    }));
  } catch (error) {
    console.error("Error loading sections with categories:", error);
    return [];
  }
};

/**
 * Get all categories (flat list)
 * This replaces DATA.categories
 * @returns {Promise<Array>} Array of all categories
 */
export const loadAllCategories = async () => {
  return loadCategories();
};

export default {
  loadSections,
  loadCategories,
  loadCategoriesForSection,
  loadCategory,
  loadSectionsWithCategories,
  loadAllCategories,
};




