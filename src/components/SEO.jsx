import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * SEO Component
 * Manages dynamic meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */
const SEO = ({
  title,
  description,
  type = "website",
  url,
  image,
  author,
  datePublished,
  dateModified,
  keywords,
}) => {
  const siteName = "Distill AI";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = url ? (url.startsWith("http") ? url : `${siteUrl}${url}`) : siteUrl;
  const fullImage = image
    ? (image.startsWith("http") ? image : `${siteUrl}${image}`)
    : `${siteUrl}/favicon.svg`; // Fallback image

  // Default values
  const defaultTitle = `${siteName} - Learn AI, ML & Data Science`;
  const defaultDescription =
    "Comprehensive guides to artificial intelligence concepts, techniques, and applications.";

  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;

  useEffect(() => {
    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;

      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic meta tags (title is handled by document.title, not meta tag)
    updateMetaTag("description", finalDescription);

    // Open Graph tags
    updateMetaTag("og:title", finalTitle, true);
    updateMetaTag("og:description", finalDescription, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", fullUrl, true);
    updateMetaTag("og:image", fullImage, true);
    updateMetaTag("og:site_name", siteName, true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", finalTitle);
    updateMetaTag("twitter:description", finalDescription);
    updateMetaTag("twitter:image", fullImage);

    // Keywords
    if (keywords && keywords.length > 0) {
      updateMetaTag("keywords", keywords.join(", "));
    }

    // Update document title
    document.title = finalTitle;

    // Cleanup function (optional - for when component unmounts)
    return () => {
      // We don't remove meta tags on unmount to avoid flickering
      // The next page's SEO component will update them
    };
  }, [finalTitle, finalDescription, type, fullUrl, fullImage, keywords]);

  // JSON-LD structured data
  useEffect(() => {
    // Remove existing JSON-LD script if any
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Only add JSON-LD for article/course pages
    if (type === "article" || type === "Course") {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": type === "article" ? "Article" : "Course",
        headline: title || defaultTitle,
        description: finalDescription,
        url: fullUrl,
        ...(image && { image: fullImage }),
        ...(author && {
          author: {
            "@type": "Person",
            name: author,
          },
        }),
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        publisher: {
          "@type": "Organization",
          name: siteName,
          ...(image && { logo: { "@type": "ImageObject", url: fullImage } }),
        },
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);

      return () => {
        // Cleanup on unmount
        const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [type, title, finalDescription, fullUrl, fullImage, author, datePublished, dateModified, defaultTitle]);

  return null; // This component doesn't render anything
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(["website", "article", "Course"]),
  url: PropTypes.string,
  image: PropTypes.string,
  author: PropTypes.string,
  datePublished: PropTypes.string,
  dateModified: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
};

export default SEO;

