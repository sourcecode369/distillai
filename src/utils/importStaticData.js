import { DATA } from "../data";
import { dbHelpers } from "../lib/supabase";

const extractIconName = (iconElement) => {
  if (!iconElement || !iconElement.type) return null;
  
  // Get the display name or name of the component
  let componentName = iconElement.type.displayName || iconElement.type.name;
  
  // For lucide-react icons, the name might be in the render function
  if (!componentName) {
    // Try to get from the component itself
    if (iconElement.type.render) {
      const renderStr = iconElement.type.render.toString();
      const match = renderStr.match(/function\s+(\w+)/);
      if (match) componentName = match[1];
    }
    
    // Fallback: try to extract from toString
    if (!componentName) {
      const str = iconElement.type.toString();
      const match = str.match(/function\s+(\w+)/);
      if (match) componentName = match[1];
    }
    
    // Another fallback: check if it's a forwardRef component
    if (!componentName && iconElement.type.$$typeof) {
      // For forwardRef components, check the render property
      const render = iconElement.type.render || iconElement.type;
      if (render && render.name) {
        componentName = render.name;
      }
    }
  }
  
  return componentName || null;
};

export const importStaticData = async (onProgress = null, onComplete = null) => {
  const results = {
    sections: { success: 0, errors: 0, details: [] },
    categories: { success: 0, errors: 0, details: [] },
  };

  try {
    // Step 1: Import sections
    const sections = DATA.sections || [];
    let sectionOrder = 0;
    // Create a map of section titles to section_ids for category mapping
    const sectionIdMap = {};
    
    for (const section of sections) {
      try {
        // Create section_id from title
        const sectionId = section.title.toLowerCase().replace(/\s+/g, "-");
        sectionIdMap[section.title] = sectionId;
        
        // Check if section already exists
        const { data: existing } = await dbHelpers.getSection(sectionId);
        
        if (existing) {
          results.sections.details.push({
            section: section.title,
            status: "skipped",
            message: "Section already exists in database",
          });
        } else {
          const sectionData = {
            section_id: sectionId,
            title: section.title,
            subtitle: section.subtitle || null,
            display_order: sectionOrder++,
          };

          const { data, error } = await dbHelpers.createSection(sectionData);

          if (error) {
            throw error;
          }

          results.sections.success++;
          results.sections.details.push({
            section: section.title,
            status: "imported",
            message: "Successfully imported",
          });
        }
      } catch (error) {
        results.sections.errors++;
        results.sections.details.push({
          section: section.title,
          status: "error",
          message: error.message || "Unknown error",
        });
      }
    }

    // Step 2: Import categories
    const categories = DATA.categories || [];
    let categoryOrder = 0;
    const categoryOrderBySection = {};

    for (const category of categories) {
      try {
        // Check if category already exists
        const { data: existing } = await dbHelpers.getCategory(category.id);
        
        if (existing) {
          results.categories.details.push({
            category: category.title,
            status: "skipped",
            message: "Category already exists in database",
          });
          continue;
        }

        // Find section for this category using the map
        let sectionId = null;
        for (const section of sections) {
          if (section.categories && section.categories.includes(category.id)) {
            sectionId = sectionIdMap[section.title];
            break;
          }
        }

        // Extract icon name
        const iconName = extractIconName(category.icon);
        if (!iconName) {
        }

        // Get display order for this section
        if (!categoryOrderBySection[sectionId || ""]) {
          categoryOrderBySection[sectionId || ""] = 0;
        }
        const displayOrder = categoryOrderBySection[sectionId || ""]++;

        const categoryData = {
          category_id: category.id,
          section_id: sectionId,
          title: category.title,
          description: category.description || null,
          icon_name: iconName || "FileText", // Default icon
          color_classes: category.color || "bg-gray-50 text-gray-600",
          display_order: displayOrder,
        };

        const { data, error } = await dbHelpers.createCategory(categoryData);

        if (error) {
          throw error;
        }

        results.categories.success++;
        results.categories.details.push({
          category: category.title,
          status: "imported",
          message: "Successfully imported",
        });

        if (onProgress) {
          onProgress(
            results.categories.success + results.categories.errors,
            categories.length,
            category.title
          );
        }
      } catch (error) {
        results.categories.errors++;
        results.categories.details.push({
          category: category.title,
          status: "error",
          message: error.message || "Unknown error",
        });
      }
    }

    if (onComplete) {
      onComplete(results);
    }

    return results;
  } catch (error) {
    console.error("Error importing static data:", error);
    if (onComplete) {
      onComplete(results);
    }
    return results;
  }
};

export const checkImportStatus = async () => {
  try {
    const { data: sections } = await dbHelpers.getAllSections();
    const { data: categories } = await dbHelpers.getAllCategories();

    const staticSectionsCount = (DATA.sections || []).length;
    const staticCategoriesCount = (DATA.categories || []).length;

    return {
      sections: {
        static: staticSectionsCount,
        database: sections?.length || 0,
        needsImport: (sections?.length || 0) < staticSectionsCount,
      },
      categories: {
        static: staticCategoriesCount,
        database: categories?.length || 0,
        needsImport: (categories?.length || 0) < staticCategoriesCount,
      },
      needsImport: (sections?.length || 0) < staticSectionsCount || (categories?.length || 0) < staticCategoriesCount,
    };
  } catch (error) {
    console.error("Error checking import status:", error);
    return {
      sections: { static: 0, database: 0, needsImport: true },
      categories: { static: 0, database: 0, needsImport: true },
      needsImport: true,
    };
  }
};

export default {
  importStaticData,
  checkImportStatus,
};

