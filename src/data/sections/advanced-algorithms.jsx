import React from "react";
import { Dna, GitBranch, Search, Shield, BarChart2, RefreshCw } from "../shared/icons";

export const advancedAlgorithmsSection = {
  title: "Advanced Algorithmic Approaches",
  subtitle:
    "Cutting-edge algorithms and computational methods that push the boundaries of what AI systems can achieve, from evolutionary computation to adversarial learning.",
  categories: [
    "genetic-algorithms",
    "evolutionary-algorithms",
    "information-retrieval",
    "adversarial-ml",
    "bayesian-ml",
    "continual-learning",
  ],
};

export const advancedAlgorithmsCategories = [
  {
    id: "genetic-algorithms",
    title: "Genetic Algorithms",
    description:
      "Evolutionary computation using genetic operators for optimization and search problems.",
    icon: <Dna className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600",
    topics: [],
  },
  {
    id: "evolutionary-algorithms",
    title: "Evolutionary Algorithms",
    description:
      "Population-based optimization algorithms inspired by biological evolution.",
    icon: <GitBranch className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "information-retrieval",
    title: "Information Retrieval",
    description:
      "Search systems, ranking algorithms, and retrieval methods for finding relevant information.",
    icon: <Search className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "adversarial-ml",
    title: "Adversarial Machine Learning",
    description:
      "Understanding and defending against adversarial attacks on machine learning models.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },
  {
    id: "bayesian-ml",
    title: "Bayesian Machine Learning",
    description:
      "Probabilistic approaches to machine learning with uncertainty quantification.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "continual-learning",
    title: "Continual Learning",
    description:
      "Learning continuously from new data without forgetting previously learned knowledge.",
    icon: <RefreshCw className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
];




