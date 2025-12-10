import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items, className = "" }) => {
  const { t } = useTranslation("common");

  return (
    <nav
      className={`flex items-center gap-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="group flex items-center gap-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium relative"
        aria-label={t("breadcrumbs.goToHome", { defaultValue: "Go to home" })}
      >
        <Home size={16} className="group-hover:scale-110 transition-transform" />
        <span className="relative">
          {t("breadcrumbs.home", { defaultValue: "Home" })}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all duration-300 ease-out"></span>
        </span>
      </Link>
      {items && items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight
            size={14}
            className="text-gray-400 dark:text-slate-500 flex-shrink-0"
            strokeWidth={2.5}
          />
          {index === items.length - 1 ? (
            <span className="text-gray-900 dark:text-slate-200 font-semibold">
              {item.label}
            </span>
          ) : (
            item.to ? (
              <Link
                to={item.to}
                className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium relative group"
              >
                <span className="relative">
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all duration-300 ease-out"></span>
                </span>
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-slate-400 font-medium">
                {item.label}
              </span>
            )
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};

export default Breadcrumbs;
