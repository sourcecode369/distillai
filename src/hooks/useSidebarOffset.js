import { useState, useEffect } from "react";

export const useSidebarOffset = () => {
  const [sidebarOffset, setSidebarOffset] = useState(0);

  useEffect(() => {
    const updateSidebarOffset = () => {
      // Find the main content container that has the dynamic padding classes
      const mainContainer = document.querySelector('[class*="lg:pl-72"], [class*="lg:pl-20"]');
      let paddingLeft = 0;
      
      if (mainContainer) {
        // Check the class name directly to determine sidebar state (more reliable than reading computed style during transition)
        const classList = mainContainer.className;
        if (classList.includes('lg:pl-72')) {
          // Sidebar is expanded - use 288px (72 * 4 = 288px)
          paddingLeft = 288;
        } else if (classList.includes('lg:pl-20')) {
          // Sidebar is collapsed - use 80px (20 * 4 = 80px)
          paddingLeft = 80;
        } else {
          // Fallback: read computed style
          const computedStyle = window.getComputedStyle(mainContainer);
          paddingLeft = parseInt(computedStyle.paddingLeft, 10) || 0;
        }
      } else {
        // Fallback: check sidebar element directly
        const sidebar = document.querySelector('aside');
        if (sidebar && window.innerWidth >= 1024) {
          paddingLeft = parseInt(window.getComputedStyle(sidebar).width, 10) || 0;
        }
      }
      
      // Store the sidebar offset - this determines where the progress bar starts
      // When sidebar expands (more padding), offset increases (bar gets narrower)
      // When sidebar collapses (less padding), offset decreases (bar gets wider)
      setSidebarOffset(paddingLeft);
    };

    // Initial check
    const timer = setTimeout(updateSidebarOffset, 100);
    
    // Watch for resize
    window.addEventListener('resize', updateSidebarOffset);
    
    // Watch for class changes on main container (when sidebar toggles)
    const mainContainer = document.querySelector('[class*="lg:pl-72"], [class*="lg:pl-20"]');
    let observer = null;
    
    if (mainContainer) {
      // Watch for class attribute changes and update immediately
      // The CSS transition on the progress bar will handle the smooth animation
      observer = new MutationObserver(() => {
        // Use double requestAnimationFrame to ensure we read the value after the browser applies the class change and computes the new style
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            updateSidebarOffset();
          });
        });
      });
      
      observer.observe(mainContainer, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: false
      });
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSidebarOffset);
      if (observer) observer.disconnect();
    };
  }, []);

  return sidebarOffset;
};

