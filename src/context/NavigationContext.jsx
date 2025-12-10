import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { dbHelpers } from '../lib/supabase';
import { loadTopic } from '../utils/topicLoader';
import { loadCategory } from '../utils/dataLoader';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [view, setView] = useState("landing");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayView, setDisplayView] = useState("landing");
  const isInitialMountRef = useRef(true);
  const prevDisplayViewRef = useRef("landing");

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear search query when navigating away from search results
  useEffect(() => {
    if (prevDisplayViewRef.current === "search-results" && displayView !== "search-results") {
      setSearchQuery("");
    }
    prevDisplayViewRef.current = displayView;
  }, [displayView]);

  // Smooth page transition handler
  const transitionToView = (newView, callback) => {
    if (isInitialMountRef.current) {
      // Skip transition on initial mount
      isInitialMountRef.current = false;
      callback();
      setDisplayView(newView);
      return;
    }

    // Start fade out - keep old view visible but fading
    setIsTransitioning(true);

    // Update state immediately (this updates activeCategory/activeTopic)
    callback();

    // Wait for fade out animation to complete (300ms)
    setTimeout(() => {
      // Now switch to new view (this will unmount old, mount new)
      // Keep isTransitioning true so new view starts hidden
      setDisplayView(newView);

      // Wait for new view to render in hidden state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Now start fade in - this will transition from opacity 0 to 1
          setTimeout(() => {
            setIsTransitioning(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 10); // Small delay to ensure render
        });
      });
    }, 300);
  };

  const handleCategorySelect = (category) => {
    transitionToView("category", () => {
      setActiveCategory(category);
      setView("category");
    });
  };

  const handleTopicSelect = (topic) => {
    transitionToView("topic", () => {
      setActiveTopic(topic);
      setView("topic");
    });
  };

  const goToLanding = () => {
    if (view === "landing") {
      return; // Already on landing, don't reload
    }
    transitionToView("landing", () => {
      setView("landing");
      setActiveCategory(null);
      setActiveTopic(null);
    });
  };

  const goToHandbooks = () => {
    if (view === "home") {
      return; // Already on handbooks, don't reload
    }
    transitionToView("home", () => {
      setView("home");
      setActiveCategory(null);
      setActiveTopic(null);
    });
  };

  const goHome = () => {
    // For backward compatibility, navigate to handbooks
    goToHandbooks();
  };

  const goToAbout = () => {
    transitionToView("about", () => {
      setView("about");
    });
  };

  const goToFAQ = () => {
    transitionToView("faq", () => {
      setView("faq");
    });
  };

  const goToContributing = () => {
    transitionToView("contributing", () => {
      setView("contributing");
    });
  };

  const goToCodeOfConduct = () => {
    transitionToView("code-of-conduct", () => {
      setView("code-of-conduct");
    });
  };

  const goToContact = () => {
    transitionToView("contact", () => {
      setView("contact");
    });
  };

  const goToProfile = () => {
    transitionToView("profile", () => {
      setView("profile");
    });
  };

  const goToProgress = () => {
    transitionToView("progress", () => {
      setView("progress");
    });
  };

  const goToNotifications = () => {
    transitionToView("notifications", () => {
      setView("notifications");
    });
  };

  const goToBookmarks = () => {
    transitionToView("bookmarks", () => {
      setView("bookmarks");
    });
  };

  const goToSearchHistory = () => {
    transitionToView("search-history", () => {
      setView("search-history");
    });
  };

  const goToWeeklyReport = () => {
    transitionToView("weekly-report", () => {
      setView("weekly-report");
    });
  };

  const goToSearchResults = (query = null) => {
    const searchTerm = query || searchQuery;
    if (searchTerm && searchTerm.trim()) {
      // If a query is provided, set it first
      if (query) {
        setSearchQuery(query);
      }
      transitionToView("search-results", () => {
        setView("search-results");
      });
    }
  };

  const goToAdmin = (user, isAdmin) => {
    // Check if user is admin before navigating
    if (!user || !isAdmin) {
      // Don't navigate if not admin
      return;
    }
    transitionToView("admin", () => {
      setView("admin");
    });
  };

  const goBackToCategory = () => {
    transitionToView("category", () => {
      setView("category");
      setActiveTopic(null);
    });
  };

  const handleBookmarkClick = async (bookmark) => {
    // Load category from database
    const category = await loadCategory(bookmark.categoryId);
    if (category) {
      const targetView = bookmark.topicId ? "topic" : "category";
      transitionToView(targetView, async () => {
        // Ensure category has id property for compatibility
        setActiveCategory({ ...category, id: category.category_id });
        if (bookmark.topicId) {
          // Load topic from database
          const topic = await loadTopic(bookmark.categoryId, bookmark.topicId);
          if (topic) {
            setActiveTopic(topic);
            setView("topic");
          } else {
            setView("category");
          }
        } else {
          setView("category");
        }
      });
    }
  };

  const value = {
    view,
    setView,
    activeCategory,
    setActiveCategory,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    showScrollTop,
    isTransitioning,
    displayView,
    transitionToView,
    handleCategorySelect,
    handleTopicSelect,
    goToLanding,
    goToHandbooks,
    goHome,
    goToAbout,
    goToFAQ,
    goToContributing,
    goToCodeOfConduct,
    goToContact,
    goToProfile,
    goToProgress,
    goToNotifications,
    goToBookmarks,
    goToSearchHistory,
    goToWeeklyReport,
    goToSearchResults,
    goToAdmin,
    goBackToCategory,
    handleBookmarkClick,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
