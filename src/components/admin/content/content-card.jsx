import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Edit, Trash2, Clock, Tag } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const ContentCard = ({ topic, onEdit, onDelete }) => {
  const { t } = useTranslation("admin")
  return (
    <Card className={cn(
      "h-full flex flex-col mb-0",
      "border-border/60",
      "bg-background/40",
      "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      "rounded-2xl",
      "px-5 py-4 md:px-6 md:py-5",
      "transition-all duration-300",
      "hover:-translate-y-1",
      "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
      "hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-semibold text-foreground mb-2 line-clamp-2">
            {topic.title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="text-xs font-semibold">
              {topic.categoryTitle}
            </Badge>
            <Badge variant="secondary" className="text-xs font-semibold">
              {topic.difficulty}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className={cn(
                    "h-8 w-8",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-muted/60"
                  )}
                >
                  <Edit size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("common.edit")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className={cn(
                    "h-8 w-8",
                    "text-red-600 dark:text-red-400",
                    "hover:bg-red-50/50 dark:hover:bg-red-900/20"
                  )}
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("common.delete")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 mb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {topic.description}
        </p>
      </div>

      <div className="pt-3 border-t border-border/40">
        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-muted-foreground/70" />
            {topic.readTime}
          </span>
          {topic.tags && topic.tags.length > 0 && (
            <span className="flex items-center gap-1.5 flex-1 min-w-0">
              <Tag size={14} className="text-muted-foreground/70 shrink-0" />
              <span className="truncate">
                {topic.tags.slice(0, 3).join(", ")}
                {topic.tags.length > 3 && ` +${topic.tags.length - 3}`}
              </span>
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

ContentCard.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    categoryTitle: PropTypes.string,
    difficulty: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    readTime: PropTypes.string,
    lastUpdated: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default ContentCard

