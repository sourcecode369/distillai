/**
 * Import Static Weekly Reports to Database
 * 
 * This utility imports weekly reports from a static JSON file into the Supabase database.
 * 
 * Usage:
 * - Call from Admin Dashboard (one-click import button)
 * - Or run as a standalone script
 */

import { dbHelpers } from "../lib/supabase";
import weeklyReportsData from "../data/weekly-reports.json";

/**
 * Import all static weekly reports to database
 * @param {Function} onProgress - Callback for progress updates (current, total, reportTitle)
 * @param {Function} onComplete - Callback when import completes (successCount, errorCount, errors)
 * @returns {Promise<{success: number, errors: number, details: Array}>}
 */
export const importStaticWeeklyReports = async (onProgress = null, onComplete = null) => {
  const results = {
    success: 0,
    errors: 0,
    details: [],
  };

  try {
    // Get all reports from static JSON file
    const allStaticReports = weeklyReportsData || [];

    const total = allStaticReports.length;
    let processed = 0;

    // Process each report
    for (const report of allStaticReports) {
      try {
        // Check if report already exists in database (by week_start_date)
        const { data: existing } = await dbHelpers.getWeeklyReportByDate(report.week_start_date);

        if (existing) {
          // Report already exists, skip it
          results.details.push({
            report: report.title,
            week: report.week_start_date,
            status: "skipped",
            message: "Weekly report already exists in database",
          });
        } else {
          // Import new report
          const reportData = {
            week_start_date: report.week_start_date,
            week_end_date: report.week_end_date,
            week_number: report.week_number || null,
            title: report.title,
            summary: report.summary,
            tags: report.tags || [],
            content: report.content || null,
            published: report.published !== undefined ? report.published : true,
          };

          const { data, error } = await dbHelpers.createWeeklyReport(reportData);

          if (error) {
            throw error;
          }

          results.success++;
          results.details.push({
            report: report.title,
            week: report.week_start_date,
            status: "imported",
            message: "Successfully imported",
          });
        }

        processed++;
        if (onProgress) {
          onProgress(processed, total, report.title);
        }
      } catch (error) {
        results.errors++;
        results.details.push({
          report: report.title || `Week ${report.week_start_date}`,
          week: report.week_start_date,
          status: "error",
          message: error.message || "Unknown error",
          error: error,
        });
        console.error(`Error importing weekly report for week "${report.week_start_date}":`, error);
        processed++;
        if (onProgress) {
          onProgress(processed, total, report.title || `Week ${report.week_start_date}`);
        }
      }
    }

    if (onComplete) {
      onComplete(results.success, results.errors, results.details);
    }

    return results;
  } catch (error) {
    console.error("Fatal error during import:", error);
    if (onComplete) {
      onComplete(results.success, results.errors, results.details);
    }
    throw error;
  }
};

/**
 * Check if static weekly reports have been imported
 * @returns {Promise<{imported: boolean, count: number}>}
 */
export const checkWeeklyReportsImportStatus = async () => {
  try {
    const { data: dbReports } = await dbHelpers.getAllWeeklyReports();
    const staticReports = weeklyReportsData || [];

    const importedCount = dbReports?.length || 0;
    const staticCount = staticReports.length;

    return {
      imported: importedCount > 0,
      importedCount,
      staticCount,
      needsImport: staticCount > importedCount,
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
  importStaticWeeklyReports,
  checkWeeklyReportsImportStatus,
};

