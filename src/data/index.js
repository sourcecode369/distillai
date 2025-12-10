/**
 * Main Content Aggregator
 *
 * This file aggregates all content from section files and maintains
 * the same DATA structure for backward compatibility.
 */

// Import all sections
import {
  coreAIFieldsSection,
  coreAIFieldsCategories,
} from "./sections/core-ai-fields.jsx";
import {
  dataTypesSection,
  dataTypesCategories,
} from "./sections/data-types.jsx";
import {
  autonomousSystemsSection,
  autonomousSystemsCategories,
} from "./sections/autonomous-systems.jsx";
import {
  optimizationSection,
  optimizationCategories,
} from "./sections/optimization.jsx";
import {
  advancedAlgorithmsSection,
  advancedAlgorithmsCategories,
} from "./sections/advanced-algorithms.jsx";
import {
  trustworthyAISection,
  trustworthyAICategories,
} from "./sections/trustworthy-ai.jsx";
import {
  domainSpecificSection,
  domainSpecificCategories,
} from "./sections/domain-specific.jsx";
import {
  deepLearningFrameworksSection,
  deepLearningFrameworksCategories,
} from "./sections/dl-frameworks.jsx";
import {
  mlLibrariesSection,
  mlLibrariesCategories,
} from "./sections/ml-libraries.jsx";
import {
  programmingLanguagesSection,
  programmingLanguagesCategories,
} from "./sections/programming-languages.jsx";
import {
  modelDeploymentSection,
  modelDeploymentCategories,
} from "./sections/model-deployment.jsx";
import {
  mlopsToolsSection,
  mlopsToolsCategories,
} from "./sections/mlops-tools.jsx";
import {
  dataVisualizationSection,
  dataVisualizationCategories,
} from "./sections/data-visualization.jsx";
import {
  cloudMLPlatformsSection,
  cloudMLPlatformsCategories,
} from "./sections/cloud-ml-platforms.jsx";
import {
  dataProcessingSection,
  dataProcessingCategories,
} from "./sections/data-processing.jsx";
import {
  autoMLSection,
  autoMLCategories,
} from "./sections/automl-platforms.jsx";
import {
  modelMonitoringSection,
  modelMonitoringCategories,
} from "./sections/model-monitoring.jsx";
import {
  devEnvironmentsSection,
  devEnvironmentsCategories,
} from "./sections/dev-environments.jsx";
import {
  distributedTrainingSection,
  distributedTrainingCategories,
} from "./sections/distributed-training.jsx";

// Validate imports
if (!coreAIFieldsSection || !coreAIFieldsCategories) {
  console.error(
    "Failed to import coreAIFieldsSection or coreAIFieldsCategories"
  );
}
if (!dataTypesSection || !dataTypesCategories) {
  console.error("Failed to import dataTypesSection or dataTypesCategories");
}

/**
 * Aggregated content data
 * Maintains the same structure as the original DATA object
 */
export const DATA = {
  sections: [
    coreAIFieldsSection,
    dataTypesSection,
    autonomousSystemsSection,
    optimizationSection,
    advancedAlgorithmsSection,
    trustworthyAISection,
    domainSpecificSection,
    deepLearningFrameworksSection,
    mlLibrariesSection,
    programmingLanguagesSection,
    modelDeploymentSection,
    mlopsToolsSection,
    dataVisualizationSection,
    cloudMLPlatformsSection,
    dataProcessingSection,
    autoMLSection,
    modelMonitoringSection,
    devEnvironmentsSection,
    distributedTrainingSection,
  ],
  categories: [
    ...coreAIFieldsCategories,
    ...dataTypesCategories,
    ...autonomousSystemsCategories,
    ...optimizationCategories,
    ...advancedAlgorithmsCategories,
    ...trustworthyAICategories,
    ...domainSpecificCategories,
    ...deepLearningFrameworksCategories,
    ...mlLibrariesCategories,
    ...programmingLanguagesCategories,
    ...modelDeploymentCategories,
    ...mlopsToolsCategories,
    ...dataVisualizationCategories,
    ...cloudMLPlatformsCategories,
    ...dataProcessingCategories,
    ...autoMLCategories,
    ...modelMonitoringCategories,
    ...devEnvironmentsCategories,
    ...distributedTrainingCategories,
  ],
};

// Debug: Log DATA structure
console.log("DATA loaded:", {
  sectionsCount: DATA.sections.length,
  categoriesCount: DATA.categories.length,
  sections: DATA.sections.map((s) => s.title),
});

// Export for convenience
export default DATA;
