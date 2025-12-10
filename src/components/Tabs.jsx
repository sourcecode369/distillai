import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Tabs = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tabListRef = useRef(null);

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    let newIndex = index;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        setActiveTab(newIndex);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        setActiveTab(newIndex);
        break;
      case 'Home':
        e.preventDefault();
        setActiveTab(0);
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        setActiveTab(tabs.length - 1);
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    
    // Focus the newly active tab
    if (tabListRef.current) {
      const tabButtons = tabListRef.current.querySelectorAll('[role="tab"]');
      tabButtons[newIndex]?.focus();
    }
  };

  return (
    <div className="my-4">
      <div 
        ref={tabListRef}
        className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto"
        role="tablist"
        aria-label="Tabs"
      >
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            role="tab"
            aria-selected={activeTab === idx}
            aria-controls={`tabpanel-${idx}`}
            id={`tab-${idx}`}
            tabIndex={activeTab === idx ? 0 : -1}
            className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              activeTab === idx
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div 
        className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  defaultTab: PropTypes.number,
};

export default Tabs;



