import { useState, useEffect, useRef } from "react";

export const useReadingProgress = (topic) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const calculateProgress = () => {
      // Find the start of the article content (overview section)
      const overviewSection = document.getElementById('overview');
      // Find the end of the article content (feedback section or resources as fallback)
      const feedbackSection = document.getElementById('feedback-section');
      const resourcesSection = document.getElementById('resources');
      const contentEnd = feedbackSection || resourcesSection;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      
      if (overviewSection && contentEnd) {
        // Get positions relative to document
        const contentStart = overviewSection.offsetTop;
        const contentEndPosition = contentEnd.offsetTop + contentEnd.offsetHeight;
        
        // Calculate progress based on article content only
        const contentHeight = contentEndPosition - contentStart;
        const scrollableHeight = contentHeight - windowHeight;
        
        // Progress from 0 to 100% as user scrolls through article
        const scrolled = Math.max(0, scrollTop - contentStart + 64); // Add offset for navbar (64px)
        const progress = scrollableHeight > 0 ? (scrolled / scrollableHeight) * 100 : 0;
        
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } else if (overviewSection) {
        // Fallback: calculate based on overview to end of document
        const contentStart = overviewSection.offsetTop;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollableHeight = documentHeight - contentStart - windowHeight;
        const scrolled = Math.max(0, scrollTop - contentStart + 64);
        const progress = scrollableHeight > 0 ? (scrolled / scrollableHeight) * 100 : 0;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } else if (contentRef.current) {
        // Fallback: use main content container
        const mainContent = contentRef.current;
        const contentStart = mainContent.offsetTop;
        const contentHeight = mainContent.scrollHeight;
        const scrollableHeight = contentHeight - windowHeight;
        const scrolled = Math.max(0, scrollTop - contentStart + 64);
        const progress = scrollableHeight > 0 ? (scrolled / scrollableHeight) * 100 : 0;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    // Use requestAnimationFrame for smoother updates
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        calculateProgress();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", calculateProgress, { passive: true });
    
    // Initial call - wait for DOM to be ready
    const timer = setTimeout(calculateProgress, 100);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", calculateProgress);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [topic]);

  return { readingProgress, contentRef };
};

