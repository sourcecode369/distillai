import React from "react"
import { useTranslation } from "react-i18next"
import {
  Users,
  Activity,
  FileText,
  CheckCircle2,
  Bookmark,
  Eye,
  Target,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalyticsBarChart, AnalyticsAreaChart } from "../charts/RechartsWrapper"
import { formatNumber } from "@/utils/formatting"

// ── Skeleton ─────────────────────────────────────────────────────────────────
const AnalyticsPageSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-gray-800/60 animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-800/60 animate-pulse" />)}
    </div>
    <div className="h-72 rounded-2xl bg-gray-800/60 animate-pulse" />
  </div>
)

// ── Stat card ─────────────────────────────────────────────────────────────────
const Stat = ({ label, value, icon: Icon, dim = false, trend }) => (
  <div className={`rounded-2xl border p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors ${dim ? "border-gray-800/40 bg-gray-900/40" : "border-gray-800/60 bg-gray-900/60"}`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center justify-center h-9 w-9 rounded-xl border border-indigo-500/20 bg-indigo-600/10 text-indigo-400 flex-shrink-0">
        <Icon size={16} strokeWidth={2} />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-gray-100 leading-none">{value}</p>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
  </div>
)

// ── Chart card ────────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-800/60 bg-gray-900/60 overflow-hidden ${className}`}>
    <div className="px-5 pt-5 pb-3 border-b border-gray-800/40">
      <p className="text-sm font-bold text-gray-200">{title}</p>
      {subtitle && <p className="text-[11px] text-gray-600 mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-5">{children}</div>
  </div>
)

// ── Section divider ───────────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.18em] shrink-0">{label}</span>
    <div className="flex-1 h-px bg-gray-800/60" />
  </div>
)

