import React from "react";
import { Database, Zap, Shield } from "../shared/icons";

export const dataProcessingSection = {
  title: "Data Processing & ETL",
  subtitle:
    "Tools for processing, transforming, and validating data at scale. Build robust data pipelines for ML workflows.",
  categories: ["apache-spark", "apache-beam", "feast", "great-expectations"],
};

export const dataProcessingCategories = [
  {
    id: "apache-spark",
    title: "Apache Spark (PySpark)",
    description:
      "Distributed data processing: large-scale ETL, SQL, streaming, and ML with PySpark.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "apache-beam",
    title: "Apache Beam",
    description:
      "Unified programming model: batch and streaming data processing pipelines.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "feast",
    title: "Feast Feature Store",
    description:
      "Feature store for ML: manage, serve, and monitor ML features in production.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "great-expectations",
    title: "Great Expectations",
    description:
      "Data validation framework: test data quality and catch data issues early.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
];
