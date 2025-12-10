import React from "react";
import {
  Code2,
  Package,
  Database,
  Zap,
  GitBranch,
  Brain,
  BarChart2,
  Cpu,
} from "../shared/icons";

export const toolsAndTechnologiesSection = {
  title: "AI Development Tools",
  subtitle:
    "Master the frameworks, libraries, and technologies that power modern AI development. Each tool provides comprehensive guides from basics to advanced usage.",
  categories: [
    "pytorch",
    "tensorflow",
    "jax",
    "huggingface",
    "scikit-learn",
    "xgboost",
    "numpy",
    "pandas",
    "python-for-ai",
    "cpp-for-ml",
    "onnx",
    "tensorrt",
    "weights-and-biases",
    "mlflow",
  ],
};

export const toolsAndTechnologiesCategories = [
  // Deep Learning Frameworks
  {
    id: "pytorch",
    title: "PyTorch",
    description:
      "Complete PyTorch guide: tensors, autograd, neural networks, training, and production deployment.",
    icon: <Package className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "tensorflow",
    title: "TensorFlow & Keras",
    description:
      "Master TensorFlow and Keras: model building, training, optimization, and TensorFlow ecosystem.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "jax",
    title: "JAX",
    description:
      "JAX for high-performance ML: automatic differentiation, JIT compilation, and functional programming.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "huggingface",
    title: "Hugging Face Transformers",
    description:
      "Hugging Face ecosystem: transformers, datasets, tokenizers, and pre-trained models.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },

  // ML Libraries
  {
    id: "scikit-learn",
    title: "Scikit-learn",
    description:
      "Scikit-learn fundamentals: classification, regression, clustering, and model evaluation.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "xgboost",
    title: "XGBoost & Gradient Boosting",
    description:
      "XGBoost, LightGBM, and CatBoost: gradient boosting for tabular data and competitions.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-600",
    topics: [],
  },
  {
    id: "numpy",
    title: "NumPy",
    description:
      "NumPy for scientific computing: arrays, linear algebra, and numerical operations.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "pandas",
    title: "Pandas",
    description:
      "Data manipulation with Pandas: DataFrames, data cleaning, and analysis workflows.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600",
    topics: [],
  },

  // Programming Languages
  {
    id: "python-for-ai",
    title: "Python for AI",
    description:
      "Python essentials for AI: advanced features, performance optimization, and best practices.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
  {
    id: "cpp-for-ml",
    title: "C++ for Machine Learning",
    description:
      "C++ for high-performance ML: low-level optimization, CUDA integration, and production systems.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-slate-50 text-slate-600",
    topics: [],
  },

  // Model Deployment
  {
    id: "onnx",
    title: "ONNX",
    description:
      "ONNX for model interoperability: converting models, optimization, and cross-framework deployment.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-violet-50 text-violet-600",
    topics: [],
  },
  {
    id: "tensorrt",
    title: "TensorRT & Optimization",
    description:
      "NVIDIA TensorRT: model optimization, quantization, and GPU acceleration for inference.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },

  // MLOps & Experiment Tracking
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
];
