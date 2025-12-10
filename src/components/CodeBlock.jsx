import React, { useState } from "react";
import PropTypes from "prop-types";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ code, language = "python" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group mt-4 mb-2 w-full overflow-x-auto">
      <div className="min-w-full max-w-full lg:max-w-5xl lg:mx-auto">
        <div className="rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 bg-slate-900 dark:bg-slate-950 shadow-lg shadow-slate-500/5 dark:shadow-slate-900/20">
          <div className="flex items-center justify-between gap-2 px-5 py-3 bg-slate-800/80 dark:bg-slate-900/80 border-b border-slate-700/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {language}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/80 dark:bg-slate-800/80 text-white text-xs font-medium hover:bg-slate-600 dark:hover:bg-slate-700 transition-all backdrop-blur-sm border border-slate-600/50 dark:border-slate-700/50"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-6 overflow-x-auto">
            <code className="text-sm leading-[1.7] text-slate-100 font-mono" style={{ letterSpacing: '0.01em' }}>
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
};

export default CodeBlock;

