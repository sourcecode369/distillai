import React from "react";
import PropTypes from "prop-types";

// Memoized component to prevent re-renders when parent component updates
// This is a pure presentational component that only depends on data and headers props
// Tables can be expensive to render, especially with many rows, so memoization helps
const Table = React.memo(({ data, headers }) => {
  return (
    <div className="my-4 w-full overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full max-w-full lg:max-w-5xl lg:mx-auto">
        <div className="rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20 overflow-hidden">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-100/60 dark:bg-slate-800/90 border-b border-slate-200/60 dark:border-slate-700/60">
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border-b border-slate-200/60 dark:border-slate-700/60 transition-colors ${
                    rowIdx % 2 === 0
                      ? "bg-white dark:bg-slate-800"
                      : "bg-slate-50/50 dark:bg-slate-800/50"
                  } hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20`}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node])
    )
  ).isRequired,
  headers: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  ).isRequired,
};

export default Table;

