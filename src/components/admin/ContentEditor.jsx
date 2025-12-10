import React, { useState } from "react";
import PropTypes from "prop-types";
import { Code, Eye, Save, AlertCircle } from "lucide-react";
import Button from "../Button";

const ContentEditor = ({ content, onChange, onSave }) => {
  const [isJsonMode, setIsJsonMode] = useState(true);
  const [jsonContent, setJsonContent] = useState(JSON.stringify(content || {}, null, 2));
  const [jsonError, setJsonError] = useState(null);

  const handleJsonChange = (value) => {
    setJsonContent(value);
    try {
      const parsed = JSON.parse(value);
      setJsonError(null);
      if (onChange) {
        onChange(parsed);
      }
    } catch (error) {
      setJsonError(error.message);
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (onSave) {
        onSave(parsed);
      }
    } catch (error) {
      setJsonError(error.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsJsonMode(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isJsonMode
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            <Code size={16} className="inline mr-2" />
            JSON Editor
          </button>
          <button
            type="button"
            onClick={() => setIsJsonMode(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              !isJsonMode
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            Preview
          </button>
        </div>
        {onSave && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!!jsonError}
            icon={Save}
            iconPosition="left"
          >
            Save Content
          </Button>
        )}
      </div>

      {/* JSON Editor Mode */}
      {isJsonMode && (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={jsonContent}
              onChange={(e) => handleJsonChange(e.target.value)}
              className={`w-full h-96 p-4 font-mono text-sm border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 transition-all resize-none ${
                jsonError
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
              spellCheck={false}
            />
          </div>
          {jsonError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                    JSON Syntax Error
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 font-mono">{jsonError}</p>
                </div>
              </div>
            </div>
          )}
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              <strong>Tip:</strong> Edit the JSON structure directly. The content object can include:
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li><code>intro</code> - Introduction text</li>
                <li><code>prerequisites</code> - Array of prerequisite strings</li>
                <li><code>learningObjectives</code> - Array of learning objective strings</li>
                <li><code>sections</code> - Array of section objects with title, bodyText, images, equations, code, etc.</li>
                <li><code>quiz</code> - Array of quiz question objects</li>
              </ul>
            </p>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {!isJsonMode && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {content?.intro && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                <p className="text-slate-700 dark:text-slate-300">{content.intro}</p>
              </div>
            )}
            {content?.prerequisites && content.prerequisites.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-1">
                  {content.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="text-slate-700 dark:text-slate-300">{prereq}</li>
                  ))}
                </ul>
              </div>
            )}
            {content?.sections && content.sections.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Sections</h3>
                {content.sections.map((section, idx) => (
                  <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {section.title || `Section ${idx + 1}`}
                    </h4>
                    {section.bodyText && (
                      <p className="text-slate-700 dark:text-slate-300 mb-2">{section.bodyText}</p>
                    )}
                    {section.image && (
                      <div className="my-2">
                        <img
                          src={section.image.src}
                          alt={section.image.alt || ""}
                          className="max-w-full rounded-lg"
                        />
                        {section.image.caption && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">
                            {section.image.caption}
                          </p>
                        )}
                      </div>
                    )}
                    {section.equations && section.equations.length > 0 && (
                      <div className="my-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        {section.equations.map((eq, eqIdx) => (
                          <div key={eqIdx} className="font-mono text-sm">
                            {eq.equation}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {(!content || Object.keys(content).length === 0) && (
              <p className="text-slate-500 dark:text-slate-400 italic">
                No content to preview. Add content in JSON editor mode.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ContentEditor.propTypes = {
  content: PropTypes.object,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
};

export default ContentEditor;

