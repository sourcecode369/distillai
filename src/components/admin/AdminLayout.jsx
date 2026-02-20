import React from "react"
import PropTypes from "prop-types"
import { Shield, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import AdminNav from "./layout/admin-nav"

const AdminLayout = ({
  user,
  activeTab,
  onTabChange,
  onRefresh,
  refreshing = false,
  children
}) => {
  const { t } = useTranslation("admin")

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="relative border-b border-gray-800/60">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-0 top-0 w-96 h-32 rounded-full bg-indigo-600/6 blur-[80px]" />
          <div className="absolute right-0 top-0 w-64 h-24 rounded-full bg-violet-600/5 blur-[60px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          {/* Left: title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex-shrink-0">
              <Shield size={16} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-100 leading-none">{t("header.title")}</h1>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-none hidden sm:block">{t("header.subtitle")}</p>
            </div>
          </div>

          {/* Right: user + refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/60 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 hover:border-gray-700 transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{t("header.refresh")}</span>
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/60 px-3 py-1.5">
              <div className="h-6 w-6 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 flex-shrink-0">
                {(user?.full_name || user?.email || "A")[0].toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-gray-300 hidden sm:inline truncate max-w-[120px]">
                {user?.email?.split("@")[0] || "Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <AdminNav activeTab={activeTab} onTabChange={onTabChange} />
        <div className="space-y-6">
          {children}
        </div>
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
