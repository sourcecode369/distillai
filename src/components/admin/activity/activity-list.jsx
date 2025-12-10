import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Bookmark, Eye, CheckCircle2, Activity as ActivityIcon, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ActivityList = ({ activities, formatRelativeTime }) => {
  const { t } = useTranslation("admin")
  const getActivityIcon = (type) => {
    switch (type) {
      case "bookmark":
        return <Bookmark size={18} className="text-indigo-600 dark:text-indigo-400" />
      case "reading":
        return <Eye size={18} className="text-violet-600 dark:text-violet-400" />
      case "progress":
        return <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400" />
      default:
        return <ActivityIcon size={18} className="text-gray-600 dark:text-gray-400" />
    }
  }

  const getActivityBadgeVariant = (type) => {
    switch (type) {
      case "bookmark":
        return "default"
      case "reading":
        return "secondary"
      case "progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case "bookmark":
        return t("activity.types.bookmark")
      case "reading":
        return t("activity.types.reading")
      case "progress":
        return t("activity.types.progress")
      default:
        return t("activity.types.activity")
    }
  }

  return (
    <Card className={cn(
      "border-border/60",
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
    )}>
      <CardContent className="p-6">
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className="group flex items-start gap-4 p-4 rounded-xl bg-muted/40 dark:bg-muted/30 border border-border/60 hover:bg-muted/60 dark:hover:bg-muted/40 hover:border-border transition-all duration-200"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 rounded-lg bg-background/80 dark:bg-background/50 border border-border/60">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant={getActivityBadgeVariant(activity.type)}
                      className="text-xs font-semibold"
                    >
                      {getActivityTypeLabel(activity.type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} />
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">{activity.user?.email || t("activity.unknownUser")}</span>{" "}
                  {activity.type === "bookmark" && t("activity.actions.bookmarked")}
                  {activity.type === "reading" && t("activity.actions.read")}
                  {activity.type === "progress" && (activity.completed ? t("activity.actions.completed") : t("activity.actions.updatedProgress"))}{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {activity.title || activity.category || t("activity.content")}
                  </span>
                  {activity.progress !== undefined && ` (${activity.progress}% ${t("activity.complete")})`}
                  {activity.score !== undefined && activity.score !== null && ` (${t("activity.score")}: ${activity.score}%)`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
      user: PropTypes.shape({
        email: PropTypes.string,
      }),
      title: PropTypes.string,
      category: PropTypes.string,
      completed: PropTypes.bool,
      progress: PropTypes.number,
      score: PropTypes.number,
    })
  ).isRequired,
  formatRelativeTime: PropTypes.func.isRequired,
}

export default ActivityList
