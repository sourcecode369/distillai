import React, { memo } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

/**
 * Progress bar component that displays reading progress
 * Rendered via portal to ensure it's always on top
 * Memoized to prevent unnecessary re-renders
 */
const TopicProgressBar = memo(({ readingProgress, sidebarOffset, darkMode }) => {
  const progressBar = (
    <div 
      className="fixed top-16 h-1.5 pointer-events-none transition-all duration-500"
      style={{ 
        position: 'fixed',
        top: '64px',
        left: `${sidebarOffset}px`,
        right: 0,
        height: '6px',
        zIndex: 9999,
        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(226, 232, 240, 0.8)'
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-200 ease-out shadow-lg shadow-indigo-500/50"
        style={{ 
          width: `${Math.max(0, Math.min(100, readingProgress))}%`
        }}
      />
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(progressBar, document.body) : null;
});

TopicProgressBar.propTypes = {
  readingProgress: PropTypes.number.isRequired,
  sidebarOffset: PropTypes.number.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

TopicProgressBar.displayName = 'TopicProgressBar';

export default TopicProgressBar;

