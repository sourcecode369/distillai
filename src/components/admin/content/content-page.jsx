import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import AdminPageHeader from "../layout/admin-page-header"
import ContentToolbar from "./content-toolbar"
import ContentCard from "./content-card"
import VirtualList from "@/components/VirtualList"
import { EmptySearch } from "@/components/EmptyState"
import { cn } from "@/lib/utils"

const ContentPage = ({
  searchQuery,
  onSearchChange,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onImportStaticData,
  onImportStaticTopics,
  onImportStaticWeeklyReports,
  importingData,
  importingTopics,
  importingWeeklyReports,
  importProgress,
  weeklyReportImportProgress,
  categoriesLength,
  loadingTopics,
  filteredTopics,
}) => {
  const { t } = useTranslation("admin")
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={t("content.title")}
        subtitle={t("content.subtitle")}
      />

      {/* Toolbar */}
      <Card className={cn(
        "border-border/60",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
      )}>
        <CardContent className="p-6">
          <ContentToolbar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onAddTopic={onAddTopic}
            onImportStaticData={onImportStaticData}
            onImportStaticTopics={onImportStaticTopics}
            onImportStaticWeeklyReports={onImportStaticWeeklyReports}
            importingData={importingData}
            importingTopics={importingTopics}
            importingWeeklyReports={importingWeeklyReports}
            importProgress={importProgress}
            weeklyReportImportProgress={weeklyReportImportProgress}
            categoriesLength={categoriesLength}
          />
        </CardContent>
      </Card>

      {/* Content Grid */}
      {loadingTopics ? (
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 text-indigo-600 dark:text-indigo-400 animate-spin" size={32} />
              <p className="text-muted-foreground">{t("content.loading")}</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredTopics.length === 0 ? (
        <EmptySearch 
          searchQuery={searchQuery} 
          onClear={() => onSearchChange("")}
        />
      ) : filteredTopics.length > 20 ? (
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardContent className="p-6">
            <VirtualList
              items={filteredTopics}
              itemHeight={180}
              overscan={5}
              containerClassName="h-[600px]"
              getItemKey={(topic) => `${topic.categoryId}-${topic.id}`}
              renderItem={(topic) => (
                <div className="mb-4">
                  <ContentCard
                    topic={topic}
                    onEdit={() => onEditTopic(topic)}
                    onDelete={() => onDeleteTopic(topic)}
                  />
                </div>
              )}
            />
          </CardContent>
        </Card>
        ) : (
        <div className="space-y-4 md:space-y-5 mt-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <ContentCard
                key={`${topic.categoryId}-${topic.id}`}
                topic={topic}
                onEdit={() => onEditTopic(topic)}
                onDelete={() => onDeleteTopic(topic)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

ContentPage.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAddTopic: PropTypes.func.isRequired,
  onEditTopic: PropTypes.func.isRequired,
  onDeleteTopic: PropTypes.func.isRequired,
  onImportStaticData: PropTypes.func.isRequired,
  onImportStaticTopics: PropTypes.func.isRequired,
  onImportStaticWeeklyReports: PropTypes.func,
  importingData: PropTypes.bool.isRequired,
  importingTopics: PropTypes.bool.isRequired,
  importingWeeklyReports: PropTypes.bool,
  importProgress: PropTypes.number,
  weeklyReportImportProgress: PropTypes.object,
  categoriesLength: PropTypes.number,
  loadingTopics: PropTypes.bool.isRequired,
  filteredTopics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      categoryTitle: PropTypes.string,
      difficulty: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      description: PropTypes.string,
      readTime: PropTypes.string,
      lastUpdated: PropTypes.string,
    })
  ).isRequired,
}

export default ContentPage

