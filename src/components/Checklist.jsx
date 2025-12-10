import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { CheckSquare, Square } from "lucide-react";

// Memoized checklist item component to prevent unnecessary re-renders
// Only re-renders when its own checked state or item text changes
const ChecklistItem = React.memo(({ item, isChecked, onToggle }) => {
  return (
    <li
      onClick={onToggle}
      className={`flex items-start gap-3 cursor-pointer group transition-all ${
        isChecked
          ? 'opacity-75'
          : 'hover:opacity-80'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {isChecked ? (
          <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : (
          <Square className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
        )}
      </div>
      <span className={`text-gray-700 dark:text-gray-300 leading-relaxed ${
        isChecked ? 'line-through' : ''
      }`}>
        {item}
      </span>
    </li>
  );
});

const Checklist = ({ items, title, persistKey }) => {
  const [checkedItems, setCheckedItems] = useState(() => {
    if (persistKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`checklist-${persistKey}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Use functional update to avoid needing checkedItems in dependencies
  // This prevents recreating the callback on every checkedItems change
  const toggleItem = useCallback((idx) => {
    setCheckedItems(prevChecked => {
      const newChecked = prevChecked.includes(idx)
        ? prevChecked.filter(i => i !== idx)
        : [...prevChecked, idx];
      
      // Persist to localStorage if persistKey is provided
      if (persistKey && typeof window !== 'undefined') {
        localStorage.setItem(`checklist-${persistKey}`, JSON.stringify(newChecked));
      }
      
      return newChecked;
    });
  }, [persistKey]);

  // Memoize the list items to prevent recreating on every render
  // Only recalculates when items or checkedItems change
  const listItems = useMemo(() => {
    return items.map((item, idx) => (
      <ChecklistItem
        key={idx}
        item={item}
        isChecked={checkedItems.includes(idx)}
        onToggle={() => toggleItem(idx)}
      />
    ));
  }, [items, checkedItems, toggleItem]);

  return (
    <div className="my-4 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20 border-l-4 border-green-500 dark:border-green-400">
      {title && (
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 p-2 rounded-lg bg-green-100 dark:bg-green-900/30 border border-white/60 dark:border-slate-700/60">
            <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">{title}</h4>
        </div>
      )}
      <ul className={`space-y-3 ${title ? 'ml-8' : ''}`}>
        {listItems}
      </ul>
    </div>
  );
};

ChecklistItem.propTypes = {
  item: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

Checklist.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  persistKey: PropTypes.string,
};

export default Checklist;

