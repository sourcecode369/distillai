/**
 * Translation helper for sections and categories
 * Translates section and category titles/descriptions based on their IDs
 */

import i18n from '../i18n/config';

/**
 * Get translated section data
 * @param {Object} section - Section object with section_id, title, subtitle
 * @param {Function} t - Translation function (optional, will use i18n if not provided)
 * @returns {Object} Section with translated title and subtitle
 */
export const translateSection = (section, t = null) => {
  if (!section || !section.section_id) return section;
  
  const translationFn = t || i18n.getFixedT(i18n.language, 'handbook');
  const sectionId = section.section_id.toLowerCase().replace(/\s+/g, '-');
  
  const translatedTitle = translationFn(`sections.${sectionId}.title`, { defaultValue: section.title });
  const translatedSubtitle = translationFn(`sections.${sectionId}.subtitle`, { defaultValue: section.subtitle });
  
  return {
    ...section,
    title: translatedTitle,
    subtitle: translatedSubtitle || section.subtitle,
  };
};

/**
 * Get translated category data
 * @param {Object} category - Category object with category_id, title, description
 * @param {Function} t - Translation function (optional, will use i18n if not provided)
 * @returns {Object} Category with translated title and description
 */
export const translateCategory = (category, t = null) => {
  if (!category || !category.category_id) return category;
  
  const translationFn = t || i18n.getFixedT(i18n.language, 'handbook');
  const categoryId = category.category_id;
  
  const translatedTitle = translationFn(`categories.${categoryId}.title`, { defaultValue: category.title });
  const translatedDescription = translationFn(`categories.${categoryId}.description`, { defaultValue: category.description });
  
  return {
    ...category,
    title: translatedTitle,
    description: translatedDescription || category.description,
  };
};

/**
 * Translate all sections with their categories
 * @param {Array} sections - Array of sections with categories
 * @param {Function} t - Translation function (optional, will use i18n if not provided)
 * @returns {Array} Translated sections
 */
export const translateSectionsWithCategories = (sections, t = null) => {
  if (!Array.isArray(sections)) return sections;
  
  const translationFn = t || i18n.getFixedT(i18n.language, 'handbook');
  
  return sections.map(section => {
    const translatedSection = translateSection(section, translationFn);
    
    if (Array.isArray(section.categories)) {
      translatedSection.categories = section.categories.map(cat => translateCategory(cat, translationFn));
    }
    
    return translatedSection;
  });
};

export default {
  translateSection,
  translateCategory,
  translateSectionsWithCategories,
};

