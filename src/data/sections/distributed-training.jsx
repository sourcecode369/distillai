import React from "react";
import { Network, Zap, Cpu } from "../shared/icons";

export const distributedTrainingSection = {
  title: "Distributed Training",
  subtitle:
    "Scale ML training across multiple GPUs and machines: distributed training frameworks and tools.",
  categories: ["horovod", "deepspeed", "ray-train", "megatron-lm", "accelerate"],
};

export const distributedTrainingCategories = [
  {
    id: "horovod",
    title: "Horovod",
    description:
      "Distributed deep learning: train models on multiple GPUs and machines with ease.",
    icon: <Network className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "deepspeed",
    title: "DeepSpeed",
    description:
      "Microsoft's distributed training: optimize memory, speed, and scale for large models.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "ray-train",
    title: "Ray Train",
    description:
      "Distributed training with Ray: scale PyTorch, TensorFlow, and other frameworks.",
    icon: <Network className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "megatron-lm",
    title: "Megatron-LM",
    description:
      "NVIDIA's large-scale training: train massive language models efficiently.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "accelerate",
    title: "Accelerate (Hugging Face)",
    description:
      "Simplify distributed training: run the same PyTorch code on any configuration.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },
];
