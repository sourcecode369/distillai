import React, { useState } from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Settings, Shield, Database, Download, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminPageHeader from "../layout/admin-page-header"
import SettingsSection from "./settings-section"
import SettingsItem from "./settings-item"
import { cn } from "@/lib/utils"

const SettingsPage = ({ exportData }) => {
  const { t } = useTranslation("admin")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      <div className="space-y-6">
        <SettingsSection icon={Settings} title={t("settings.general.title")}>
          <div className="space-y-3">
            <SettingsItem
              type="switch"
              label={t("settings.general.emailNotifications")}
              description={t("settings.general.emailNotificationsDesc")}
              value={emailNotifications}
              onChange={setEmailNotifications}
            />
            <SettingsItem
              type="switch"
              label={t("settings.general.autoSave")}
              description={t("settings.general.autoSaveDesc")}
              value={autoSave}
              onChange={setAutoSave}
            />
          </div>
        </SettingsSection>

        <SettingsSection icon={Shield} title={t("settings.security.title")}>
          <div className="space-y-4">
            <SettingsItem
              type="select"
              label={t("settings.security.sessionTimeout")}
              description={t("settings.security.sessionTimeoutDesc")}
              value={sessionTimeout}
              onChange={setSessionTimeout}
              options={[
                { value: "15", label: t("settings.security.timeout15") },
                { value: "30", label: t("settings.security.timeout30") },
                { value: "60", label: t("settings.security.timeout60") },
                { value: "120", label: t("settings.security.timeout120") },
              ]}
            />
            <SettingsItem
              type="custom"
              label={t("settings.security.passwordRequirements")}
              description={t("settings.security.passwordRequirementsDesc")}
            >
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                  {t("settings.security.minCharacters")}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                  {t("settings.security.uppercaseLetter")}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                  {t("settings.security.numberRequired")}
                </div>
              </div>
            </SettingsItem>
          </div>
        </SettingsSection>

        <SettingsSection icon={Database} title={t("settings.sections.platformInfo")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={cn(
              "p-4",
              "border-border/60",
              "bg-muted/40"
            )}>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">{t("settings.platformInfo.platformVersion")}</p>
              <p className="text-base font-semibold text-foreground">v1.0.0</p>
            </Card>
            <Card className={cn(
              "p-4",
              "border-border/60",
              "bg-muted/40"
            )}>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">{t("settings.platformInfo.lastUpdated")}</p>
              <p className="text-base font-semibold text-foreground">{new Date().toLocaleDateString()}</p>
            </Card>
            <Card className={cn(
              "p-4",
              "border-border/60",
              "bg-muted/40"
            )}>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">{t("settings.platformInfo.databaseStatus")}</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-base font-semibold text-green-600 dark:text-green-400">{t("settings.platformInfo.connected")}</p>
              </div>
            </Card>
            <Card className={cn(
              "p-4",
              "border-border/60",
              "bg-muted/40"
            )}>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">{t("settings.platformInfo.apiStatus")}</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-base font-semibold text-green-600 dark:text-green-400">{t("settings.platformInfo.operational")}</p>
              </div>
            </Card>
          </div>
        </SettingsSection>

        <SettingsSection icon={Download} title={t("settings.sections.dataExport")}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="secondary"
              size="default"
              onClick={() => exportData("users")}
              className="w-full"
            >
              <Download size={16} />
              {t("settings.dataExport.exportUsers")}
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => exportData("analytics")}
              className="w-full"
            >
              <Download size={16} />
              {t("settings.dataExport.exportAnalytics")}
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => exportData("activity")}
              className="w-full"
            >
              <Download size={16} />
              {t("settings.dataExport.exportActivity")}
            </Button>
          </div>
        </SettingsSection>
      </div>
    </div>
  )
}

SettingsPage.propTypes = {
  exportData: PropTypes.func,
}

export default SettingsPage

