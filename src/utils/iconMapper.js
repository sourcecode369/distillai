/**
 * Icon Mapper Utility
 * 
 * Maps icon names (strings) to React icon components from lucide-react
 * This allows us to store icon names in the database instead of React components
 */

import React from "react";
import {
  Brain,
  BookOpen,
  Layers,
  Cpu,
  Code2,
  Network,
  BarChart3,
  Car,
  Headphones,
  Gauge,
  LineChart,
  Scale,
  Palette,
  Smartphone,
  DollarSign,
  Stethoscope,
  GitBranch,
  Package,
  Type,
  BarChart2,
  BrainCircuit,
  Sparkles,
  Bot,
  GraduationCap,
  Target,
  MessageSquare,
  Eye,
  Music,
  FileText,
  Database,
  Table,
  Clock,
  Video,
  Plane,
  Radio,
  Zap,
  Dna,
  Search,
  Shield,
  RefreshCw,
  Trash2,
  Gamepad2,
  Lock,
  Code,
} from "lucide-react";

// Map of icon names to components
const iconMap = {
  Brain,
  BookOpen,
  Layers,
  Cpu,
  Code2,
  Network,
  BarChart3,
  Car,
  Headphones,
  Gauge,
  LineChart,
  Scale,
  Palette,
  Smartphone,
  DollarSign,
  Stethoscope,
  GitBranch,
  Package,
  Type,
  BarChart2,
  BrainCircuit,
  Sparkles,
  Bot,
  GraduationCap,
  Target,
  MessageSquare,
  Eye,
  Music,
  FileText,
  Database,
  Table,
  Clock,
  Video,
  Plane,
  Radio,
  Zap,
  Dna,
  Search,
  Shield,
  RefreshCw,
  Trash2,
  Gamepad2,
  Lock,
  Code,
  // Fallback mappings for incorrectly extracted icon names from database
  // These were likely extracted incorrectly during import, map to closest matching icons
  ChartColumn: BarChart3, // Column chart -> BarChart3
  ChartNoAxesColumn: BarChart3, // Column chart without axes -> BarChart3
  CodeXml: Code2, // XML code -> Code2 (closest match)
};

/**
 * Get icon component from icon name
 * 
 * Maps string icon names (stored in database) to React icon components from lucide-react.
 * If the icon name is not found, returns a FileText icon as a fallback to prevent broken UI.
 * 
 * @param {string} iconName - Name of the icon (e.g., "Brain", "Sparkles", "BookOpen")
 * @param {object} props - Props to pass to the icon component (e.g., { className: "w-6 h-6", size: 24 })
 * @returns {React.Component|null} The icon component, FileText fallback, or null if iconName is falsy
 * 
 * @example
 * getIcon("Brain", { size: 24, className: "text-indigo-600" })
 * // Returns: <Brain size={24} className="text-indigo-600" />
 */
export const getIcon = (iconName, props = {}) => {
  if (!iconName) return null;
  
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    // Use FileText as a fallback icon instead of returning null
    // This prevents broken UI when icon names are incorrect or missing
    console.warn(`Icon "${iconName}" not found in iconMap, using FileText as fallback`);
    return React.createElement(FileText, props);
  }

  return React.createElement(IconComponent, props);
};

/**
 * Check if an icon name exists in the icon map
 * 
 * Validates whether a given icon name is available in the iconMap.
 * Useful for validation before storing icon names in the database.
 * 
 * @param {string} iconName - Name of the icon to check
 * @returns {boolean} True if icon exists in iconMap, false otherwise
 * 
 * @example
 * hasIcon("Brain") // Returns: true
 * hasIcon("InvalidIcon") // Returns: false
 */
export const hasIcon = (iconName) => {
  return iconName && iconName in iconMap;
};

export default {
  getIcon,
  hasIcon,
  iconMap,
};

