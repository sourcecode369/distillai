import React from "react"
import PropTypes from "prop-types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const SettingsSection = ({ icon: Icon, title, description, children }) => {
  const IconComponent = Icon
  return (
    <Card className={cn(
      "border-border/60",
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background",
      "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      "rounded-2xl"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl",
            "bg-gradient-to-br from-indigo-500 to-indigo-600",
            "bg-opacity-10 dark:bg-opacity-20",
            "border border-indigo-200/40 dark:border-indigo-800/40"
          )}>
            <IconComponent size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground tracking-tight">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

SettingsSection.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default SettingsSection

