import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  X, Check, Copy, ExternalLink, Database, Layers, DollarSign, Cpu,
  Zap, Star, Download, Globe, AlertCircle, Loader2, Code,
  HardDrive, Gauge, Sparkles, CheckCircle, Info, BarChart3, FileText,
  BookOpen, Scale, Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Skeleton from './Skeleton';

// Utility to copy to clipboard
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-indigo-600"
    >
      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
    </button>
  );
};

// Debug section to show extracted data and Gemini response
const DebugSection = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Code size={14} />
          Debug: View Extracted Data & Gemini Response
        </span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {/* Full Gemini Response */}
          <div className="rounded-lg overflow-hidden border border-amber-200 dark:border-amber-800">
            <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 flex justify-between items-center">
              <span>🤖 Gemini Generated Response</span>
              <CopyButton text={JSON.stringify(data, null, 2)} />
            </div>
            <div className="p-3 bg-amber-50/50 dark:bg-amber-900/10 max-h-96 overflow-auto">
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>

          {/* Extracted Metadata Info */}
          {(data.license || data.language || data.paper_url || data.blog_url) && (
            <div className="rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                📄 Extracted from HuggingFace README
              </div>
              <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10">
                <div className="space-y-2 text-xs">
                  {data.license && (
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">License:</span>{' '}
                      <span className="text-slate-700 dark:text-slate-300">{data.license}</span>
                    </div>
                  )}
                  {data.language && (
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Language:</span>{' '}
                      <span className="text-slate-700 dark:text-slate-300">{data.language}</span>
                    </div>
                  )}
                  {data.paper_url && (
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Paper:</span>{' '}
                      <a href={data.paper_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                        {data.paper_url}
                      </a>
                    </div>
                  )}
                  {data.blog_url && (
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Blog:</span>{' '}
                      <a href={data.blog_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                        {data.blog_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Extracted Benchmarks */}
          {data.benchmarks && data.benchmarks.length > 0 && (
            <div className="rounded-lg overflow-hidden border border-green-200 dark:border-green-800">
              <div className="bg-green-50 dark:bg-green-900/20 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-300">
                📊 Benchmarks Extracted from README ({data.benchmarks.length} found)
              </div>
              <div className="p-3 bg-green-50/50 dark:bg-green-900/10 max-h-48 overflow-auto">
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                  {JSON.stringify(data.benchmarks, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Fun loading messages component
const LoadingMessage = () => {
  const loadingMessages = [
    'Thinking...',
    'Analyzing model...',
    'Reading documentation...',
    'Gathering insights...',
    'Consulting the AI oracle...',
    'Wibbling...',
    'Pondering deeply...',
    'Processing wisdom...',
    'Channeling knowledge...',
    'Brewing intelligence...',
    'Synthesizing details...',
    'Contemplating...',
    'Computing brilliance...',
    'Decoding secrets...',
    'Assembling insights...',
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <Loader2 size={24} className="animate-spin text-indigo-500" />
      <span className="text-lg font-medium text-slate-700 dark:text-slate-300 animate-pulse">
        {loadingMessages[messageIndex]}
      </span>
    </div>
  );
};

const ModelDetailsPanel = ({ isOpen, onClose, model, aiInsights }) => {
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

  // Check model access type (access_type is now an array of platforms)
  const accessTypes = Array.isArray(model.access_type) ? model.access_type : [];
  const isOpenSource = accessTypes.includes('huggingface') || accessTypes.includes('ollama');
  const isAPIOnly = accessTypes.includes('openrouter') && !isOpenSource;

  // Count available links to determine grid layout
  const linkCount = [
    model.links?.huggingface,
    model.links?.ollama,
    model.links?.openrouter,
    (!model.links?.huggingface && !model.links?.ollama && !model.links?.openrouter) ? model.links?.official : null
  ].filter(Boolean).length;

  const gridColsClass = linkCount === 1 ? 'grid-cols-1' : linkCount === 2 ? 'grid-cols-2' : 'grid-cols-3';

  // Determine model type from AI insights
  const modelType = aiInsights?.data?.model_type || 'unknown';

  // Build KPIs array dynamically based on model type and available data
  const getKPIs = () => {
    const kpis = [];

    if (modelType === 'huggingface') {
      if (model.downloads) {
        kpis.push({
          icon: <Download size={16} strokeWidth={2.5} />,
          iconColor: 'indigo',
          value: model.downloads > 1000000
            ? `${(model.downloads / 1000000).toFixed(1)}M`
            : model.downloads > 1000
            ? `${(model.downloads / 1000).toFixed(1)}k`
            : model.downloads,
          label: 'Downloads'
        });
      }
      if (model.likes) {
        kpis.push({
          icon: <Star size={16} strokeWidth={2.5} />,
          iconColor: 'rose',
          value: model.likes > 1000 ? `${(model.likes / 1000).toFixed(1)}k` : model.likes,
          label: 'Likes'
        });
      }
      if (model.parameters_display) {
        kpis.push({
          icon: <Cpu size={16} strokeWidth={2.5} />,
          iconColor: 'purple',
          value: model.parameters_display,
          label: 'Parameters'
        });
      }
      if (model.context_window) {
        kpis.push({
          icon: <Layers size={16} strokeWidth={2.5} />,
          iconColor: 'blue',
          value: `${Math.round(model.context_window / 1000)}k`,
          label: 'Context'
        });
      }
      if (aiInsights?.data?.license) {
        kpis.push({
          icon: <Scale size={16} strokeWidth={2.5} />,
          iconColor: 'teal',
          value: aiInsights.data.license.toUpperCase(),
          label: 'License'
        });
      }
      if (aiInsights?.data?.language) {
        kpis.push({
          icon: <Languages size={16} strokeWidth={2.5} />,
          iconColor: 'violet',
          value: aiInsights.data.language.toUpperCase(),
          label: 'Language'
        });
      }
    } else if (modelType === 'openrouter') {
      if (model.context_window) {
        kpis.push({
          icon: <Layers size={16} strokeWidth={2.5} />,
          iconColor: 'blue',
          value: `${Math.round(model.context_window / 1000)}k`,
          label: 'Context'
        });
      }
      if (model.max_output_tokens) {
        kpis.push({
          icon: <Gauge size={16} strokeWidth={2.5} />,
          iconColor: 'cyan',
          value: `${Math.round(model.max_output_tokens / 1000)}k`,
          label: 'Max Output'
        });
      }
      if (model.pricing?.prompt) {
        kpis.push({
          icon: <DollarSign size={16} strokeWidth={2.5} />,
          iconColor: 'emerald',
          value: `$${model.pricing.prompt.toFixed(2)}`,
          label: 'Input/1M'
        });
      }
      if (model.pricing?.completion) {
        kpis.push({
          icon: <DollarSign size={16} strokeWidth={2.5} />,
          iconColor: 'amber',
          value: `$${model.pricing.completion.toFixed(2)}`,
          label: 'Output/1M'
        });
      }
      kpis.push({
        icon: <Zap size={16} strokeWidth={2.5} />,
        iconColor: 'indigo',
        value: 'API',
        label: 'Access'
      });
    } else if (modelType === 'ollama') {
      if (model.parameters_display) {
        kpis.push({
          icon: <Cpu size={16} strokeWidth={2.5} />,
          iconColor: 'purple',
          value: model.parameters_display,
          label: 'Parameters'
        });
      }
      if (model.context_window) {
        kpis.push({
          icon: <Layers size={16} strokeWidth={2.5} />,
          iconColor: 'blue',
          value: `${Math.round(model.context_window / 1000)}k`,
          label: 'Context'
        });
      }
      if (model.downloads) {
        kpis.push({
          icon: <Download size={16} strokeWidth={2.5} />,
          iconColor: 'indigo',
          value: model.downloads > 1000000
            ? `${(model.downloads / 1000000).toFixed(1)}M`
            : model.downloads > 1000
            ? `${(model.downloads / 1000).toFixed(1)}k`
            : model.downloads,
          label: 'Pulls'
        });
      }
      kpis.push({
        icon: <HardDrive size={16} strokeWidth={2.5} />,
        iconColor: 'emerald',
        value: 'Local',
        label: 'Deployment'
      });
    } else {
      // Fallback for unknown types
      if (model.downloads) {
        kpis.push({
          icon: <Download size={16} strokeWidth={2.5} />,
          iconColor: 'indigo',
          value: model.downloads > 1000000
            ? `${(model.downloads / 1000000).toFixed(1)}M`
            : model.downloads > 1000
            ? `${(model.downloads / 1000).toFixed(1)}k`
            : model.downloads,
          label: 'Downloads'
        });
      }
      if (model.likes) {
        kpis.push({
          icon: <Star size={16} strokeWidth={2.5} />,
          iconColor: 'rose',
          value: model.likes > 1000 ? `${(model.likes / 1000).toFixed(1)}k` : model.likes,
          label: 'Likes'
        });
      }
      if (model.context_window) {
        kpis.push({
          icon: <Layers size={16} strokeWidth={2.5} />,
          iconColor: 'blue',
          value: `${Math.round(model.context_window / 1000)}k`,
          label: 'Context'
        });
      }
      if (model.created_at) {
        kpis.push({
          icon: <Database size={16} strokeWidth={2.5} />,
          iconColor: 'emerald',
          value: new Date(model.created_at).getFullYear(),
          label: 'Released'
        });
      }
    }

    return kpis;
  };

  const kpis = getKPIs();

  const getIconColorClasses = (color) => {
    const colors = {
      indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
      rose: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
      purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
      blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      cyan: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
      emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
      amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
      teal: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20',
      violet: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20',
    };
    return colors[color] || colors.indigo;
  };

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed top-0 bottom-0 right-0 z-[100] w-full md:w-[700px] lg:w-[800px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col border-l border-slate-200 dark:border-slate-800">

        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/80 backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/50">
                  {model.category}
                </span>
                {isOpenSource ? (
                  <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/50">
                    <Globe size={12} strokeWidth={2.5} /> {accessTypes.length > 1 ? 'Hybrid' : 'Open Source'}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg flex items-center gap-1.5 border border-purple-200 dark:border-purple-800/50">
                    <Zap size={12} fill="currentColor" /> API Only
                  </span>
                )}
                {model.tier && (
                  <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg uppercase tracking-wider border border-amber-200 dark:border-amber-800/50">
                    {model.tier}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-2">
                {model.name}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium flex-wrap">
                <span className="flex items-center gap-2">
                  by
                  {model.publisher_image && (
                    <img
                      src={model.publisher_image}
                      alt={`${model.publisher} logo`}
                      className="w-5 h-5 rounded object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <span className="text-slate-900 dark:text-white font-semibold">{model.publisher}</span>
                </span>
                {model.parameters_display && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="flex items-center gap-1">
                      <Cpu size={14} /> {model.parameters_display}
                    </span>
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
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">

          {/* Show loading message while fetching AI insights */}
          {aiInsights?.loading ? (
            <LoadingMessage />
          ) : (
            <>
              {/* Quick Stats - Dynamic based on available data */}
              {kpis.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {kpis.map((kpi, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <div className={`mb-1.5 p-1.5 rounded-lg ${getIconColorClasses(kpi.iconColor)}`}>
                        {kpi.icon}
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-lg">
                        {kpi.value}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              )}

          {/* AI-Generated Content Section */}
          {aiInsights?.error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-300">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Failed to generate insights</h3>
                <p className="text-sm opacity-90">{aiInsights.error}</p>
              </div>
            </div>
          ) : aiInsights?.data ? (
            <>
              {/* AI-Generated Summary */}
              <section>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Sparkles size={18} className="text-indigo-500" />
                  Overview
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {aiInsights.data.summary}
                </p>
              </section>

              {/* Resources Section - Show paper and blog links */}
              {(aiInsights.data.paper_url || aiInsights.data.blog_url) && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <BookOpen size={18} className="text-blue-500" />
                    Resources
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {aiInsights.data.paper_url && (
                      <a
                        href={aiInsights.data.paper_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors group"
                      >
                        <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Research Paper</span>
                        <ExternalLink size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {aiInsights.data.blog_url && (
                      <a
                        href={aiInsights.data.blog_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors group"
                      >
                        <Globe size={16} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Release Blog</span>
                        <ExternalLink size={14} className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Benchmarks Section - only show if benchmarks exist with actual scores */}
              {aiInsights.data.benchmarks &&
               aiInsights.data.benchmarks.length > 0 &&
               aiInsights.data.benchmarks.some(b => b.score && b.score !== 'N/A' && b.score !== '' && typeof b.score !== 'string' || (typeof b.score === 'string' && b.score.trim() && b.score !== 'N/A')) && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <BarChart3 size={18} className="text-blue-500" />
                    Benchmarks
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Benchmark
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {aiInsights.data.benchmarks.filter(b => b.score && b.score !== 'N/A' && b.score !== '').map((benchmark, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                              {benchmark.name}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {benchmark.score}{benchmark.unit}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Key Strengths */}
              <section>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <CheckCircle size={18} className="text-emerald-500" />
                  Key Strengths
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {aiInsights.data.key_strengths?.map((strength, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                      <Check size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{strength}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Best Use Cases */}
              <section>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Best Use Cases
                </h3>
                <div className="space-y-2">
                  {aiInsights.data.best_use_cases?.map((useCase, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{useCase}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Considerations */}
              {aiInsights.data.considerations && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Info size={18} className="text-amber-500" />
                    Considerations
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.data.considerations.map((consideration, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                        <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{consideration}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Type-Specific Content - HuggingFace */}
              {modelType === 'huggingface' && aiInsights.data.getting_started && (
                <>
                  <section>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <Code size={18} className="text-blue-500" />
                      Getting Started
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {aiInsights.data.getting_started.installation}
                      </p>
                      {aiInsights.data.getting_started.code_snippet && (
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 flex justify-between items-center">
                            <span>Python</span>
                            <CopyButton text={aiInsights.data.getting_started.code_snippet} />
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
                            <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                              {aiInsights.data.getting_started.code_snippet}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {aiInsights.data.hardware_requirements && (
                    <section>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <HardDrive size={18} className="text-purple-500" />
                        Hardware Requirements
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/30">
                          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-2">RAM</div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                            {aiInsights.data.hardware_requirements.minimum_ram}
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/30">
                          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-2">GPU</div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                            {aiInsights.data.hardware_requirements.gpu_recommendation}
                          </div>
                        </div>
                      </div>
                      {aiInsights.data.hardware_requirements.quantization_options && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                          {aiInsights.data.hardware_requirements.quantization_options}
                        </p>
                      )}
                    </section>
                  )}
                </>
              )}

              {/* Type-Specific Content - OpenRouter */}
              {modelType === 'openrouter' && (
                <>
                  {aiInsights.data.api_integration && (
                    <section>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Code size={18} className="text-blue-500" />
                        API Integration
                      </h3>
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {aiInsights.data.api_integration.quick_start}
                        </p>
                        {aiInsights.data.api_integration.code_snippet && (
                          <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 flex justify-between items-center">
                              <span>Code Example</span>
                              <CopyButton text={aiInsights.data.api_integration.code_snippet} />
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
                              <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                {aiInsights.data.api_integration.code_snippet}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {aiInsights.data.pricing_insights && (
                    <section>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <DollarSign size={18} className="text-emerald-500" />
                        Pricing Insights
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {aiInsights.data.pricing_insights.cost_analysis}
                        </p>
                        {aiInsights.data.pricing_insights.cost_optimization && (
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Cost Optimization Tip</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {aiInsights.data.pricing_insights.cost_optimization}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* Type-Specific Content - Ollama */}
              {modelType === 'ollama' && (
                <>
                  {aiInsights.data.installation && (
                    <section>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Code size={18} className="text-blue-500" />
                        Installation
                      </h3>
                      <div className="space-y-3">
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 flex justify-between items-center">
                            <span>Terminal</span>
                            <CopyButton text={aiInsights.data.installation.command} />
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900/50">
                            <pre className="text-sm font-mono text-slate-800 dark:text-slate-200">
                              {aiInsights.data.installation.command}
                            </pre>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {aiInsights.data.installation.setup_instructions}
                        </p>
                      </div>
                    </section>
                  )}

                  {aiInsights.data.system_requirements && (
                    <section>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <HardDrive size={18} className="text-purple-500" />
                        System Requirements
                      </h3>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p><strong className="text-slate-700 dark:text-slate-300">RAM:</strong> {aiInsights.data.system_requirements.ram_per_quant}</p>
                        <p><strong className="text-slate-700 dark:text-slate-300">CPU vs GPU:</strong> {aiInsights.data.system_requirements.cpu_vs_gpu}</p>
                        <p><strong className="text-slate-700 dark:text-slate-300">Storage:</strong> {aiInsights.data.system_requirements.storage_space}</p>
                      </div>
                    </section>
                  )}

                  {aiInsights.data.quantization_guide && (
                    <section>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Gauge size={18} className="text-amber-500" />
                        Quantization Guide
                      </h3>
                      <div className="space-y-3">
                        {aiInsights.data.quantization_guide.available_quants && (
                          <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Available Quantizations</div>
                            <div className="flex flex-wrap gap-2">
                              {aiInsights.data.quantization_guide.available_quants.map((quant, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-medium rounded text-slate-600 dark:text-slate-300">
                                  {quant}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <strong>Trade-offs:</strong> {aiInsights.data.quantization_guide.quality_vs_speed}
                        </p>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Recommendation</div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {aiInsights.data.quantization_guide.recommendations}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* Performance Notes (for all types) */}
              {aiInsights.data.performance_notes && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Gauge size={18} className="text-blue-500" />
                    Performance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {aiInsights.data.performance_notes}
                  </p>
                </section>
              )}

              {aiInsights.data.performance_expectations && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Gauge size={18} className="text-blue-500" />
                    Performance Expectations
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {aiInsights.data.performance_expectations.tokens_per_second && (
                      <p><strong>Speed:</strong> {aiInsights.data.performance_expectations.tokens_per_second}</p>
                    )}
                    {aiInsights.data.performance_expectations.quality_comparison && (
                      <p>{aiInsights.data.performance_expectations.quality_comparison}</p>
                    )}
                  </div>
                </section>
              )}
            </>
          ) : (
            /* Fallback to basic description if no AI insights */
            <section>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                Description
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {model.description || model.short_description || "No description available."}
              </p>
            </section>
          )}
          </>
          )}

          {/* Debug Section - Show extracted data and Gemini response */}
          {!aiInsights?.loading && aiInsights?.data && (
            <DebugSection data={aiInsights.data} />
          )}

          {/* Model ID - Always visible */}
          {!aiInsights?.loading && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Model ID: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{model.model_id}</code></span>
              <CopyButton text={model.model_id} />
            </div>
          </div>
          )}

        </div>

        {/* Footer Actions - Show all available platform links */}
        <div className={`flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid ${gridColsClass} gap-3`}>
          {model.links?.huggingface && (
            <a
              href={model.links.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>View on HuggingFace</span>
              <ExternalLink size={16} strokeWidth={2.5} />
            </a>
          )}

          {model.links?.ollama && (
            <a
              href={model.links.ollama}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Get via Ollama</span>
              <ExternalLink size={16} strokeWidth={2.5} />
            </a>
          )}

          {model.links?.openrouter && (
            <a
              href={model.links.openrouter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Use via API</span>
              <Zap size={16} strokeWidth={2.5} fill="currentColor" />
            </a>
          )}

          {model.links?.official && !model.links?.huggingface && !model.links?.ollama && !model.links?.openrouter && (
            <a
              href={model.links.official}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Official Site</span>
              <ExternalLink size={16} strokeWidth={2.5} />
            </a>
          )}
        </div>

      </div>
    </>,
    document.body
  );
};

export default ModelDetailsPanel;
