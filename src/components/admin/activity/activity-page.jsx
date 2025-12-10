import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminPageHeader from "../layout/admin-page-header"
import ActivityEmpty from "./activity-empty"
import ActivityList from "./activity-list"

const ActivityPage = ({ activityLogs, formatRelativeTime, onExport }) => {
  const { t } = useTranslation("admin")
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={t("activity.title")}
        subtitle={t("activity.subtitle")}
        actions={
          <Button
            variant="secondary"
            size="default"
            onClick={onExport}
            className="shrink-0"
          >
            <Download size={18} />
            <span className="hidden sm:inline">{t("activity.export")}</span>
          </Button>
        }
      />

      {/* Content */}
      {activityLogs.length === 0 ? (
        <ActivityEmpty />
      ) : (
        <ActivityList activities={activityLogs} formatRelativeTime={formatRelativeTime} />
      )}
    </div>
  )
}

ActivityPage.propTypes = {
  activityLogs: PropTypes.arrayOf(
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
  onExport: PropTypes.func,
}

export default ActivityPage
