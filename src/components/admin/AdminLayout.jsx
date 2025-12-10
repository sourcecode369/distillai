import React from "react"
import PropTypes from "prop-types"
import { ScrollArea } from "@/components/ui/scroll-area"
import AdminHeader from "./layout/admin-header"
import AdminNav from "./layout/admin-nav"

const AdminLayout = ({ 
  user, 
  activeTab, 
  onTabChange, 
  onRefresh, 
  refreshing = false,
  children 
}) => {
  return (
    <div className="min-h-screen relative z-10 pb-20 bg-gradient-to-br from-white via-indigo-50/20 via-violet-50/10 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:via-violet-950/10 dark:to-slate-800">
      <AdminHeader user={user} onRefresh={onRefresh} refreshing={refreshing} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <AdminNav activeTab={activeTab} onTabChange={onTabChange} />

        {/* Content Area with ScrollArea */}
        <ScrollArea className="w-full">
          <div className="space-y-8">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

AdminLayout.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    full_name: PropTypes.string,
    is_admin: PropTypes.bool,
  }),
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default AdminLayout

