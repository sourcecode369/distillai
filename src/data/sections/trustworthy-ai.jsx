import React from "react";
import { Network, Scale, Trash2, Shield } from "../shared/icons";

export const trustworthyAISection = {
  title: "Trustworthy and Ethical AI",
  subtitle:
    "Ensuring AI systems are transparent, fair, secure, and aligned with ethical principles while protecting user privacy and data rights.",
  categories: ["federated-learning", "xai", "ai-ethics", "machine-unlearning"],
};

export const trustworthyAICategories = [
  {
    id: "federated-learning",
    title: "Federated Learning",
    description:
      "Training models across decentralized devices while keeping data localized.",
    icon: <Network className="w-6 h-6" />,
    color: "bg-rose-50 text-rose-600",
    topics: [],
  },
  {
    id: "xai",
    title: "Explainable AI (XAI)",
    description:
      "Methods to make AI decisions transparent and interpretable to humans.",
    icon: <Scale className="w-6 h-6" />,
    color: "bg-amber-50 text-amber-600",
    topics: [],
  },
  {
    id: "ai-ethics",
    title: "AI Ethics and Fairness",
    description:
      "Ensuring AI systems are fair, unbiased, and aligned with ethical principles.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
  {
    id: "machine-unlearning",
    title: "Machine Unlearning",
    description:
      "Techniques for removing specific data or knowledge from trained models.",
    icon: <Trash2 className="w-6 h-6" />,
    color: "bg-gray-50 text-gray-600",
    topics: [],
  },
];




