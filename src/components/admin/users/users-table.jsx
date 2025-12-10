import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Eye, UserPlus, UserMinus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const UserCard = ({ user, onViewDetails, onToggleAdmin, onDelete, currentUserId }) => {
  const { t } = useTranslation("admin")
  const isCurrentUser = user.id === currentUserId
  
  return (
    <Card className={cn(
      "p-5",
      "border-border/60",
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background",
      "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      "rounded-2xl",
      "transition-all duration-300",
      "hover:-translate-y-1",
      "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
      "hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="h-12 w-12 flex-shrink-0 border-2 border-border/40 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-600 text-white font-semibold">
              {(user.full_name || user.email || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="font-semibold text-foreground truncate text-sm">
                {user.full_name || t("users.table.noName")}
              </h3>
              {user.is_admin && (
                <Badge variant="default" className="text-xs font-semibold">
                  {t("users.table.adminBadge")}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {t("users.table.joined")} {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onViewDetails}
                  className={cn(
                    "h-9 w-9",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-muted/60"
                  )}
                >
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("users.actions.viewDetails")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {!isCurrentUser && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleAdmin}
                      className={cn(
                        "h-9 w-9",
                        user.is_admin
                          ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/20"
                          : "text-green-600 dark:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/20"
                      )}
                    >
                      {user.is_admin ? <UserMinus size={16} /> : <UserPlus size={16} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.is_admin ? t("users.actions.removeAdmin") : t("users.actions.makeAdmin")}</p>
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
                        "h-9 w-9",
                        "text-red-600 dark:text-red-400",
                        "hover:bg-red-50/50 dark:hover:bg-red-900/20"
                      )}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("users.actions.deleteUser")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    is_admin: PropTypes.bool,
    created_at: PropTypes.string,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onToggleAdmin: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
}

export default UserCard

