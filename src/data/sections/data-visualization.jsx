import React from "react";
import { BarChart2, LineChart, Palette } from "../shared/icons";

export const dataVisualizationSection = {
  title: "Data Visualization Tools",
  subtitle:
    "Essential tools for visualizing data, model outputs, and training metrics. Create stunning charts, interactive plots, and ML dashboards.",
  categories: ["matplotlib", "seaborn", "plotly", "tensorboard"],
};

export const dataVisualizationCategories = [
  {
    id: "matplotlib",
    title: "Matplotlib",
    description:
      "Python's foundational plotting library: static, animated, and interactive visualizations.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "seaborn",
    title: "Seaborn",
    description:
      "Statistical data visualization: beautiful, informative plots built on Matplotlib.",
    icon: <LineChart className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "plotly",
    title: "Plotly",
    description:
      "Interactive visualizations: web-based charts, dashboards, and 3D plots.",
    icon: <Palette className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "tensorboard",
    title: "TensorBoard",
    description:
      "TensorFlow's visualization toolkit: track experiments, visualize models, and monitor training.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
];
