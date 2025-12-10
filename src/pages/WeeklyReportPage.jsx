import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, ArrowRight, Loader2, AlertCircle, Tag, X, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import Hero from "../components/Hero";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState, { ErrorState } from "../components/EmptyState";
import Button from "../components/Button";
import Card from "../components/Card";
import SEO from "../components/SEO";

const WeeklyReportPage = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [insightsState, setInsightsState] = useState({});

  const handleViewInsights = async (sourceUrl, catKey, idx) => {
    const key = `${catKey}-${idx}`;
    setInsightsState(prev => ({ ...prev, [key]: { loading: true, error: null } }));

    try {
      const { data, error } = await supabase.functions.invoke('insights', {
        body: { sourceUrl }
      });

      if (error) throw error;

      setInsightsState(prev => ({
        ...prev,
        [key]: { loading: false, data }
      }));
    } catch (error) {
      console.error('Error fetching insights:', error);

      let errorMessage = error.message || 'Failed to generate insights';

      // Try to extract more specific error from the response if available
      if (error.context && error.context.json) {
        try {
          const errorJson = await error.context.json();
          if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch (e) {
          // Ignore JSON parse error
        }
      }

      setInsightsState(prev => ({
        ...prev,
        [key]: { loading: false, error: errorMessage }
      }));
    }
  };


  // Fetch weekly reports using React Query
  const {
    data: weeklyReports,
    isLoading: loading,
    error: reportsError,
    refetch,
  } = useQuery({
    queryKey: ["weekly-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("published", true)
        .order("week_start_date", { ascending: false });

      if (error) {
        console.error("Error loading weekly reports:", error);
        throw error;
      }

      return data || [];
    },
  });

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const endDay = end.getDate();
    const year = end.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  // Format week number
  const formatWeekNumber = (weekNumber) => {
    if (!weekNumber) return "";
    return `Week ${weekNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen relative z-10">
        <Hero
          title={t('weeklyReport.title', { defaultValue: "AI Weekly" })}
          subtitle={t('weeklyReport.subtitle', { defaultValue: "Stay updated with the latest AI research and developments" })}
          icon={<FileText size={22} className="text-white drop-shadow-sm" />}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="interactive" className="animate-pulse">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reportsError) {
    return (
      <div className="min-h-screen relative z-10">
        <Hero
          title={t('weeklyReport.title', { defaultValue: "AI Weekly" })}
          subtitle={t('weeklyReport.subtitle', { defaultValue: "Stay updated with the latest AI research and developments" })}
          icon={<FileText size={22} className="text-white drop-shadow-sm" />}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorState
            title={t('weeklyReport.errors.loadFailed', { defaultValue: 'Failed to load weekly reports' })}
            description={reportsError?.message || t('weeklyReport.errors.loadFailedDescription', { defaultValue: 'Unable to load weekly reports. Please try again.' })}
            error={reportsError}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      <SEO
        title={t('weeklyReport.title', { defaultValue: "AI Weekly" })}
        description={t('weeklyReport.subtitle', { defaultValue: "Stay updated with the latest AI research and developments" })}
        url="/weekly-report"
      />
      <Hero
        title={t('weeklyReport.title', { defaultValue: "AI Weekly" })}
        subtitle={t('weeklyReport.subtitle', { defaultValue: "Stay updated with the latest AI research and developments" })}
        icon={<FileText size={22} className="text-white drop-shadow-sm" />}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!weeklyReports || weeklyReports.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('weeklyReport.empty.title', { defaultValue: "No AI Weekly Available" })}
            description={t('weeklyReport.empty.description', { defaultValue: "Check back soon for the latest research highlights and developments." })}
            variant="default"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyReports.map((report) => (
              <Card
                key={report.id}
                variant="featured"
                className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex flex-col"
                onClick={() => setSelectedReport(report)}
              >
                {/* Date Range Badge */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                    <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      {formatDateRange(report.week_start_date, report.week_end_date)}
                    </span>
                  </div>
                  {report.week_number && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 rounded-full border border-pink-200/50 dark:border-pink-800/50 shadow-sm">
                      <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">
                        {formatWeekNumber(report.week_number)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {report.tags && report.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {report.tags.slice(0, 3).map((tag, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full border border-green-200/50 dark:border-green-800/50 shadow-sm"
                      >
                        <Tag size={12} className="text-green-600 dark:text-green-400" />
                        <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300">
                  {report.title}
                </h3>

                {/* Gradient Divider */}
                <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-full mb-4 group-hover:h-1 transition-all duration-300"></div>

                {/* Summary */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                  {report.summary}
                </p>

                {/* Read More Button */}
                <div className="mt-auto">
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-violet-600 hover:via-pink-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95 group-hover:gap-3 relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                    <span className="relative z-10">{t('weeklyReport.readMore', { defaultValue: "Read More" })}</span>
                    <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                        <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                          {formatDateRange(selectedReport.week_start_date, selectedReport.week_end_date)}
                        </span>
                      </div>
                      {selectedReport.week_number && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 rounded-full border border-pink-200/50 dark:border-pink-800/50 shadow-sm">
                          <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">
                            {formatWeekNumber(selectedReport.week_number)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedReport.tags && selectedReport.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {selectedReport.tags.map((tag, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full border border-green-200/50 dark:border-green-800/50 shadow-sm"
                          >
                            <Tag size={12} className="text-green-600 dark:text-green-400" />
                            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                              {tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-50 dark:via-slate-100 dark:to-slate-50 bg-clip-text text-transparent mb-4 leading-tight break-words">
                      {selectedReport.title}
                    </h2>

                    {/* Gradient Divider */}
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-full mb-4"></div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="flex-shrink-0 p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label={t('weeklyReport.close', { defaultValue: "Close" })}
                  >
                    <X size={26} className="transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Summary Box */}
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl p-6 mb-10 border border-indigo-100 dark:border-indigo-800/50 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300 font-bold text-sm uppercase tracking-wider">
                    <Sparkles size={14} />
                    Weekly Summary
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedReport.summary}
                  </p>
                </div>

                {/* Content - Grouped by Category */}
                {selectedReport.content && (() => {
                  let parsedContent;
                  try {
                    parsedContent = typeof selectedReport.content === 'string'
                      ? JSON.parse(selectedReport.content)
                      : selectedReport.content;
                  } catch (e) {
                    parsedContent = null;
                  }

                  if (parsedContent && parsedContent.sections && Array.isArray(parsedContent.sections)) {
                    // Group by category
                    const categorized = parsedContent.sections.reduce((acc, item) => {
                      const cat = item.category || 'other';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    }, {});

                    // Category metadata
                    const categoryMeta = {
                      paper: { label: 'Research Papers' },
                      model: { label: 'Models' },
                      tool: { label: 'Tools & Frameworks' },
                      news: { label: 'News & Updates' },
                      other: { label: 'Other' }
                    };

                    const categoryOrder = ['paper', 'model', 'tool', 'news', 'other'];

                    return (
                      <div className="space-y-10">
                        {categoryOrder.map(catKey => {
                          const items = categorized[catKey];
                          if (!items || items.length === 0) return null;

                          const meta = categoryMeta[catKey];

                          return (
                            <div key={catKey}>
                              {/* Category Header */}
                              <div className="mb-8 flex items-center gap-4">
                                <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 via-violet-500 to-pink-500 rounded-full"></div>
                                <div>
                                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                    {meta.label}
                                  </h3>
                                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 rounded-full mt-2">
                                    <div className="h-full w-24 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-full"></div>
                                  </div>
                                </div>
                              </div>

                              {/* Items List - Landing Page CTA Style */}
                              <div className="space-y-4">
                                {items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="group relative"
                                  >
                                    {/* Glow effect on hover - BEHIND the card */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 blur transition duration-500"></div>

                                    {/* Main card */}
                                    <div
                                      className="relative bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 overflow-hidden"
                                    >
                                      {/* Background decoration */}
                                      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-pink-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                                      <div className="relative z-10">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300">
                                          {item.heading}
                                        </h4>

                                        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                          {item.content}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-3 mt-4">
                                          {/* View Source Button */}
                                          {item.url && (
                                            <a
                                              href={item.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-md hover:text-indigo-600 dark:hover:text-indigo-400 group/source"
                                            >
                                              <span>View Source</span>
                                              <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover/source:translate-x-1" />
                                            </a>
                                          )}

                                          {/* View Insights Button */}
                                          {item.url && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewInsights(item.url, catKey, idx);
                                              }}
                                              disabled={insightsState[`${catKey}-${idx}`]?.loading}
                                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-violet-600 hover:via-pink-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                              {/* Shimmer effect */}
                                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                                              {insightsState[`${catKey}-${idx}`]?.loading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                              ) : (
                                                <Sparkles size={16} strokeWidth={2.5} />
                                              )}
                                              <span className="relative z-10">
                                                {insightsState[`${catKey}-${idx}`]?.loading ? 'Analyzing...' : 'View AI Insights'}
                                              </span>
                                            </button>
                                          )}
                                        </div>

                                        {/* Insights Display */}
                                        {insightsState[`${catKey}-${idx}`]?.data && (
                                          <div className="mt-6 p-5 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center justify-between mb-3">
                                              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm uppercase tracking-wider">
                                                <Sparkles size={14} />
                                                AI Insights
                                              </div>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setInsightsState(prev => {
                                                    const newState = { ...prev };
                                                    delete newState[`${catKey}-${idx}`];
                                                    return newState;
                                                  });
                                                }}
                                                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                                title="Close Insights"
                                              >
                                                <X size={16} />
                                              </button>
                                            </div>

                                            <div className="space-y-6 text-sm">
                                              {/* Executive Summary */}
                                              <div>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2 text-sm">Executive Summary</span>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                  {insightsState[`${catKey}-${idx}`].data.summary}
                                                </p>
                                              </div>

                                              {/* Key Innovations */}
                                              {insightsState[`${catKey}-${idx}`].data.innovations?.length > 0 && (
                                                <div>
                                                  <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2 text-sm">Key Innovations</span>
                                                  <ul className="space-y-2">
                                                    {insightsState[`${catKey}-${idx}`].data.innovations.map((innovation, i) => (
                                                      <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400">
                                                        <span className="text-indigo-500 mt-1">•</span>
                                                        <span>{innovation}</span>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </div>
                                              )}

                                              {/* Technical Deep Dive */}
                                              {insightsState[`${catKey}-${idx}`].data.technical_details && (
                                                <div>
                                                  <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2 text-sm">Technical Deep Dive</span>
                                                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    {insightsState[`${catKey}-${idx}`].data.technical_details}
                                                  </p>
                                                </div>
                                              )}

                                              {/* Future Implications */}
                                              {insightsState[`${catKey}-${idx}`].data.implications && (
                                                <div>
                                                  <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2 text-sm">Future Implications</span>
                                                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    {insightsState[`${catKey}-${idx}`].data.implications}
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {insightsState[`${catKey}-${idx}`]?.error && (
                                          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            <span>{insightsState[`${catKey}-${idx}`].error}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // Fallback for other content types
                  return (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {typeof selectedReport.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedReport.content }} />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans bg-slate-100 dark:bg-slate-900 rounded-xl p-4 text-sm">
                          {JSON.stringify(selectedReport.content, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgb(203 213 225);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgb(148 163 184);
              }
              .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgb(51 65 85);
              }
              .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgb(71 85 105);
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReportPage;
