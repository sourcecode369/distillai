import i18n from '../i18n/config';

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

