import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const SortDropdown = ({ value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('[data-sort-dropdown-menu]')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  return (
    <>
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer hover:bg-white dark:hover:bg-slate-800 w-full text-left flex items-center justify-between"
        >
          <span>{selectedOption.label}</span>
          <ChevronDown
            size={16}
            className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          data-sort-dropdown-menu
          className="fixed bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-500/20 dark:shadow-slate-900/40 z-[9999] overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2.5 text-sm font-medium text-left transition-all duration-200 ${
                value === option.value
                  ? "bg-gradient-to-r from-indigo-50/60 via-violet-50/30 to-transparent dark:from-indigo-900/20 dark:via-violet-900/10 text-indigo-700 dark:text-indigo-300 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {value === option.value && (
                  <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

SortDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default SortDropdown;

