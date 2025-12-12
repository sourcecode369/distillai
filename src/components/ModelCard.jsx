
import React from 'react';
import { Cpu, Layers, Star, Download, Zap, Box, MessageSquare, Image as ImageIcon, Video, Mic, Code, Database, Unlock, DollarSign } from 'lucide-react';
import { FeatureCard } from './Card';

// Helper for category icons
const getIconForCategory = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('llm') || cat.includes('text')) return <MessageSquare size={18} />;
  if (cat.includes('image') || cat.includes('vision')) return <ImageIcon size={18} />;
  if (cat.includes('video')) return <Video size={18} />;
  if (cat.includes('audio')) return <Mic size={18} />;
  if (cat.includes('code')) return <Code size={18} />;
  return <Box size={18} />;
};

const ModelCard = ({ model, onClick }) => {
  const isPaid = !model.is_open_source;

  // Format numbers
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  // Derive publisher if missing
  const publisher = model.publisher || (model.model_id ? model.model_id.split('/')[0] : 'Unknown');

  return (
    <div
      onClick={onClick}
      className="card card-glow group hover-lift flex flex-row items-center gap-4 p-5 h-24"
    >
      {/* Icon */}
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
        ${isPaid
          ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-600 dark:text-purple-400 ring-1 ring-purple-100 dark:ring-purple-800/50'
          : 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-800/50'}
      `}>
        {getIconForCategory(model.category)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">

        {/* Title Row */}
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <span className="font-medium text-slate-500 dark:text-slate-400">{publisher}/</span>{model.name}
          </h3>
          {/* Badges */}
          {/* API/OSS Badge (Small) */}
          {isPaid ? (
            <div className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
              API
            </div>
          ) : (
            null
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            {/* Category Icon Small */}
            {model.category && (
              <span className="flex items-center gap-1">
                {model.category}
              </span>
            )}

            {/* Divider */}
            <span className="text-slate-300 dark:text-slate-600">•</span>

            {/* Params */}
            {model.parameters_display && (
              <span>{model.parameters_display}</span>
            )}
            {model.parameters_display && <span className="text-slate-300 dark:text-slate-600">•</span>}

            {/* Updated Date (Simulated as we might not have it, using Created) */}
            {model.created_at && (
              <span>Updated {new Date(model.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            )}
          </div>

          <div className="flex-1"></div>

          {/* Stats (Right aligned) */}
          <div className="flex items-center gap-3 shrink-0">
            {model.downloads > 0 && (
              <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Download size={12} strokeWidth={2.5} />
                {formatNumber(model.downloads)}
              </span>
            )}
            {model.likes > 0 && (
              <span className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                <Star size={12} strokeWidth={2.5} className={model.likes > 100 ? "fill-current" : ""} />
                {formatNumber(model.likes)}
              </span>
            )}
            {/* Payment Bolt/Icon */}
            {isPaid && <Zap size={12} className="text-amber-500 fill-amber-500" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
