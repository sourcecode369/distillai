import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Search, Plus, Database, Download, Loader2, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const ContentToolbar = ({
  searchQuery,
  onSearchChange,
  onAddTopic,
  onImportStaticData,
  onImportStaticTopics,
  onImportStaticWeeklyReports,
  importingData,
  importingTopics,
  importingWeeklyReports,
  importProgress,
  weeklyReportImportProgress,
  categoriesLength,
}) => {
  const { t } = useTranslation("admin")
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      <div className="relative flex-1 sm:flex-initial min-w-[200px]">
        <Label htmlFor="content-search" className="sr-only">
          {t("content.search.label")}
        </Label>
        <Search className={cn(
          "absolute left-3.5 top-1/2 -translate-y-1/2",
          "text-muted-foreground",
          "pointer-events-none"
        )} size={18} />
        <Input
          id="content-search"
          type="text"
          placeholder={t("content.search.placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-11 w-full sm:w-64",
            "bg-background border-border/60",
            "text-foreground placeholder:text-muted-foreground",
            "focus:border-indigo-500/50 dark:focus:border-indigo-500/50"
          )}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={onAddTopic}
          variant="default"
          size="default"
          className="group shrink-0 rounded-full md:rounded-full px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">{t("content.toolbar.addTopic")}</span>
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onImportStaticData}
                disabled={importingData}
                variant="secondary"
                size="default"
                className="group shrink-0"
              >
                {importingData ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="hidden sm:inline">{t("content.toolbar.importingData")}</span>
                  </>
                ) : (
                  <>
                    <Database size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">{t("content.toolbar.importSectionsCategories")}</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("content.toolbar.importSectionsTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onImportStaticTopics}
                disabled={importingTopics || categoriesLength === 0}
                variant="secondary"
                size="default"
                className="group shrink-0"
              >
                {importingTopics ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="hidden sm:inline">
                      {t("content.toolbar.importingProgress", { current: importProgress.current, total: importProgress.total })}
                    </span>
                  </>
                ) : (
                  <>
                    <Download size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">{t("content.toolbar.importStaticTopics")}</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {categoriesLength === 0 
                  ? t("content.toolbar.importSectionsFirst")
                  : t("content.toolbar.importTopicsTooltip")}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {onImportStaticWeeklyReports && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onImportStaticWeeklyReports}
                  disabled={importingWeeklyReports}
                  variant="secondary"
                  size="default"
                  className="group shrink-0"
                >
                  {importingWeeklyReports ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="hidden sm:inline">
                        {weeklyReportImportProgress?.current && weeklyReportImportProgress?.total
                          ? `Importing ${weeklyReportImportProgress.current}/${weeklyReportImportProgress.total}...`
                          : t("content.toolbar.importingWeeklyReports")}
                      </span>
                    </>
                  ) : (
                    <>
                      <FileText size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline">{t("content.toolbar.importWeeklyReports")}</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("content.toolbar.importWeeklyReportsTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}

ContentToolbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAddTopic: PropTypes.func.isRequired,
  onImportStaticData: PropTypes.func.isRequired,
  onImportStaticTopics: PropTypes.func.isRequired,
  onImportStaticWeeklyReports: PropTypes.func,
  importingData: PropTypes.bool.isRequired,
  importingTopics: PropTypes.bool.isRequired,
  importingWeeklyReports: PropTypes.bool,
  importProgress: PropTypes.number,
  weeklyReportImportProgress: PropTypes.object,
  categoriesLength: PropTypes.number,
}

export default ContentToolbar

