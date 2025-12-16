/**
 * Build-time Sitemap Generator
 * 
 * This script generates a static sitemap.xml file during build.
 * Run this script before building: node scripts/generate-sitemap.js
 * 
 * Note: This requires Supabase environment variables to be set.
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = join(__dirname, "..", ".env");
  const envLocalPath = join(__dirname, "..", ".env.local");
  
  // Try .env.local first, then .env
  const envFile = existsSync(envLocalPath) ? envLocalPath : 
                  existsSync(envPath) ? envPath : null;
  
  if (envFile) {
    const envContent = readFileSync(envFile, "utf8");
    const lines = envContent.split("\n");
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      // Skip comments and empty lines
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    });
  }
}

// Load .env file
loadEnvFile();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set");
  console.error("\nPlease create a .env file in the project root with:");
  console.error("  VITE_SUPABASE_URL=your_supabase_url");
  console.error("  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key");
  console.error("\nOr set them as environment variables before running the script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const baseUrl = process.env.SITE_URL || "https://aihandbooks.com";
const currentDate = new Date().toISOString().split("T")[0];

async function generateSitemap() {
  const urls = [];

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
    const { data: topics, error } = await supabase
      .from("topics")
      .select("category_id, topic_id, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching topics:", error);
    } else if (topics && topics.length > 0) {
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

    console.log(`Generated sitemap with ${urls.length} URLs`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  // Generate XML
  const escapeXml = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

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

  // Write to public folder
  const publicDir = join(__dirname, "..", "public");
  const sitemapPath = join(publicDir, "sitemap.xml");
  writeFileSync(sitemapPath, xml, "utf8");

  console.log(`Sitemap written to ${sitemapPath}`);
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});

