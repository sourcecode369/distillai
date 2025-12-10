import React from "react";
import PropTypes from "prop-types";
import { CheckCircle2 } from "lucide-react";

// Memoized component to prevent re-renders when parent component updates
// This is a pure presentational component that only depends on steps and title props
const Steps = React.memo(({ steps, title }) => {
  return (
    <div className="my-4">
      {title && (
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h4>
      )}
      <ol className="space-y-4">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center shadow-md">
              {idx + 1}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});

Steps.displayName = 'Steps';

Steps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

export default Steps;

