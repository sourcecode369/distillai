import React from "react"
import { useTranslation } from "react-i18next"
import { Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ActivityEmpty = () => {
  const { t } = useTranslation("admin")
  return (
    <Card className={cn(
      "border-border/60",
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
    )}>
      <CardContent className="p-12">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted/40 dark:bg-muted/30 mb-6 border border-border/60">
            <Activity size={40} className="text-muted-foreground/60" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
            {t("activity.empty.title")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {t("activity.empty.description")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityEmpty
