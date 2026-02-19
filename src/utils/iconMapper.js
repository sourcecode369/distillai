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

export const getIcon = (iconName, props = {}) => {
  if (!iconName) return null;
  
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    // Use FileText as a fallback icon instead of returning null
    // This prevents broken UI when icon names are incorrect or missing
    return React.createElement(FileText, props);
  }

  return React.createElement(IconComponent, props);
};

export const hasIcon = (iconName) => {
  return iconName && iconName in iconMap;
};

export default {
  getIcon,
  hasIcon,
  iconMap,
};

