import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AdminPageHeader from "../layout/admin-page-header"
import UsersSearchBar from "./users-search-bar"
import UsersFilters from "./users-filters"
import UserCard from "./users-table"
import VirtualList from "@/components/VirtualList"
import { EmptyUsers } from "@/components/EmptyState"
import { cn } from "@/lib/utils"

const UsersPage = ({
  searchQuery,
  onSearchChange,
  userFilter,
  sortBy,
  onFilterChange,
  onSortChange,
  filteredUsers,
  onViewDetails,
  onToggleAdmin,
  onDelete,
  currentUserId,
  onExport,
}) => {
  const { t } = useTranslation("admin")
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={t("users.title")}
        subtitle={t("users.subtitle")}
        actions={
          <Button
            variant="secondary"
            size="default"
            onClick={onExport}
            className="shrink-0"
          >
            <Download size={16} />
            <span className="hidden sm:inline">{t("users.export")}</span>
          </Button>
        }
      />

      {/* Filters and Search */}
      <Card className={cn(
        "border-border/60",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="md:max-w-xl w-full">
              <UsersSearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
            </div>
            <div className="flex gap-2 md:gap-3 shrink-0">
              <UsersFilters
                userFilter={userFilter}
                sortBy={sortBy}
                onFilterChange={onFilterChange}
                onSortChange={onSortChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <EmptyUsers searchQuery={searchQuery} />
      ) : filteredUsers.length > 20 ? (
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardContent className="p-6">
            <VirtualList
              items={filteredUsers}
              itemHeight={100}
              overscan={5}
              containerClassName="h-[600px]"
              getItemKey={(user) => user.id}
              renderItem={(userItem) => (
                <div className="mb-3">
                  <UserCard
                    user={userItem}
                    onViewDetails={() => onViewDetails(userItem)}
                    onToggleAdmin={() => onToggleAdmin(userItem.id, userItem.is_admin)}
                    onDelete={() => onDelete(userItem)}
                    currentUserId={currentUserId}
                  />
                </div>
              )}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className={cn(
          "border-border/60",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-muted/20 to-background"
        )}>
          <CardContent className="p-6">
            <div className="space-y-3">
              {filteredUsers.map((userItem) => (
                <UserCard
                  key={userItem.id}
                  user={userItem}
                  onViewDetails={() => onViewDetails(userItem)}
                  onToggleAdmin={() => onToggleAdmin(userItem.id, userItem.is_admin)}
                  onDelete={() => onDelete(userItem)}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

UsersPage.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  userFilter: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  filteredUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string,
      full_name: PropTypes.string,
      is_admin: PropTypes.bool,
      created_at: PropTypes.string,
    })
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onToggleAdmin: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  onExport: PropTypes.func,
}

export default UsersPage

