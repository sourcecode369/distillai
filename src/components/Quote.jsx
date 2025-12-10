import React from "react";
import PropTypes from "prop-types";
import { Quote as QuoteIcon } from "lucide-react";

const Quote = ({ text, author, source }) => {
  return (
    <blockquote className="my-4 pl-6 border-l-4 border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 py-4 rounded-r-lg">
      <div className="flex items-start gap-3">
        <QuoteIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed italic">
            "{text}"
          </p>
          {(author || source) && (
            <footer className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {author && <cite className="font-semibold not-italic">{author}</cite>}
              {author && source && <span className="mx-2">•</span>}
              {source && <span>{source}</span>}
            </footer>
          )}
        </div>
      </div>
    </blockquote>
  );
};

Quote.propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.string,
  source: PropTypes.string,
};

export default Quote;



