import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
