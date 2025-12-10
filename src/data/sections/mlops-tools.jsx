import React from "react";
import { GitBranch } from "../shared/icons";

export const mlopsToolsSection = {
  title: "MLOps & Experiment Tracking",
  subtitle:
    "Experiment tracking, version control, and MLOps tools for managing ML workflows and production pipelines.",
  categories: ["weights-and-biases", "mlflow", "dvc", "kubeflow", "airflow", "prefect", "metaflow", "kedro", "clearml", "neptune-ai", "comet-ml"],
};

export const mlopsToolsCategories = [
  {
    id: "weights-and-biases",
    title: "Weights & Biases",
    description:
      "W&B for experiment tracking: logging, visualization, hyperparameter tuning, and collaboration.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600",
    topics: [],
  },
  {
    id: "mlflow",
    title: "MLflow",
    description:
      "MLflow for ML lifecycle: experiment tracking, model registry, and deployment pipelines.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-lime-50 text-lime-600",
    topics: [],
  },
  {
    id: "dvc",
    title: "DVC (Data Version Control)",
    description:
      "Version control for ML: track data, models, and experiments with Git-like workflow.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "kubeflow",
    title: "Kubeflow",
    description:
      "ML on Kubernetes: end-to-end ML workflows, pipelines, and model serving.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
  {
    id: "airflow",
    title: "Apache Airflow",
    description:
      "Workflow orchestration: schedule and monitor ML pipelines with Python.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "prefect",
    title: "Prefect",
    description:
      "Modern data workflow: orchestrate ML pipelines with Python-native approach.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "metaflow",
    title: "Metaflow",
    description:
      "Netflix's ML infrastructure: build and manage real-life data science projects.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },
  {
    id: "kedro",
    title: "Kedro",
    description:
      "Production-ready data pipelines: modular, testable, and reproducible ML workflows.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "clearml",
    title: "ClearML",
    description:
      "MLOps platform: experiment management, orchestration, and model deployment.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "neptune-ai",
    title: "Neptune.ai",
    description:
      "Metadata store for ML: log, organize, and query all ML metadata in one place.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600",
    topics: [],
  },
  {
    id: "comet-ml",
    title: "Comet.ml",
    description:
      "ML experiment tracking: compare experiments, visualize results, and collaborate.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },
];
