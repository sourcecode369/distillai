import React, { useState, useEffect, useCallback, memo, useRef } from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Star, Clock, AlertCircle, X, ChevronLeft, ChevronRight, History, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminPageHeader from "../layout/admin-page-header"
import { supabase, dbHelpers } from "@/lib/supabase"

// Helper function to format relative time
const formatRelativeTime = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "today"
  if (diffInDays === 1) return "yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

const FeaturedModelsPage = ({ showToast }) => {
  const { t } = useTranslation("admin")
  const isFirstLoadRef = useRef(true) // Track if it's the first load
  const [initialLoading, setInitialLoading] = useState(true) // Only true on first load
  const [refreshing, setRefreshing] = useState(false) // True when searching/filtering
  const [models, setModels] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [expiredModels, setExpiredModels] = useState([])
  const [searchInput, setSearchInput] = useState("") // Immediate input value
  const [searchQuery, setSearchQuery] = useState("") // Debounced search query
  const [filterStatus, setFilterStatus] = useState("all") // all, featured, not-featured, expired
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [selectedModel, setSelectedModel] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [featuredUntilDate, setFeaturedUntilDate] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])
  const [selectedModelForHistory, setSelectedModelForHistory] = useState(null)
  const [processingModelId, setProcessingModelId] = useState(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timer)
  }, [searchInput])

  const loadData = useCallback(async () => {
    // Only show full loading screen on initial load
    if (isFirstLoadRef.current) {
      setInitialLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      // Build query with pagination and filters
      let query = supabase
        .from('models_catalog')
        .select('id, canonical_model_id, name, publisher, category, tier, is_featured, featured_until, featured_at, featured_by, downloads, likes, access_type', { count: 'exact' })

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,publisher.ilike.%${searchQuery}%`)
      }

      // Apply status filter
      if (filterStatus === 'featured') {
        query = query.eq('is_featured', true)
      } else if (filterStatus === 'not-featured') {
        query = query.eq('is_featured', false)
      } else if (filterStatus === 'expired') {
        query = query.eq('is_featured', true).not('featured_until', 'is', null).lt('featured_until', new Date().toISOString())
      }

      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.order('name', { ascending: true }).range(from, to)

      const { data: modelsData, error: modelsError, count } = await query

      if (modelsError) {
        showToast("Failed to load models", "error")
        console.error('Error loading models:', modelsError)
      } else {
        setModels(modelsData || [])
        setTotalCount(count || 0)
      }

      // Load expired models for warning
      const { data: expiredData } = await dbHelpers.getExpiredFeaturedModels()
      setExpiredModels(expiredData || [])

    } catch (error) {
      console.error('Error in loadData:', error)
      showToast("Failed to load models", "error")
    } finally {
      isFirstLoadRef.current = false // Mark first load as complete
      setInitialLoading(false)
      setRefreshing(false)
    }
  }, [page, pageSize, searchQuery, filterStatus, showToast])

  // Load models and expired warnings
  useEffect(() => {
    loadData()
  }, [loadData])

  const loadHistory = async () => {
    const { data, error } = await dbHelpers.getFeaturedModelsHistory()
    if (!error) {
      setHistory(data || [])
      setShowHistory(true)
      setSelectedModelForHistory(null)
    } else {
      showToast("Failed to load history", "error")
    }
  }

  const loadModelHistory = async (model) => {
    const { data, error } = await dbHelpers.getModelFeaturedHistory(model.id)
    if (!error) {
      setHistory(data || [])
      setSelectedModelForHistory(model)
      setShowHistory(true)
    } else {
      showToast("Failed to load model history", "error")
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter)
    setPage(1) // Reset to first page when filter changes
  }

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value)
    setPage(1) // Reset to first page when search changes
  }

  const handleToggleFeatured = async (model) => {
    if (model.is_featured) {
      // Unfeature
      setProcessingModelId(model.id)
      const { data, error } = await dbHelpers.unfeatureModel(model.id)
      setProcessingModelId(null)

      if (error || (data && !data.success)) {
        showToast(data?.error || "Failed to unfeature model", "error")
      } else {
        showToast(`${model.name} unfeatured successfully`, "success")
        loadData()
      }
    } else {
      // Show date picker
      setSelectedModel(model)
      setShowDatePicker(true)
    }
  }

  const handleFeatureWithDate = async () => {
    if (!selectedModel) return

    setProcessingModelId(selectedModel.id)
    const featuredUntil = featuredUntilDate ? new Date(featuredUntilDate).toISOString() : null
    const { data, error } = await dbHelpers.featureModel(selectedModel.id, featuredUntil)
    setProcessingModelId(null)

    if (error || (data && !data.success)) {
      showToast(data?.error || "Failed to feature model", "error")
    } else {
      showToast(`${selectedModel.name} featured successfully`, "success")
      setShowDatePicker(false)
      setSelectedModel(null)
      setFeaturedUntilDate("")
      loadData()
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, totalCount)

  // Only show loading screen on initial load
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={t("featuredModels.title", "Featured Models Management")}
        subtitle={t("featuredModels.subtitle", "Manage which models appear in the featured section")}
        action={
          <button
            onClick={loadHistory}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            {t("featuredModels.actions.viewHistory", "View History")}
          </button>
        }
      />

      {/* Expired Warning */}
      {expiredModels.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  {expiredModels.length} Featured Model(s) Past Target Date
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                  These models have passed their "featured until" date but remain featured. Manually unfeature them when ready.
                </p>
                <div className="flex flex-wrap gap-2">
                  {expiredModels.map(model => (
                    <Badge key={model.id} variant="outline" className="bg-white dark:bg-slate-800">
                      {model.name} (expired {formatRelativeTime(model.featured_until)})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "all"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          All Models
        </button>
        <button
          onClick={() => handleFilterChange("featured")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "featured"
              ? "bg-amber-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Featured Only
        </button>
        <button
          onClick={() => handleFilterChange("not-featured")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "not-featured"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Not Featured
        </button>
        {expiredModels.length > 0 && (
          <button
            onClick={() => handleFilterChange("expired")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "expired"
                ? "bg-amber-600 text-white"
                : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
            }`}
          >
            Expired ({expiredModels.length})
          </button>
        )}
      </div>

      {/* Search and Page Size */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <input
                type="text"
                placeholder={t("featuredModels.searchPlaceholder", "Search models...")}
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pr-10 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {refreshing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={18} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
            </div>

            {/* Page Size */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Show:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                className="px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Showing {totalCount > 0 ? startIndex : 0}-{endIndex} of {totalCount} models
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t("featuredModels.table.model", "Model")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t("featuredModels.table.category", "Category")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t("featuredModels.table.status", "Status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t("featuredModels.table.featuredUntil", "Featured Until")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t("featuredModels.table.actions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {models.map(model => {
                  const isExpired = model.featured_until && new Date(model.featured_until) < new Date()
                  const isProcessing = processingModelId === model.id

                  return (
                    <tr key={model.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {model.is_featured && (
                            <Star className="text-amber-500 fill-amber-500 shrink-0" size={16} />
                          )}
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {model.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {model.publisher}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{model.category || "LLM"}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {model.is_featured ? (
                          <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                            Featured
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Featured</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {model.featured_until ? (
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span className={isExpired ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                              {new Date(model.featured_until).toLocaleDateString()}
                              {isExpired && " (expired)"}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => loadModelHistory(model)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="View History"
                          >
                            <History size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(model)}
                            disabled={isProcessing}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              model.is_featured
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                            }`}
                          >
                            {isProcessing ? "Processing..." : model.is_featured ? t("featuredModels.actions.unfeature", "Unfeature") : t("featuredModels.actions.feature", "Feature")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {models.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No models found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && selectedModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("featuredModels.modal.featureTitle", { name: selectedModel.name }, `Feature ${selectedModel.name}`)}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("featuredModels.modal.featuredUntilLabel", "Featured Until (Optional)")}
                  </label>
                  <input
                    type="date"
                    value={featuredUntilDate}
                    onChange={(e) => setFeaturedUntilDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("featuredModels.modal.featuredUntilHelp", "This date is for reference only. Model will stay featured until manually removed.")}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleFeatureWithDate}
                    disabled={processingModelId === selectedModel.id}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingModelId === selectedModel.id ? "Processing..." : t("featuredModels.modal.confirmFeature", "Feature Model")}
                  </button>
                  <button
                    onClick={() => {
                      setShowDatePicker(false)
                      setSelectedModel(null)
                      setFeaturedUntilDate("")
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t("featuredModels.modal.cancel", "Cancel")}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedModelForHistory
                      ? `History: ${selectedModelForHistory.name}`
                      : t("featuredModels.history.title", "Featured Models History")}
                  </h3>
                  {selectedModelForHistory && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {selectedModelForHistory.publisher}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowHistory(false)
                    setSelectedModelForHistory(null)
                  }}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No featured history yet
                  </div>
                ) : (
                  history.map(entry => {
                    const duration = entry.unfeatured_at
                      ? Math.round((new Date(entry.unfeatured_at) - new Date(entry.featured_at)) / (1000 * 60 * 60 * 24))
                      : Math.round((new Date() - new Date(entry.featured_at)) / (1000 * 60 * 60 * 24))

                    return (
                      <div key={entry.id} className="p-4 border rounded-lg dark:border-slate-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{entry.model_name}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{entry.publisher}</div>
                          </div>
                          <Badge variant={entry.unfeatured_at ? "outline" : "default"}>
                            {entry.unfeatured_at ? t("featuredModels.history.ended", "Ended") : t("featuredModels.history.active", "Active")}
                          </Badge>
                        </div>

                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <div>{t("featuredModels.history.featured", "Featured")}: {new Date(entry.featured_at).toLocaleDateString()}</div>
                          {entry.unfeatured_at && (
                            <div>{t("featuredModels.history.unfeatured", "Unfeatured")}: {new Date(entry.unfeatured_at).toLocaleDateString()}</div>
                          )}
                          {entry.featured_until && (
                            <div>{t("featuredModels.history.targetEnd", "Target End")}: {new Date(entry.featured_until).toLocaleDateString()}</div>
                          )}
                          <div>
                            {t("featuredModels.history.duration", "Duration")}: {entry.unfeatured_at
                              ? t("featuredModels.history.daysTotal", { days: duration }, `${duration} days`)
                              : t("featuredModels.history.daysOngoing", { days: duration }, `${duration} days (ongoing)`)
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

FeaturedModelsPage.propTypes = {
  showToast: PropTypes.func.isRequired,
}

export default memo(FeaturedModelsPage)
