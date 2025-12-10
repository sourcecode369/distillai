import React from "react";
import { Zap, Target } from "../shared/icons";

export const autoMLSection = {
  title: "AutoML Platforms",
  subtitle:
    "Automated machine learning tools: automate model selection, hyperparameter tuning, and feature engineering.",
  categories: ["h2o-ai", "auto-sklearn", "tpot", "pycaret", "ludwig"],
};

export const autoMLCategories = [
  {
    id: "h2o-ai",
    title: "H2O.ai",
    description:
      "Open-source AutoML platform: automatic model training, tuning, and deployment.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "auto-sklearn",
    title: "Auto-sklearn",
    description:
      "Automated sklearn: automatic algorithm selection and hyperparameter optimization.",
    icon: <Target className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "tpot",
    title: "TPOT",
    description:
      "Tree-based pipeline optimization: genetic programming for AutoML.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "pycaret",
    title: "PyCaret",
    description:
      "Low-code ML library: automated workflows for classification, regression, and more.",
    icon: <Target className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "ludwig",
    title: "Ludwig",
    description:
      "Declarative ML: define models with configuration files, no coding required.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
];
