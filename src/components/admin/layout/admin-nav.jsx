import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { BarChart3, Users, BookOpen, Mail, Activity, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const AdminNav = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation("admin")
  const tabs = [
    { id: "analytics", label: t("tabs.analytics"), icon: BarChart3 },
    { id: "users", label: t("tabs.users"), icon: Users },
    { id: "content", label: t("tabs.content"), icon: BookOpen },
    { id: "notifications", label: t("tabs.notifications"), icon: Mail },
    { id: "activity", label: t("tabs.activity"), icon: Activity },
    { id: "settings", label: t("tabs.settings"), icon: Settings },
  ]

  return (
    <div className="flex items-center gap-1 rounded-full bg-background/40 border border-border/60 px-2 py-1.5 md:px-3 md:py-2 overflow-x-auto mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-colors",
              "shrink-0",
              isActive
                ? "bg-primary/10 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

AdminNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
}

export default AdminNav

