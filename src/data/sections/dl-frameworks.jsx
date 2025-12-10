import React from "react";
import { Package, Brain, Zap } from "../shared/icons";

export const deepLearningFrameworksSection = {
  title: "Deep Learning Frameworks",
  subtitle:
    "Master PyTorch, TensorFlow, JAX, and other frameworks for building neural networks and deep learning models.",
  categories: ["pytorch", "tensorflow", "jax", "huggingface", "pytorch-lightning", "fastai", "flax", "mxnet", "paddlepaddle"],
};

export const deepLearningFrameworksCategories = [
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
  {
    id: "pytorch-lightning",
    title: "PyTorch Lightning",
    description:
      "High-level PyTorch wrapper: organize code, scale training, eliminate boilerplate.",
    icon: <Package className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600",
    topics: [],
  },
  {
    id: "fastai",
    title: "FastAI",
    description:
      "Simplified deep learning: high-level APIs built on PyTorch for rapid prototyping.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "flax",
    title: "Flax",
    description:
      "Neural network library for JAX: functional, composable, and flexible.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600",
    topics: [],
  },
  {
    id: "mxnet",
    title: "Apache MXNet",
    description:
      "Flexible deep learning framework: efficient, scalable, and supports multiple languages.",
    icon: <Package className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },
  {
    id: "paddlepaddle",
    title: "PaddlePaddle",
    description:
      "Baidu's deep learning platform: industrial-grade, easy-to-use, and highly efficient.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
];
