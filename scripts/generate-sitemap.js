import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://distillai.dev";
const OUTPUT = resolve(__dirname, "../public/sitemap.xml");

// Static routes with their priorities and change frequencies
const staticRoutes = [
  { path: "/",              priority: "1.0", changefreq: "weekly"  },
  { path: "/handbooks",     priority: "0.9", changefreq: "weekly"  },
  { path: "/about",         priority: "0.6", changefreq: "monthly" },
  { path: "/faq",           priority: "0.6", changefreq: "monthly" },
  { path: "/contact",       priority: "0.5", changefreq: "monthly" },
];

const today = new Date().toISOString().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(OUTPUT, xml, "utf8");
console.log(`✓ Sitemap generated → public/sitemap.xml (${staticRoutes.length} URLs)`);
