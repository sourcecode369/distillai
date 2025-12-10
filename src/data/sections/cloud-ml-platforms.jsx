import React from "react";
import { Database } from "../shared/icons";

export const cloudMLPlatformsSection = {
  title: "Cloud ML Platforms",
  subtitle:
    "Cloud-based machine learning platforms for training, deploying, and managing ML models at scale.",
  categories: ["aws-sagemaker", "gcp-vertex-ai", "azure-ml", "databricks", "paperspace"],
};

export const cloudMLPlatformsCategories = [
  {
    id: "aws-sagemaker",
    title: "AWS SageMaker",
    description:
      "Amazon SageMaker: build, train, and deploy ML models with fully managed infrastructure.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "gcp-vertex-ai",
    title: "Google Cloud Vertex AI",
    description:
      "Vertex AI: unified ML platform for building, deploying, and scaling ML models on Google Cloud.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "azure-ml",
    title: "Azure Machine Learning",
    description:
      "Azure ML: enterprise-grade ML service for building and deploying models on Microsoft Azure.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "databricks",
    title: "Databricks",
    description:
      "Unified analytics platform: collaborative ML, data engineering, and big data processing.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },
  {
    id: "paperspace",
    title: "Paperspace Gradient",
    description:
      "Cloud platform for ML developers: GPU compute, notebooks, and model deployment.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
];
