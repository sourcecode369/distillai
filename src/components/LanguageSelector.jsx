import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ArrowRight } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

const LanguageDropdown = ({ onClose }) => {
  const { i18n, t } = useTranslation('language');
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    onClose();
  };

  return (
    <div 
      data-language-dropdown
      className="w-[calc(100vw-1rem)] sm:w-64 max-w-[calc(100vw-1rem)] sm:max-w-[16rem] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-500/20 dark:shadow-slate-900/40 z-50 flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-200/40 dark:border-slate-700/40 bg-gradient-to-r from-indigo-50/60 via-violet-50/30 to-transparent dark:from-indigo-900/20 dark:via-violet-900/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/30 shadow-sm">
            <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">{t('dropdown.title')}</h3>
        </div>
      </div>

      {/* Languages List */}
      <div className="max-h-[420px] overflow-y-auto">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`group relative px-4 py-2.5 cursor-pointer transition-all duration-300 border-b border-slate-200/30 dark:border-slate-700/30 last:border-b-0 overflow-hidden ${
              i18n.language === lang.code ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""
            } hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10`}
            onClick={(e) => {
              e.stopPropagation();
              handleLanguageChange(lang.code);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/70 to-indigo-50/0 dark:from-indigo-900/0 dark:via-indigo-900/25 dark:to-indigo-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                  i18n.language === lang.code
                    ? "bg-indigo-500 text-white group-hover:bg-indigo-600"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                }`}>
                  <Globe size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm leading-snug transition-colors duration-300 ${
                    i18n.language === lang.code
                      ? "font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                      : "font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                  }`}>
                    {lang.nativeName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {lang.name} • {lang.code.toUpperCase()}
                  </p>
                </div>
              </div>
              {i18n.language === lang.code && (
                <Check size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              )}
              {i18n.language !== lang.code && (
                <ArrowRight size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 opacity-0 group-hover:opacity-100" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

LanguageDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export { LanguageDropdown };
export default LanguageDropdown;


