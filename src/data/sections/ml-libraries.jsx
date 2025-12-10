import React from "react";
import { BarChart2, Database } from "../shared/icons";

export const mlLibrariesSection = {
  title: "ML Libraries",
  subtitle:
    "Essential machine learning libraries: Scikit-learn, XGBoost, NumPy, Pandas, and tools for data science workflows.",
  categories: ["scikit-learn", "xgboost", "lightgbm", "catboost", "scipy", "statsmodels", "numpy", "pandas", "dask", "polars"],
};

export const mlLibrariesCategories = [
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
    id: "lightgbm",
    title: "LightGBM",
    description:
      "Microsoft's gradient boosting: fast, distributed, high-performance for large datasets.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-lime-50 text-lime-600",
    topics: [],
  },
  {
    id: "catboost",
    title: "CatBoost",
    description:
      "Yandex's gradient boosting: handles categorical features, reduces overfitting.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },
  {
    id: "scipy",
    title: "SciPy",
    description:
      "Scientific computing: optimization, integration, interpolation, and signal processing.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "statsmodels",
    title: "Statsmodels",
    description:
      "Statistical modeling: regression, time series analysis, and statistical tests.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
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
  {
    id: "dask",
    title: "Dask",
    description:
      "Parallel computing: scale pandas, NumPy, and scikit-learn to larger-than-memory datasets.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
  {
    id: "polars",
    title: "Polars",
    description:
      "Lightning-fast DataFrame library: Rust-based, parallel processing, optimized for performance.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600",
    topics: [],
  },
];
