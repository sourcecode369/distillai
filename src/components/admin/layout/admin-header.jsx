import React from "react"
import PropTypes from "prop-types"
import { Shield, RefreshCw, Moon, Sun, Bell, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useApp } from "@/context/AppContext"
import Hero from "@/components/Hero"
import { cn } from "@/lib/utils"

const AdminHeader = ({ user, onRefresh, refreshing = false }) => {
  const { t } = useTranslation("admin")
  const { darkMode, toggleDarkMode } = useApp()

  // Right actions for Hero component
  const rightActions = (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              className="shrink-0"
            >
              <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
              <span className="hidden sm:inline">{t("header.refresh")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("header.refreshTooltip")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 shrink-0"
            >
              {darkMode ? (
                <Sun size={18} className="text-slate-700 dark:text-slate-300" />
              ) : (
                <Moon size={18} className="text-slate-700 dark:text-slate-300" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{darkMode ? t("header.switchToLightMode") : t("header.switchToDarkMode")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 shrink-0"
            >
              <Bell size={18} className="text-slate-700 dark:text-slate-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("header.notifications")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {(user?.full_name || user?.email || "A")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("header.loggedInAs")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.email?.split("@")[0] || t("common.admin")}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.full_name || t("common.admin")}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User size={16} className="mr-2" />
            {t("common.profile", { ns: "common" }) || "Profile"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleDarkMode}>
            {darkMode ? (
              <>
                <Sun size={16} className="mr-2" />
                {t("header.switchToLightMode")}
              </>
            ) : (
              <>
                <Moon size={16} className="mr-2" />
                {t("header.switchToDarkMode")}
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <Hero
      title={t("header.title")}
      subtitle={t("header.subtitle")}
      icon={<Shield size={22} className="text-white drop-shadow-sm" />}
      rightActions={rightActions}
    />
  )
}

AdminHeader.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    full_name: PropTypes.string,
    is_admin: PropTypes.bool,
  }),
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
}

export default AdminHeader
