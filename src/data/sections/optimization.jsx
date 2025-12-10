import React from "react";
import { Code2, Zap, Gauge, ChipIcon } from "../shared/icons";

export const optimizationSection = {
  title: "Optimization and Operationalization",
  subtitle:
    "Tools, techniques, and best practices for efficiently deploying, managing, and optimizing AI systems in production environments.",
  categories: ["mlops", "automl", "efficient-ai", "gpu-programming"],
};

export const optimizationCategories = [
  {
    id: "mlops",
    title: "MLOps",
    description:
      "Best practices for deploying and maintaining machine learning models in production.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-600",
    topics: [
      {
        id: "model-serving",
        title: "High-Performance Model Serving",
        difficulty: "Intermediate",
        readTime: "12 min",
        tags: ["Infrastructure"],
        description:
          "Using TorchServe, Triton, and vLLM for low-latency inference.",
        lastUpdated: "Nov 12, 2023",
        video: "https://www.youtube.com/embed/JtUg8h6c1v4",
        content: {
          intro:
            "Serving a model is different from training it. Throughput and latency are the key metrics here.",
          sections: [],
          resources: { tutorials: [], papers: [], repos: [], blogs: [] },
        },
      },
    ],
  },
  {
    id: "automl",
    title: "AutoML",
    description:
      "Automated machine learning: model selection, hyperparameter tuning, and architecture search.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },
  {
    id: "efficient-ai",
    title: "Efficient AI and Optimization",
    description:
      "Techniques for making AI models faster, smaller, and more energy-efficient.",
    icon: <Gauge className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "gpu-programming",
    title: "GPU Programming",
    description:
      "Programming GPUs for AI workloads: CUDA, optimization, and parallel computing.",
    icon: <ChipIcon className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
];




