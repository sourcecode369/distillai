import React from "react";
import { Code2, Cpu } from "../shared/icons";

export const programmingLanguagesSection = {
  title: "Programming Languages for AI",
  subtitle:
    "Master Python, C++, and other languages for AI development, optimization, and production systems.",
  categories: ["python-for-ai", "cpp-for-ml", "julia-ml", "rust-ml", "r-data-science", "javascript-ml", "go-ml", "cuda-programming", "flutter-ml"],
};

export const programmingLanguagesCategories = [
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
  {
    id: "julia-ml",
    title: "Julia for Machine Learning",
    description:
      "High-performance numerical computing: fast as C, easy as Python, built for scientific computing.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "rust-ml",
    title: "Rust for Machine Learning",
    description:
      "Systems programming for ML: memory safety, concurrency, and blazing-fast performance.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "r-data-science",
    title: "R for Data Science",
    description:
      "Statistical computing: data analysis, visualization, and statistical modeling.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "javascript-ml",
    title: "JavaScript & TypeScript for ML",
    description:
      "ML in the browser: TensorFlow.js, ONNX.js, and client-side machine learning.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },
  {
    id: "go-ml",
    title: "Go for Machine Learning",
    description:
      "Concurrent ML systems: microservices, distributed systems, and production ML pipelines.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "cuda-programming",
    title: "CUDA Programming",
    description:
      "GPU programming: write custom CUDA kernels for deep learning and high-performance computing.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "flutter-ml",
    title: "Flutter for ML Apps",
    description:
      "Build cross-platform AI mobile apps: TensorFlow Lite integration, on-device ML, beautiful UIs.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600",
    topics: [],
  },
];
