import { useEffect } from "react";

/**
 * Custom hook to add scroll-triggered fade-in animations to sections
 * @param {Object} topic - The topic object containing sections
 */
export const useScrollAnimation = (topic) => {
  useEffect(() => {
    if (!topic) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all section wrappers
    const sectionSelectors = [
      '#overview',
      '#video',
      '#resources',
      '#whats-next',
      ...topic.content.sections.map((_, i) => `#section-${i}`)
    ].filter(Boolean);

    const sections = sectionSelectors
      .map(selector => document.querySelector(selector))
      .filter(Boolean);

    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [topic]);
};

