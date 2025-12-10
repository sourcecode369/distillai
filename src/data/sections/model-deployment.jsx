import React from "react";
import { Zap, Cpu } from "../shared/icons";

export const modelDeploymentSection = {
  title: "Model Deployment & Optimization",
  subtitle:
    "Deploy and optimize ML models for production: ONNX, TensorRT, and optimization frameworks.",
  categories: ["onnx", "tensorrt", "torchserve", "tf-serving", "triton", "bentoml", "seldon-core", "kserve", "fastapi", "ray-serve"],
};

export const modelDeploymentCategories = [
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
  {
    id: "torchserve",
    title: "TorchServe",
    description:
      "PyTorch model serving: production-ready, scalable deployment for PyTorch models.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "tf-serving",
    title: "TensorFlow Serving",
    description:
      "TensorFlow model serving: flexible, high-performance serving system for production.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "triton",
    title: "NVIDIA Triton Inference Server",
    description:
      "Multi-framework serving: deploy models from any framework with optimized inference.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "bentoml",
    title: "BentoML",
    description:
      "ML model packaging and serving: build production-ready ML services with Python.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "seldon-core",
    title: "Seldon Core",
    description:
      "ML deployment on Kubernetes: enterprise-grade serving with monitoring and A/B testing.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600",
    topics: [],
  },
  {
    id: "kserve",
    title: "KServe",
    description:
      "Kubernetes-native model serving: standardized inference protocol for any ML framework.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
  {
    id: "fastapi",
    title: "FastAPI for ML",
    description:
      "High-performance Python API framework: build ML APIs with automatic documentation.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "ray-serve",
    title: "Ray Serve",
    description:
      "Scalable model serving: deploy and scale ML models on Ray clusters.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600",
    topics: [],
  },
];
