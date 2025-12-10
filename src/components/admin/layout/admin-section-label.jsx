import React from "react"
import PropTypes from "prop-types"
import { cn } from "@/lib/utils"

const AdminSectionLabel = ({ label, className }) => {
  return (
    <div className={cn("flex items-center gap-3 mb-4 md:mb-6", className)}>
      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  )
}

AdminSectionLabel.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default AdminSectionLabel


