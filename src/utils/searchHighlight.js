/**
 * Highlights search terms in text by wrapping matches in <mark> tags
 * 
 * Escapes special regex characters in the search query to prevent regex injection,
 * then splits the text and wraps matching parts in highlight markup.
 * 
 * @param {string} text - The text to search and highlight
 * @param {string} searchQuery - The search term to highlight
 * @returns {string|Array} Returns the original text if no query, otherwise returns an array of React elements with highlighted matches
 * 
 * @example
 * highlightSearchTerm("Hello world", "world")
 * // Returns: ["Hello ", <mark>world</mark>]
 */
export const highlightSearchTerm = (text, searchQuery) => {
  if (!searchQuery || !text) return text;

  // Escape special regex characters to prevent regex injection
  const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 px-1 rounded"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
};

/**
 * Estimates reading time based on word count
 * 
 * Uses a standard reading speed of 200 words per minute to calculate
 * the estimated time needed to read the provided text.
 * 
 * @param {string} text - The text to estimate reading time for
 * @returns {string} Formatted reading time string (e.g., "5 mins read" or "1 min read")
 * 
 * @example
 * estimateReadingTime("This is a sample text with many words...")
 * // Returns: "2 mins read"
 */
export const estimateReadingTime = (text) => {
  if (!text) return "1 min";
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min${minutes !== 1 ? 's' : ''} read`;
};



