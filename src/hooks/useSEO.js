import { useNavigation } from '../context/NavigationContext';

export const useSEO = () => {
  const { displayView, activeCategory, activeTopic, searchQuery } = useNavigation();

  const getSEOProps = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    switch (displayView) {
      case "landing":
        return {
          title: "Master Artificial Intelligence",
          description: "Comprehensive guides to artificial intelligence concepts, techniques, and applications. Learn AI, ML, and Data Science.",
          url: baseUrl,
        };
      case "home":
        return {
          title: "Learn AI, ML & Data Science",
          description: "Explore comprehensive handbooks on artificial intelligence, machine learning, and data science. Start your learning journey today.",
          url: `${baseUrl}/handbooks`,
        };
      case "category":
        return activeCategory ? {
          title: activeCategory.title,
          description: activeCategory.description || `Explore ${activeCategory.title} topics and learn from comprehensive guides.`,
          url: `${baseUrl}/category/${activeCategory.id}`,
          keywords: [activeCategory.title, "AI", "Machine Learning"],
        } : null;
      case "topic":
        return activeTopic && activeCategory ? {
          title: activeTopic.title,
          description: activeTopic.description || activeTopic.content?.intro || `Learn about ${activeTopic.title} in ${activeCategory.title}.`,
          type: "article",
          url: `${baseUrl}/topic/${activeCategory.id}/${activeTopic.id}`,
          image: activeTopic.content?.thumbnail || activeTopic.content?.image || "/favicon.svg",
          author: "Distill AI",
          datePublished: activeTopic.content?.created_at || activeTopic.lastUpdated,
          dateModified: activeTopic.lastUpdated || activeTopic.content?.created_at,
          keywords: [...(activeTopic.tags || []), activeTopic.difficulty, activeCategory.title, "AI", "Machine Learning"],
        } : null;
      case "quiz":
        return activeTopic && activeCategory ? {
          title: `Quiz: ${activeTopic.title}`,
          description: `Test your knowledge of ${activeTopic.title} with our interactive quiz.`,
          url: `${baseUrl}/quiz/${activeCategory.id}/${activeTopic.id}`,
        } : null;
      case "about":
        return {
          title: "About",
          description: "Learn about Distill AI - your comprehensive resource for artificial intelligence, machine learning, and data science education.",
          url: `${baseUrl}/about`,
        };
      case "profile":
        return {
          title: "My Profile",
          description: "Manage your Distill AI profile, preferences, and learning progress.",
          url: `${baseUrl}/profile`,
        };
      case "progress":
        return {
          title: "My Progress",
          description: "Track your learning progress across Distill AI topics and categories.",
          url: `${baseUrl}/progress`,
        };
      case "search-results":
        return {
          title: `Search: ${searchQuery}`,
          description: `Search results for "${searchQuery}" in Distill AI.`,
          url: `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}`,
        };
      default:
        return {
          title: "Distill AI",
          description: "Comprehensive guides to artificial intelligence concepts, techniques, and applications.",
          url: baseUrl,
        };
    }
  };

  return getSEOProps();
};
