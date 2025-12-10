import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const UsersSearchBar = ({ searchQuery, onSearchChange }) => {
  const { t } = useTranslation("admin")
  return (
    <div className="relative flex-1">
      <Label htmlFor="user-search" className="sr-only">
        {t("users.search.placeholder")}
      </Label>
      <Search className={cn(
        "absolute left-3.5 top-1/2 -translate-y-1/2",
        "text-muted-foreground",
        "pointer-events-none"
      )} size={18} />
      <Input
        id="user-search"
        type="text"
        placeholder={t("users.search.placeholder")}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(
          "pl-11",
          "bg-background border-border/60",
          "text-foreground placeholder:text-muted-foreground",
          "focus:border-indigo-500/50 dark:focus:border-indigo-500/50"
        )}
      />
    </div>
  )
}

UsersSearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
}

export default UsersSearchBar

