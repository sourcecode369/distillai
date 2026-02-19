import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  // Initialize from localStorage, default to false (closed)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('desktopSidebarOpen');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Save to localStorage whenever desktop sidebar state changes
  useEffect(() => {
    localStorage.setItem('desktopSidebarOpen', JSON.stringify(isDesktopSidebarOpen));
  }, [isDesktopSidebarOpen]);

  const toggleDesktop = () => setIsDesktopSidebarOpen(prev => !prev);
  const toggleMobile = () => setIsMobileSidebarOpen(prev => !prev);
  const closeMobile = () => setIsMobileSidebarOpen(false);
  const openDesktop = () => setIsDesktopSidebarOpen(true);

  const value = {
    isDesktopSidebarOpen,
    setIsDesktopSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    toggleDesktop,
    toggleMobile,
    closeMobile,
    openDesktop
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
