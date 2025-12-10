import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Mail, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const NotificationsForm = ({
  title,
  body,
  targetType,
  selectedUserIds,
  allUsers,
  currentUser,
  isSending,
  onTitleChange,
  onBodyChange,
  onTargetTypeChange,
  onToggleUserSelection,
  onSubmit,
}) => {
  const { t } = useTranslation("admin")
  const filteredUsers = allUsers.filter((u) => u.id !== currentUser?.id)

  return (
    <Card className={cn(
      "border-border/60",
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background",
      "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      "rounded-2xl"
    )}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          {t("notifications.form.title")}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {t("notifications.form.subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="notification-title" className="text-sm font-medium text-foreground">
            {t("notifications.form.titleLabel")}
          </Label>
          <Input
            id="notification-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t("notifications.form.titlePlaceholder")}
            maxLength={100}
            className={cn(
              "bg-background border-border/60",
              "text-foreground placeholder:text-muted-foreground",
              "focus:border-indigo-500/50 dark:focus:border-indigo-500/50"
            )}
          />
          <p className="text-xs text-muted-foreground">
            {t("notifications.form.titleMaxLength", { length: title.length })}
          </p>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="notification-body" className="text-sm font-medium text-foreground">
            {t("notifications.form.messageLabel")}
          </Label>
          <Textarea
            id="notification-body"
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder={t("notifications.form.messagePlaceholder")}
            rows={5}
            maxLength={500}
            className={cn(
              "bg-background border-border/60",
              "text-foreground placeholder:text-muted-foreground",
              "focus:border-indigo-500/50 dark:focus:border-indigo-500/50",
              "resize-none"
            )}
          />
          <p className="text-xs text-muted-foreground">
            {t("notifications.form.messageMaxLength", { length: body.length })}
          </p>
        </div>

        {/* Target Audience */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            {t("notifications.form.sendToLabel")}
          </Label>
          <RadioGroup 
            value={targetType} 
            onValueChange={onTargetTypeChange} 
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className={cn(
              "flex items-center gap-2 cursor-pointer",
              "px-4 py-3 rounded-xl",
              "border border-border/60",
              "bg-muted/40",
              "hover:bg-muted/60 hover:border-indigo-500/40 dark:hover:border-indigo-500/40",
              "transition-all duration-200",
              targetType === "all" && "border-indigo-500/60 bg-indigo-50/50 dark:bg-indigo-900/20"
            )}>
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm font-medium text-foreground cursor-pointer">
                {t("notifications.form.allUsers")}
              </Label>
            </div>
            <div className={cn(
              "flex items-center gap-2 cursor-pointer",
              "px-4 py-3 rounded-xl",
              "border border-border/60",
              "bg-muted/40",
              "hover:bg-muted/60 hover:border-indigo-500/40 dark:hover:border-indigo-500/40",
              "transition-all duration-200",
              targetType === "specific" && "border-indigo-500/60 bg-indigo-50/50 dark:bg-indigo-900/20"
            )}>
              <RadioGroupItem value="specific" id="specific" />
              <Label htmlFor="specific" className="text-sm font-medium text-foreground cursor-pointer">
                {t("notifications.form.specificUsers")}
              </Label>
            </div>
          </RadioGroup>

          {targetType === "specific" && (
            <div className="space-y-3">
              <div className={cn(
                "border border-border/60 rounded-xl",
                "bg-muted/40",
                "overflow-hidden"
              )}>
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("notifications.form.noUsersAvailable")}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-64">
                    <div className="p-4 space-y-2">
                      {filteredUsers.map((u) => (
                        <label
                          key={u.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl",
                            "cursor-pointer transition-all duration-200",
                            "border border-transparent",
                            "hover:bg-muted/60 hover:border-border/60"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(u.id)}
                            onChange={() => onToggleUserSelection(u.id)}
                            className={cn(
                              "w-4 h-4 rounded",
                              "text-indigo-600 focus:ring-indigo-500",
                              "border-border/60",
                              "bg-background"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {u.full_name || u.email}
                            </p>
                            {u.full_name && (
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
              {selectedUserIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs font-semibold">
                    {selectedUserIds.length === 1 
                      ? t("notifications.form.usersSelected", { count: selectedUserIds.length })
                      : t("notifications.form.usersSelectedPlural", { count: selectedUserIds.length })}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-6 border-t border-border/40">
        <Button
          onClick={onSubmit}
          disabled={isSending || !title.trim() || !body.trim() || (targetType === "specific" && selectedUserIds.length === 0)}
          variant="default"
          size="default"
          className="w-full sm:w-auto sm:ml-auto"
        >
          {isSending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>{t("notifications.form.sending")}</span>
            </>
          ) : (
            <>
              <Mail size={18} />
              <span>{t("notifications.form.send")}</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

NotificationsForm.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  targetType: PropTypes.oneOf(["all", "selected"]).isRequired,
  selectedUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  allUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string,
      full_name: PropTypes.string,
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string,
  }),
  isSending: PropTypes.bool.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onBodyChange: PropTypes.func.isRequired,
  onTargetTypeChange: PropTypes.func.isRequired,
  onToggleUserSelection: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default NotificationsForm

