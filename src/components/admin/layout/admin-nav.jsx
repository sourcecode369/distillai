import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { BarChart3, Users, BookOpen, Mail, Activity, Settings, MessageSquare } from "lucide-react"

const AdminNav = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation("admin")
  const tabs = [
    { id: "analytics",     label: t("tabs.analytics"),      icon: BarChart3 },
    { id: "users",         label: t("tabs.users"),           icon: Users },
    { id: "content",       label: t("tabs.content"),         icon: BookOpen },
    { id: "messages",      label: t("tabs.messages"),        icon: MessageSquare },
    { id: "notifications", label: t("tabs.notifications"),   icon: Mail },
    { id: "activity",      label: t("tabs.activity"),        icon: Activity },
    { id: "settings",      label: t("tabs.settings"),        icon: Settings },
  ]

  return (
    <div className="flex items-center gap-0.5 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm px-2 py-2 overflow-x-auto mb-6 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={[
              "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 shrink-0",
              isActive
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/60"
            ].join(" ")}
          >
            <Icon size={14} />
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

