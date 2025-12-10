import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within a AuthModalProvider');
  }
  return context;
};

export const AuthModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAutoSignupTriggered, setIsAutoSignupTriggered] = useState(false);

  const openLogin = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const closeLogin = () => {
    setIsLoginModalOpen(false);
    setIsAutoSignupTriggered(false);
  };

  const openSignup = (triggeredByAuto = false) => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
    if (triggeredByAuto) {
      setIsAutoSignupTriggered(true);
    }
  };

  const closeSignup = () => {
    setIsSignupModalOpen(false);
    setIsAutoSignupTriggered(false);
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
    // Keep isAutoSignupTriggered state as is, or reset? 
    // Usually if switching from login, it might not be auto-triggered anymore, 
    // but let's reset it to be safe unless we want to persist the "promo" message.
    // The original code did: setIsAutoSignupTriggered(false);
    setIsAutoSignupTriggered(false);
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
    setIsAutoSignupTriggered(false);
  };

  const value = {
    isLoginModalOpen,
    isSignupModalOpen,
    isAutoSignupTriggered,
    openLogin,
    closeLogin,
    openSignup,
    closeSignup,
    switchToSignup,
    switchToLogin,
    setIsLoginModalOpen, // Expose setters if direct manipulation is needed, but prefer handlers
    setIsSignupModalOpen,
    setIsAutoSignupTriggered
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};
