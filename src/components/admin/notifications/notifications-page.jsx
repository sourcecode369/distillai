import React, { useState } from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import NotificationsForm from "./notifications-form"
import AdminPageHeader from "../layout/admin-page-header"
import { dbHelpers } from "@/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"

const NotificationsPage = ({ user, showToast, allUsers }) => {
  const { t } = useTranslation("admin")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [targetType, setTargetType] = useState("all")
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [isSending, setIsSending] = useState(false)
  const queryClient = useQueryClient()

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      showToast("Please fill in both title and body", "error")
      return
    }

    if (targetType === "specific" && selectedUserIds.length === 0) {
      showToast("Please select at least one user", "error")
      return
    }

    setIsSending(true)
    try {
      if (targetType === "all") {
        if (!user?.id) {
          showToast("User not authenticated", "error")
          setIsSending(false)
          return
        }
        
        const { data, error } = await dbHelpers.createNotificationForAllUsers(
          title,
          body,
          user.id
        )
        if (error) {
          console.error("Error creating notifications:", error)
          if (error.partial && data && data.length > 0) {
            showToast(`Partially sent: ${data.length} notifications created, but some failed`, "error")
          } else {
            showToast(`Failed to send notification: ${error.message || "Unknown error"}`, "error")
          }
          return
        }
        const count = data?.length || 0
        showToast(`Notification sent to ${count} user(s)`, "success")
      } else {
        if (!user?.id) {
          showToast("User not authenticated", "error")
          setIsSending(false)
          return
        }
        
        const results = await Promise.allSettled(
          selectedUserIds.map((userId) =>
            dbHelpers.createNotification({
              userId,
              title,
              body,
              createdBy: user.id,
            })
          )
        )
        
        const successful = results.filter(r => r.status === "fulfilled" && !r.value.error).length
        const failed = results.filter(r => r.status === "rejected" || (r.status === "fulfilled" && r.value.error)).length
        
        if (failed > 0) {
          if (successful > 0) {
            showToast(`Partially sent: ${successful} succeeded, ${failed} failed`, "error")
          } else {
            showToast("Failed to send notifications", "error")
          }
          return
        }
        showToast(`Notification sent to ${successful} user(s)`, "success")
      }

      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })

      setTitle("")
      setBody("")
      setSelectedUserIds([])
      setTargetType("all")
    } catch (error) {
      console.error("Error sending notification:", error)
      showToast("Failed to send notification", "error")
    } finally {
      setIsSending(false)
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={t("notifications.title")}
        subtitle={t("notifications.subtitle")}
      />

      <NotificationsForm
        title={title}
        body={body}
        targetType={targetType}
        selectedUserIds={selectedUserIds}
        allUsers={allUsers}
        currentUser={user}
        isSending={isSending}
        onTitleChange={setTitle}
        onBodyChange={setBody}
        onTargetTypeChange={setTargetType}
        onToggleUserSelection={toggleUserSelection}
        onSubmit={handleSendNotification}
      />
    </div>
  )
}

NotificationsPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    full_name: PropTypes.string,
    is_admin: PropTypes.bool,
  }),
  showToast: PropTypes.func.isRequired,
  allUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string,
      full_name: PropTypes.string,
    })
  ).isRequired,
}

export default NotificationsPage

