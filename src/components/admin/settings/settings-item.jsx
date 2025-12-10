import React from "react"
import PropTypes from "prop-types"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const SettingsItem = ({ 
  type = "switch", 
  label, 
  description, 
  value, 
  onChange, 
  options = [],
  children 
}) => {
  if (type === "switch") {
    return (
      <div className={cn(
        "flex items-center justify-between",
        "p-4 rounded-xl",
        "border border-border/60",
        "bg-muted/40",
        "transition-all duration-200",
        "hover:bg-muted/60 hover:border-border/80"
      )}>
        <div className="flex-1 min-w-0 pr-4">
          <Label className="text-sm font-medium text-foreground block mb-1">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <Switch checked={value} onCheckedChange={onChange} />
        </div>
      </div>
    )
  }

  if (type === "select") {
    return (
      <div className={cn(
        "p-4 rounded-xl",
        "border border-border/60",
        "bg-muted/40",
        "transition-all duration-200",
        "hover:bg-muted/60 hover:border-border/80"
      )}>
        <div className="mb-3">
          <Label className="text-sm font-medium text-foreground block mb-1">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <Select value={String(value)} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  if (type === "custom") {
    return (
      <div className={cn(
        "p-4 rounded-xl",
        "border border-border/60",
        "bg-muted/40",
        "transition-all duration-200",
        "hover:bg-muted/60 hover:border-border/80"
      )}>
        <div className="mb-3">
          <Label className="text-sm font-medium text-foreground block mb-1">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    )
  }

  return null
}

SettingsItem.propTypes = {
  type: PropTypes.oneOf(["switch", "select", "custom"]),
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  children: PropTypes.node,
}

export default SettingsItem