// ── Main ─────────────────────────────────────────────────────────────────────
const AnalyticsPage = ({
  analytics,
  detailedAnalyticsData,
  loadingAnalytics,
  loadingDetailedAnalytics,
  analyticsTimeframe,
  onTimeframeChange,
  staticStats,
}) => {
  const { t } = useTranslation("admin")
  const isLoading = loadingAnalytics || loadingDetailedAnalytics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-800/60">
        <div>
          <h2 className="text-base font-bold text-gray-100">{t("analytics.title")}</h2>
          <p className="text-xs text-gray-600 mt-0.5">{t("analytics.subtitle")}</p>
        </div>
        <Select value={String(analyticsTimeframe)} onValueChange={(v) => onTimeframeChange(Number(v))}>
          <SelectTrigger className="w-40 h-8 text-xs border-gray-800 bg-gray-900/60 text-gray-300 rounded-xl">
            <SelectValue placeholder={t("analytics.timeframe.selectPlaceholder")} />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800 text-gray-300">
            <SelectItem value="7">{t("analytics.timeframe.last7Days")}</SelectItem>
            <SelectItem value="30">{t("analytics.timeframe.last30Days")}</SelectItem>
            <SelectItem value="90">{t("analytics.timeframe.last90Days")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <AnalyticsPageSkeleton />
      ) : detailedAnalyticsData ? (
        <div className="space-y-6">
          {/* KPIs row 1 */}
          <Divider label={t("analytics.sections.keyPerformanceIndicators")} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label={t("analytics.metrics.totalUsers")} value={formatNumber(analytics?.totalUsers)} icon={Users}
              trend={analytics?.recentUsers ? `+${analytics.recentUsers}` : null} />
            <Stat label={t("analytics.metrics.activeUsers")} value={formatNumber(detailedAnalyticsData.activeUsers)} icon={Activity}
              trend={detailedAnalyticsData.newUsers ? `+${detailedAnalyticsData.newUsers} new` : null} />
            <Stat label={t("analytics.metrics.totalTopics")} value={formatNumber(staticStats.totalTopics)} icon={FileText} dim />
            <Stat label={t("analytics.metrics.completedTopics")} value={formatNumber(analytics?.completedTopics)} icon={CheckCircle2} dim />
          </div>

          {/* KPIs row 2 */}
          <Divider label={t("analytics.sections.engagementMetrics")} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label={t("analytics.metrics.totalBookmarks")} value={formatNumber(analytics?.totalBookmarks)} icon={Bookmark} dim />
            <Stat label={t("analytics.metrics.readingSessions")} value={formatNumber(analytics?.totalHistory)} icon={Eye} dim />
            <Stat label={t("analytics.metrics.quizAttempts")} value={formatNumber(detailedAnalyticsData.quizAttempts)} icon={Target} />
            <Stat
              label={t("analytics.metrics.quizPassRate")}
              value={detailedAnalyticsData.quizPassRate ? `${detailedAnalyticsData.quizPassRate}%` : "—"}
              icon={TrendingUp}
            />
          </div>

          {/* Charts */}
          <Divider label={t("analytics.sections.engagementLearning")} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title={t("analytics.charts.dailyActiveUsers")} subtitle={t("analytics.charts.lastDays", { days: analyticsTimeframe })}>
              <div className="h-52">
                <AnalyticsAreaChart data={detailedAnalyticsData.dailyActiveUsers || []} color="#6366f1" height={208} />
              </div>
            </ChartCard>

            <ChartCard title={t("analytics.charts.activityByHour")} subtitle={t("analytics.charts.peakUsageTimes")}>
              <div className="h-52">
                <AnalyticsBarChart
                  data={(detailedAnalyticsData.hourlyActivity || []).map((count, hour) => ({ label: `${hour}h`, value: count }))}
                  color="#6366f1"
                  height={208}
                />
              </div>
            </ChartCard>

            <ChartCard title={t("analytics.charts.topicViewsCompletions")} subtitle={t("analytics.charts.categoryPerformance")}>
              <div className="h-52">
                <AnalyticsBarChart
                  data={(detailedAnalyticsData.categoryStats || []).map((cat) => ({
                    label: cat.category_title?.substring(0, 12) || cat.category_id,
                    value: cat.views,
                  }))}
                  color="#6366f1"
                  height={208}
                />
              </div>
            </ChartCard>

            <ChartCard title={t("analytics.charts.scoreDistribution")} subtitle={t("analytics.charts.quizScoreRanges")}>
              <div className="h-52">
                <AnalyticsBarChart
                  data={Object.entries(detailedAnalyticsData.scoreDistribution || {}).map(([label, value]) => ({ label: `${label}%`, value }))}
                  color="#6366f1"
                  height={208}
                />
              </div>
            </ChartCard>
          </div>

          {/* Top viewed topics */}
          <ChartCard title={t("analytics.charts.topViewedTopics")} subtitle={t("analytics.charts.mostPopularContent")}>
            {(detailedAnalyticsData.topViewedTopics || []).length === 0 ? (
              <div className="py-10 text-center">
                <Eye size={28} className="mx-auto mb-2 text-gray-700" />
                <p className="text-xs text-gray-600">{t("analytics.charts.noTopicViews")}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {(detailedAnalyticsData.topViewedTopics || []).map((topic, idx) => {
                  const max = Math.max(...(detailedAnalyticsData.topViewedTopics || []).map((t) => t.views))
                  const pct = max > 0 ? (topic.views / max) * 100 : 0
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-lg bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-300 truncate mb-1.5">{topic.title}</p>
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-500 flex-shrink-0">{formatNumber(topic.views)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </ChartCard>

          {/* Funnel + most completed */}
          <Divider label={t("analytics.sections.quizProgress")} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title={t("analytics.charts.completionFunnel")} subtitle={t("analytics.charts.userProgression")}>
              <div className="space-y-4">
                {[
                  { label: t("analytics.charts.readTopics"),    value: detailedAnalyticsData.completionFunnel?.usersWithReading || 0 },
                  { label: t("analytics.charts.attemptedQuiz"), value: detailedAnalyticsData.completionFunnel?.usersWithQuizAttempts || 0 },
                  { label: t("analytics.charts.passedQuiz"),    value: detailedAnalyticsData.completionFunnel?.usersWithPassedQuiz || 0 },
                ].map((step, idx, arr) => {
                  const base = arr[0].value || 1
                  const pct = Math.round((step.value / base) * 100)
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-400">{step.label}</span>
                        <span className="text-sm font-bold text-gray-300">{step.value}</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </ChartCard>

            <ChartCard title={t("analytics.charts.mostCompletedTopics")} subtitle={t("analytics.charts.topCompletionRates")}>
              {(detailedAnalyticsData.mostCompletedTopics || []).length === 0 ? (
                <div className="py-10 text-center">
                  <CheckCircle2 size={28} className="mx-auto mb-2 text-gray-700" />
                  <p className="text-xs text-gray-600">{t("analytics.charts.noCompletionData")}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800/40">
                  {(detailedAnalyticsData.mostCompletedTopics || []).map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-300 truncate">{topic.topic_id}</p>
                        <p className="text-[11px] text-gray-600 mt-0.5">{topic.completionRate}% completion</p>
                      </div>
                      <span className="text-sm font-bold text-gray-500 ml-4 flex-shrink-0">{topic.completions}</span>
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>
          </div>

          {/* Quiz table */}
          <ChartCard title={t("analytics.charts.quizPerformanceByTopic")} subtitle={t("analytics.charts.topAttempts")}>
            {(detailedAnalyticsData.quizPerformanceByTopic || []).length === 0 ? (
              <div className="py-10 text-center">
                <Target size={28} className="mx-auto mb-2 text-gray-700" />
                <p className="text-xs text-gray-600">{t("analytics.charts.noQuizData")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800/60">
                      <th className="text-left pb-2.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">{t("analytics.charts.topic")}</th>
                      <th className="text-right pb-2.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">{t("analytics.charts.attempts")}</th>
                      <th className="text-right pb-2.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">{t("analytics.charts.avgScore")}</th>
                      <th className="text-right pb-2.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">{t("analytics.charts.passRate")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40">
                    {(detailedAnalyticsData.quizPerformanceByTopic || []).slice(0, 10).map((topic, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 text-gray-300 truncate max-w-[160px]">{topic.topic_id}</td>
                        <td className="py-2.5 text-right text-gray-500">{formatNumber(topic.attempts)}</td>
                        <td className="py-2.5 text-right text-gray-500">{topic.avgScore}%</td>
                        <td className="py-2.5 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            topic.passRate >= 80 ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                            : topic.passRate >= 60 ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                            : "bg-red-400/10 text-red-400 border border-red-400/20"
                          }`}>{topic.passRate}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 py-16 text-center">
          <BarChart3 size={36} className="mx-auto mb-3 text-gray-700" />
          <p className="text-sm font-semibold text-gray-500">{t("analytics.noData")}</p>
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage
