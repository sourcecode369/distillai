import React from "react"
import { useTranslation } from "react-i18next"
import {
  Users,
  Activity,
  FileText,
  CheckCircle2,
  Bookmark,
  Eye,
  Star,
  TrendingUp,
  LineChart,
  Clock,
  BarChart3,
  PieChart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import StatCard from "./StatCard"
import { AnalyticsLineChart, AnalyticsBarChart, AnalyticsAreaChart } from "../charts/RechartsWrapper"
import { formatNumber } from "@/utils/formatting"
import { cn } from "@/lib/utils"
import AdminPageHeader from "./layout/admin-page-header"
import AdminSectionLabel from "./layout/admin-section-label"

// Analytics Page Skeleton Loader
const AnalyticsPageSkeleton = () => {
  const shimmerClass = "animate-pulse bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 bg-[length:200%_100%] rounded";
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className={`h-8 w-64 ${shimmerClass}`}></div>
          <div className={`h-4 w-96 ${shimmerClass}`}></div>
        </div>
        <div className={`h-10 w-40 ${shimmerClass}`}></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div>
        <div className={`h-4 w-48 mb-5 ${shimmerClass}`}></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className={cn(
              "border-border/60",
              "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${shimmerClass}`}></div>
                </div>
                <div className={`h-10 w-28 mb-3 ${shimmerClass}`}></div>
                <div className={`h-4 w-36 ${shimmerClass}`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Secondary KPI Cards Skeleton */}
      <div>
        <div className={`h-4 w-48 mb-5 ${shimmerClass}`}></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className={cn(
              "border-border/60",
              "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${shimmerClass}`}></div>
                </div>
                <div className={`h-10 w-28 mb-3 ${shimmerClass}`}></div>
                <div className={`h-4 w-36 ${shimmerClass}`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section Label Skeleton */}
      <div className={`h-4 w-64 ${shimmerClass}`}></div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className={cn(
            "border-border/60",
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
          )}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-10 w-10 rounded-xl ${shimmerClass}`}></div>
                <div className={`h-6 w-48 ${shimmerClass}`}></div>
              </div>
              <div className={`h-4 w-32 ${shimmerClass}`}></div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`h-72 -mx-2 rounded ${shimmerClass}`}></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Large Chart Skeleton */}
      <Card className={cn(
        "border-border/60 lg:col-span-2",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-10 w-10 rounded-xl ${shimmerClass}`}></div>
            <div className={`h-6 w-64 ${shimmerClass}`}></div>
          </div>
          <div className={`h-4 w-40 ${shimmerClass}`}></div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`h-72 -mx-2 rounded ${shimmerClass}`}></div>
        </CardContent>
      </Card>

      {/* Top Topics Skeleton */}
      <Card className={cn(
        "border-border/60 lg:col-span-2",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-10 w-10 rounded-xl ${shimmerClass}`}></div>
            <div className={`h-6 w-56 ${shimmerClass}`}></div>
          </div>
          <div className={`h-4 w-32 ${shimmerClass}`}></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={cn(
                "flex items-center gap-4 p-4 rounded-xl",
                "bg-muted/40 border border-border/60"
              )}>
                <div className={`h-8 w-8 rounded-lg ${shimmerClass}`}></div>
                <div className="flex-1 space-y-2">
                  <div className={`h-4 w-3/4 ${shimmerClass}`}></div>
                  <div className={`h-2 w-full rounded-full ${shimmerClass}`}></div>
                </div>
                <div className={`h-6 w-16 ${shimmerClass}`}></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Label Skeleton */}
      <div className={`h-4 w-64 ${shimmerClass}`}></div>

      {/* Quiz & Progress Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Skeleton */}
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-10 w-10 rounded-xl ${shimmerClass}`}></div>
              <div className={`h-6 w-48 ${shimmerClass}`}></div>
            </div>
            <div className={`h-4 w-32 ${shimmerClass}`}></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-12 rounded-lg ${shimmerClass}`}></div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Skeleton */}
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-10 w-10 rounded-xl ${shimmerClass}`}></div>
              <div className={`h-6 w-40 ${shimmerClass}`}></div>
            </div>
            <div className={`h-4 w-32 ${shimmerClass}`}></div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`h-72 -mx-2 rounded ${shimmerClass}`}></div>
          </CardContent>
        </Card>

        {/* Funnel Skeleton */}
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-10 w-10 rounded-xl ${shimmerClass}`}></div>
              <div className={`h-6 w-40 ${shimmerClass}`}></div>
            </div>
            <div className={`h-4 w-32 ${shimmerClass}`}></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`h-4 w-32 ${shimmerClass}`}></div>
                    <div className={`h-6 w-16 ${shimmerClass}`}></div>
                  </div>
                  <div className={`h-2 w-full rounded-full ${shimmerClass}`}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Topics Skeleton */}
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-10 w-10 rounded-xl ${shimmerClass}`}></div>
              <div className={`h-6 w-48 ${shimmerClass}`}></div>
            </div>
            <div className={`h-4 w-32 ${shimmerClass}`}></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between p-4 rounded-xl",
                  "bg-muted/40 border border-border/60"
                )}>
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-3/4 ${shimmerClass}`}></div>
                    <div className={`h-4 w-20 ${shimmerClass}`}></div>
                  </div>
                  <div className={`h-6 w-16 ${shimmerClass}`}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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
  const isLoading = loadingAnalytics || loadingDetailedAnalytics;

  return (
    <div className="space-y-8">
      {/* Header with Timeframe Filter */}
      <AdminPageHeader
        title={t("analytics.title")}
        subtitle={t("analytics.subtitle")}
        actions={
          <Select value={String(analyticsTimeframe)} onValueChange={(value) => onTimeframeChange(Number(value))}>
            <SelectTrigger className="w-full sm:w-auto min-w-[140px]">
              <SelectValue placeholder={t("analytics.timeframe.selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t("analytics.timeframe.last7Days")}</SelectItem>
              <SelectItem value="30">{t("analytics.timeframe.last30Days")}</SelectItem>
              <SelectItem value="90">{t("analytics.timeframe.last90Days")}</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <AnalyticsPageSkeleton />
      ) : detailedAnalyticsData ? (
        <>
          {/* Primary KPIs - Top Row */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-5 tracking-wider uppercase">
              {t("analytics.sections.keyPerformanceIndicators")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title={t("analytics.metrics.totalUsers")}
                value={formatNumber(analytics?.totalUsers)}
                icon={Users}
                gradient="from-indigo-500 to-indigo-600"
                trend={analytics?.recentUsers ? `+${formatNumber(analytics.recentUsers)} ${t("analytics.metrics.thisWeek")}` : null}
              />
              <StatCard
                title={t("analytics.metrics.activeUsers")}
                value={formatNumber(detailedAnalyticsData.activeUsers)}
                icon={Activity}
                gradient="from-violet-500 to-violet-600"
                trend={detailedAnalyticsData.newUsers ? `+${formatNumber(detailedAnalyticsData.newUsers)} ${t("analytics.metrics.new")}` : null}
              />
              <StatCard
                title={t("analytics.metrics.totalTopics")}
                value={formatNumber(staticStats.totalTopics)}
                icon={FileText}
                gradient="from-teal-500 to-teal-600"
              />
              <StatCard
                title={t("analytics.metrics.completedTopics")}
                value={formatNumber(analytics?.completedTopics)}
                icon={CheckCircle2}
                gradient="from-pink-500 to-pink-600"
              />
            </div>
          </div>

          {/* Secondary KPIs */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-5 tracking-wider uppercase">
              {t("analytics.sections.engagementMetrics")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title={t("analytics.metrics.totalBookmarks")}
                value={formatNumber(analytics?.totalBookmarks)}
                icon={Bookmark}
                gradient="from-purple-500 to-purple-600"
              />
              <StatCard
                title={t("analytics.metrics.readingSessions")}
                value={formatNumber(analytics?.totalHistory)}
                icon={Eye}
                gradient="from-rose-500 to-rose-600"
              />
              <StatCard
                title={t("analytics.metrics.quizAttempts")}
                value={formatNumber(detailedAnalyticsData.quizAttempts)}
                icon={Star}
                gradient="from-amber-500 to-amber-600"
              />
              <StatCard
                title={t("analytics.metrics.quizPassRate")}
                value={detailedAnalyticsData.quizPassRate ? `${detailedAnalyticsData.quizPassRate}%` : "—"}
                icon={TrendingUp}
                gradient="from-cyan-500 to-cyan-600"
              />
            </div>
          </div>

          {/* Section Divider */}
          <AdminSectionLabel label={t("analytics.sections.engagementLearning")} />

          {/* Engagement & Learning Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Active Users Chart */}
            <Card className={cn(
              "group transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 bg-opacity-10 dark:bg-opacity-20 border border-indigo-200/40 dark:border-indigo-800/40 transition-all duration-300 group-hover:scale-110">
                    <LineChart size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.dailyActiveUsers")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.lastDays", { days: analyticsTimeframe })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-72 -mx-2">
                  <AnalyticsAreaChart
                    data={detailedAnalyticsData.dailyActiveUsers || []}
                    color="#6366f1"
                    height={288}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time-of-day Activity */}
            <Card className={cn(
              "group transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-violet-500/40 dark:hover:border-violet-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 bg-opacity-10 dark:bg-opacity-20 border border-violet-200/40 dark:border-violet-800/40 transition-all duration-300 group-hover:scale-110">
                    <Clock size={18} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.activityByHour")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.peakUsageTimes")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-72 -mx-2">
                  <AnalyticsBarChart
                    data={(detailedAnalyticsData.hourlyActivity || []).map((count, hour) => ({
                      label: `${hour}:00`,
                      value: count,
                    }))}
                    color="#8b5cf6"
                    height={288}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Topic Views & Completions by Category */}
            <Card className={cn(
              "group lg:col-span-2 transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-teal-500/40 dark:hover:border-teal-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 bg-opacity-10 dark:bg-opacity-20 border border-teal-200/40 dark:border-teal-800/40 transition-all duration-300 group-hover:scale-110">
                    <BarChart3 size={18} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.topicViewsCompletions")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.categoryPerformance")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-72 -mx-2">
                  <AnalyticsBarChart
                    data={(detailedAnalyticsData.categoryStats || []).map((cat) => ({
                      label: cat.category_title?.substring(0, 15) || cat.category_id,
                      value: cat.views,
                    }))}
                    color="#14b8a6"
                    height={288}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Top 5 Most Viewed Topics */}
            <Card className={cn(
              "group lg:col-span-2 transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-pink-500/40 dark:hover:border-pink-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 bg-opacity-10 dark:bg-opacity-20 border border-pink-200/40 dark:border-pink-800/40 transition-all duration-300 group-hover:scale-110">
                    <Eye size={18} className="text-pink-600 dark:text-pink-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.topViewedTopics")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.mostPopularContent")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(detailedAnalyticsData.topViewedTopics || []).map((topic, idx) => {
                    const maxViews = Math.max(...(detailedAnalyticsData.topViewedTopics || []).map((t) => t.views))
                    const percentage = maxViews > 0 ? (topic.views / maxViews) * 100 : 0
                    return (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl",
                          "bg-muted/40 border border-border/60",
                          "transition-all duration-200",
                          "hover:bg-muted/60 hover:border-indigo-500/40 dark:hover:border-indigo-500/40",
                          "hover:shadow-sm"
                        )}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate text-sm">{topic.title}</p>
                          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-lg font-semibold text-foreground">{formatNumber(topic.views)}</p>
                          <p className="text-xs text-muted-foreground">{t("analytics.charts.views")}</p>
                        </div>
                      </div>
                    )
                  })}
                  {(!detailedAnalyticsData.topViewedTopics || detailedAnalyticsData.topViewedTopics.length === 0) && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/40 mb-3">
                        <Eye size={20} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("analytics.charts.noTopicViews")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Divider */}
          <AdminSectionLabel label={t("analytics.sections.quizProgress")} />

          {/* Quiz & Progress Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quiz Performance by Topic Table */}
            <Card className={cn(
              "group transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-amber-500/40 dark:hover:border-amber-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 bg-opacity-10 dark:bg-opacity-20 border border-amber-200/40 dark:border-amber-800/40 transition-all duration-300 group-hover:scale-110">
                    <Star size={18} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.quizPerformanceByTopic")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.topAttempts")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground">{t("analytics.charts.topic")}</TableHead>
                        <TableHead className="text-right text-muted-foreground">{t("analytics.charts.attempts")}</TableHead>
                        <TableHead className="text-right text-muted-foreground">{t("analytics.charts.avgScore")}</TableHead>
                        <TableHead className="text-right text-muted-foreground">{t("analytics.charts.passRate")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(detailedAnalyticsData.quizPerformanceByTopic || []).slice(0, 10).map((topic, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/40 transition-colors duration-200">
                          <TableCell className="text-foreground text-sm">
                            {topic.topic_id}
                          </TableCell>
                          <TableCell className="text-right font-medium text-foreground">
                            {formatNumber(topic.attempts)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-foreground">
                            {topic.avgScore}%
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={topic.passRate >= 80 ? "default" : topic.passRate >= 60 ? "secondary" : "destructive"}
                              className="font-semibold"
                            >
                              {topic.passRate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!detailedAnalyticsData.quizPerformanceByTopic || detailedAnalyticsData.quizPerformanceByTopic.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/40 mb-3">
                              <Star size={20} className="text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {t("analytics.charts.noQuizData")}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Score Distribution Chart */}
            <Card className={cn(
              "group transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-cyan-500/40 dark:hover:border-cyan-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 bg-opacity-10 dark:bg-opacity-20 border border-cyan-200/40 dark:border-cyan-800/40 transition-all duration-300 group-hover:scale-110">
                    <PieChart size={18} className="text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.scoreDistribution")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.quizScoreRanges")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-72 -mx-2">
                  <AnalyticsBarChart
                    data={Object.entries(detailedAnalyticsData.scoreDistribution || {}).map(([label, value]) => ({
                      label: `${label}%`,
                      value: value,
                    }))}
                    color="#06b6d4"
                    height={288}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Completion Funnel */}
            <Card className={cn(
              "group transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-emerald-500/40 dark:hover:border-emerald-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 bg-opacity-10 dark:bg-opacity-20 border border-emerald-200/40 dark:border-emerald-800/40 transition-all duration-300 group-hover:scale-110">
                    <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.completionFunnel")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.userProgression")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: t("analytics.charts.readTopics"), value: detailedAnalyticsData.completionFunnel?.usersWithReading || 0, color: "from-indigo-500 to-indigo-600" },
                    { label: t("analytics.charts.attemptedQuiz"), value: detailedAnalyticsData.completionFunnel?.usersWithQuizAttempts || 0, color: "from-violet-500 to-violet-600" },
                    { label: t("analytics.charts.passedQuiz"), value: detailedAnalyticsData.completionFunnel?.usersWithPassedQuiz || 0, color: "from-emerald-500 to-emerald-600" },
                  ].map((step, idx) => {
                    const prevValue = idx > 0 ? [
                      detailedAnalyticsData.completionFunnel?.usersWithReading || 0,
                      detailedAnalyticsData.completionFunnel?.usersWithQuizAttempts || 0,
                    ][idx - 1] : 0
                    const conversionRate = prevValue > 0 ? Math.round((step.value / prevValue) * 100) : 0
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{step.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-foreground">{step.value}</span>
                            {idx > 0 && (
                              <Badge variant="secondary" className="text-xs font-medium">
                                {conversionRate}% {t("analytics.charts.conversion")}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-500", step.color)}
                            style={{ width: `${prevValue > 0 ? (step.value / prevValue) * 100 : 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Most Completed Topics */}
            <Card className={cn(
              "group transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
              "hover:border-rose-500/40 dark:hover:border-rose-500/40"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 bg-opacity-10 dark:bg-opacity-20 border border-rose-200/40 dark:border-rose-800/40 transition-all duration-300 group-hover:scale-110">
                    <CheckCircle2 size={18} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <CardTitle className="text-xl">{t("analytics.charts.mostCompletedTopics")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {t("analytics.charts.topCompletionRates")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(detailedAnalyticsData.mostCompletedTopics || []).map((topic, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl",
                        "bg-muted/40 border border-border/60",
                        "transition-all duration-200",
                        "hover:bg-muted/60 hover:border-rose-500/40 dark:hover:border-rose-500/40",
                        "hover:shadow-sm"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {topic.topic_id}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="secondary" className="text-xs">
                            {topic.completionRate}% {t("analytics.charts.completion")}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right ml-4">
                        <p className="text-lg font-semibold text-foreground">{topic.completions}</p>
                        <p className="text-xs text-muted-foreground">{t("analytics.charts.completions")}</p>
                      </div>
                    </div>
                  ))}
                  {(!detailedAnalyticsData.mostCompletedTopics || detailedAnalyticsData.mostCompletedTopics.length === 0) && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/40 mb-3">
                        <CheckCircle2 size={20} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("analytics.charts.noCompletionData")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/40 mb-4">
                <BarChart3 size={32} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("analytics.noData")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AnalyticsPage

