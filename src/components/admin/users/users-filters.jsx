import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const UsersFilters = ({ userFilter, sortBy, onFilterChange, onSortChange }) => {
  const { t } = useTranslation("admin")
  return (
    <>
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <Label htmlFor="user-filter" className="text-xs text-muted-foreground font-medium">
          {t("users.table.role")}
        </Label>
        <Select value={userFilter} onValueChange={onFilterChange}>
          <SelectTrigger id="user-filter" className="w-full">
            <SelectValue placeholder={t("users.table.role")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("users.filters.all")}</SelectItem>
            <SelectItem value="admin">{t("users.filters.admin")}</SelectItem>
            <SelectItem value="regular">{t("users.filters.regular")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <Label htmlFor="user-sort" className="text-xs text-muted-foreground font-medium">
          {t("common.sort")}
        </Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger id="user-sort" className="w-full">
            <SelectValue placeholder={t("common.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("users.sort.newest")}</SelectItem>
            <SelectItem value="oldest">{t("users.sort.oldest")}</SelectItem>
            <SelectItem value="name">{t("users.sort.name")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

UsersFilters.propTypes = {
  userFilter: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
}

export default UsersFilters

