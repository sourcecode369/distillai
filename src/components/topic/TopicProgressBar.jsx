import React, { memo } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const TopicProgressBar = memo(({ readingProgress, sidebarOffset }) => {
  const progressBar = (
    <div
      style={{
        position: "fixed",
        top: "64px",
        left: `${sidebarOffset}px`,
        right: 0,
        height: "4px",
        zIndex: 9999,
        backgroundColor: "rgba(17, 24, 39, 0.8)",
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 transition-all duration-200 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, readingProgress))}%` }}
      />
    </div>
  );

  return typeof document !== "undefined" ? createPortal(progressBar, document.body) : null;
});

TopicProgressBar.propTypes = {
  readingProgress: PropTypes.number.isRequired,
  sidebarOffset: PropTypes.number.isRequired,
};

TopicProgressBar.displayName = "TopicProgressBar";

export default TopicProgressBar;
