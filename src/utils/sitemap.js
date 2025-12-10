/**
 * Sitemap Generation Utility
 * Generates sitemap.xml for SEO
 */

import { dbHelpers } from "../lib/supabase";

/**
 * Generate sitemap XML string
 * @param {string} baseUrl - Base URL of the site (e.g., "https://aihandbooks.com")
 * @returns {Promise<string>} Sitemap XML string
 */
export const generateSitemap = async (baseUrl = "https://robuildsai.com") => {
  const urls = [];
  const currentDate = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { url: "", priority: 1.0, changefreq: "daily" },
    { url: "/handbooks", priority: 0.9, changefreq: "daily" },
    { url: "/about", priority: 0.7, changefreq: "monthly" },
    { url: "/faq", priority: 0.6, changefreq: "monthly" },
    { url: "/contact", priority: 0.6, changefreq: "monthly" },
    { url: "/contributing", priority: 0.5, changefreq: "monthly" },
    { url: "/code-of-conduct", priority: 0.5, changefreq: "monthly" },
  ];

  staticPages.forEach((page) => {
    urls.push({
      loc: `${baseUrl}${page.url}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  try {
    // Get all topics from database
    const { data: topics, error } = await dbHelpers.getAllTopics();

    if (!error && topics && topics.length > 0) {
      // Group topics by category
      const topicsByCategory = {};
      topics.forEach((topic) => {
        const categoryId = topic.category_id;
        if (!topicsByCategory[categoryId]) {
          topicsByCategory[categoryId] = [];
        }
        topicsByCategory[categoryId].push(topic);
      });

      // Add category pages
      Object.keys(topicsByCategory).forEach((categoryId) => {
        urls.push({
          loc: `${baseUrl}/category/${categoryId}`,
          lastmod: currentDate,
          changefreq: "weekly",
          priority: 0.8,
        });

        // Add topic pages
        topicsByCategory[categoryId].forEach((topic) => {
          const lastmod = topic.updated_at
            ? new Date(topic.updated_at).toISOString().split("T")[0]
            : currentDate;

          urls.push({
            loc: `${baseUrl}/topic/${categoryId}/${topic.topic_id}`,
            lastmod,
            changefreq: "monthly",
            priority: 0.7,
          });
        });
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Continue with static pages even if database fetch fails
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
};

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
const escapeXml = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

/**
 * Generate sitemap and return as response (for API endpoint)
 * @param {Request} request - Request object (for getting base URL)
 * @returns {Promise<Response>} Response with sitemap XML
 */
export const generateSitemapResponse = async (request) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const sitemap = await generateSitemap(baseUrl);

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
};


