import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import PropTypes from 'prop-types';

const CustomDropdown = ({
  value,
  onChange,
  options,
  icon: Icon,
  placeholder = 'Select...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md text-slate-900 dark:text-white font-medium"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && <Icon className="text-slate-400 dark:text-slate-500 shrink-0" size={18} />}
          <span className="text-sm whitespace-nowrap truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={18}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-80 overflow-y-auto py-1.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-150 ${isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                    }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check className="text-indigo-600 dark:text-indigo-400" size={16} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

CustomDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  icon: PropTypes.elementType,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default CustomDropdown;
