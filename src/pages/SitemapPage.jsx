import { useEffect } from "react";
import { generateSitemap } from "../utils/sitemap";

/**
 * Sitemap Page
 * Serves sitemap.xml for SEO crawlers
 * This page should be accessible at /sitemap.xml
 */
const SitemapPage = () => {
  useEffect(() => {
    const generateAndServe = async () => {
      const baseUrl = window.location.origin;
      const sitemap = await generateSitemap(baseUrl);

      // Set content type and serve XML
      const blob = new Blob([sitemap], { type: "application/xml" });
      const url = URL.createObjectURL(blob);

      // For SEO crawlers, we want to redirect to the XML content
      // In a real deployment, this should be handled server-side
      // For now, we'll display it and set proper headers via meta refresh or direct serve
      window.location.href = url;
    };

    generateAndServe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Generating Sitemap...</h1>
        <p className="text-gray-600 dark:text-slate-400">
          Please wait while we generate your sitemap.
        </p>
      </div>
    </div>
  );
};

export default SitemapPage;


