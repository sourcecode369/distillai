import React from "react";
import { Shield, BarChart2 } from "../shared/icons";

export const modelMonitoringSection = {
  title: "Model Monitoring & Observability",
  subtitle:
    "Monitor ML models in production: detect drift, track performance, and ensure model reliability.",
  categories: ["evidently-ai", "whylabs", "fiddler-ai", "arize-ai"],
};

export const modelMonitoringCategories = [
  {
    id: "evidently-ai",
    title: "Evidently AI",
    description:
      "Open-source monitoring: detect data drift, model degradation, and track ML metrics.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "whylabs",
    title: "Whylabs",
    description:
      "ML observability platform: data and model monitoring without moving data.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "fiddler-ai",
    title: "Fiddler AI",
    description:
      "ML monitoring and explainability: track performance, detect issues, understand predictions.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "arize-ai",
    title: "Arize AI",
    description:
      "ML observability: monitor, troubleshoot, and improve models in production.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
];
