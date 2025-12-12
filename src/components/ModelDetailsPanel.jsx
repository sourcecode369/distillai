

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, Copy, ExternalLink, Database, Layers, DollarSign, Cpu, Zap, Star, Download, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Utility to copy to clipboard
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-indigo-600">
      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
    </button>
  );
};

const ModelDetailsPanel = ({ isOpen, onClose, model }) => {
  const { t } = useTranslation('common');

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !model) return null;

  const isPaid = !model.is_open_source;


  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={`fixed top-0 bottom-0 right-0 z-[100] w-full md:w-[600px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-slate-200 dark:border-slate-800`}>

        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="flex-1 pr-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/50">
                {model.category}
              </span>
              {model.is_open_source ? (
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/50">
                  <Globe size={12} strokeWidth={2.5} /> Open Source
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg flex items-center gap-1.5 border border-purple-200 dark:border-purple-800/50">
                  <Zap size={12} fill="currentColor" /> API Only
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              {model.name}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1">by <span className="text-slate-900 dark:text-white font-semibold">{model.publisher}</span></span>
              {model.parameters_display && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span>{model.parameters_display} Params</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all duration-200 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:rotate-90"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-8 space-y-10 custom-scrollbar">

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
              <div className="text-indigo-500 mb-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"><Download size={20} strokeWidth={2.5} /></div>
              <div className="font-bold text-slate-900 dark:text-white text-xl">
                {model.downloads > 1000 ? `${(model.downloads / 1000).toFixed(1)}k` : model.downloads}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Downloads</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
              <div className="text-rose-500 mb-2 p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl"><Star size={20} strokeWidth={2.5} /></div>
              <div className="font-bold text-slate-900 dark:text-white text-xl">
                {model.likes > 1000 ? `${(model.likes / 1000).toFixed(1)}k` : model.likes}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Likes</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
              <div className="text-blue-500 mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl"><Layers size={20} strokeWidth={2.5} /></div>
              <div className="font-bold text-slate-900 dark:text-white text-xl">
                {model.context_window ? `${Math.round(model.context_window / 1000)}k` : '-'}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Context</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
              <div className="text-emerald-500 mb-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"><Database size={20} strokeWidth={2.5} /></div>
              <div className="font-bold text-slate-900 dark:text-white text-xl">
                {model.created_at ? new Date(model.created_at).getFullYear() : '-'}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Released</div>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-2">Description</h3>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {model.description || model.short_description || "No description available."}
            </p>
          </div>

          {/* Pricing Section (API Models) */}
          {model.pricing && (model.pricing.prompt > 0 || model.pricing.completion > 0) && (
            <div>
              <h3 className="flex items-center gap-2.5 text-lg font-bold text-slate-900 dark:text-white mb-5">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <DollarSign size={20} strokeWidth={2.5} />
                </div>
                On-Demand Pricing
              </h3>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Operation Type</th>
                      <th className="px-6 py-4 text-right">Price per 1M Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">Input (Prompt)</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 dark:text-white text-base">
                        ${model.pricing.prompt.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">Output (Completion)</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 dark:text-white text-base">
                        ${model.pricing.completion.toFixed(2)}
                      </td>
                    </tr>
                    {model.pricing.image > 0 && (
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">Image Generation</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 dark:text-white text-base">
                          ${model.pricing.image.toFixed(3)} / img
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-2 pl-1">* Pricing may vary by provider and region.</p>
            </div>
          )}

          {/* Hardware Requirements (Local Models) */}
          {model.hardware_requirements && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
                <Cpu size={20} className="text-indigo-500" />
                Hardware Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 text-xs font-bold uppercase mb-1">Minimum VRAM</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {model.hardware_requirements.minimum_vram_gb} GB
                  </div>
                  <p className="text-xs text-slate-500 mt-1">For decent inference speed</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 text-xs font-bold uppercase mb-1">Recommended RAM</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {model.hardware_requirements.recommended_ram_gb} GB
                  </div>
                  <p className="text-xs text-slate-500 mt-1">System memory</p>
                </div>
              </div>
            </div>
          )}

          {/* Technical Specs */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
              <Database size={20} className="text-blue-500" />
              Technical Specifications
            </h3>
            <div className="space-y-4">
              {model.architecture && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Architecture</span>
                  <span className="font-medium text-slate-900 dark:text-white">{model.architecture.modality || 'Transformer'}</span>
                </div>
              )}
              {model.quantizations && model.quantizations.length > 0 && (
                <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="block text-slate-600 dark:text-slate-400 mb-2">Available Quantizations</span>
                  <div className="flex flex-wrap gap-2">
                    {model.quantizations.map(q => (
                      <span key={q} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-medium rounded text-slate-600 dark:text-slate-300">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {model.top_provider && (
                <div className="py-3 px-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
                    Top Provider Stats
                  </span>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Max Context</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {model.top_provider.context_length ? Math.round(model.top_provider.context_length / 1000) + 'k' : '-'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata ID */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Model ID: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{model.model_id}</code></span>
              <CopyButton text={model.model_id} />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-4 sticky bottom-0 z-20 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
          {(model.is_open_source || model.ollama_url) ? (
            <a
              href={model.ollama_url || model.huggingface_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-slate-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Get Model</span>
              <ExternalLink size={18} strokeWidth={2.5} />
            </a>
          ) : (
            <a
              href={model.openrouter_url || model.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Use via API</span>
              <Zap size={18} strokeWidth={2.5} fill="currentColor" />
            </a>
          )}

          <div className="flex gap-2">
            {model.huggingface_url && (
              <a
                href={model.huggingface_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-100 dark:border-amber-800/50 transition-colors flex items-center justify-center min-w-[50px]"
                title="View on HuggingFace"
              >
                <span className="text-xl">🤗</span>
              </a>
            )}
            {model.paper_url && (
              <a
                href={model.paper_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-800/50 transition-colors flex items-center justify-center min-w-[50px]"
                title="Read Research Paper"
              >
                <span className="text-xl">📄</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </>,
    document.body
  );
};

export default ModelDetailsPanel;
