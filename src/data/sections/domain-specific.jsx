import React from "react";
import {
  Palette,
  Smartphone,
  DollarSign,
  Gamepad2,
  Stethoscope,
  Lock,
} from "../shared/icons";

export const domainSpecificSection = {
  title: "AI in Specific Domains",
  subtitle:
    "Real-world applications of AI across various industries and domains, showcasing how artificial intelligence transforms different sectors.",
  categories: [
    "ai-art",
    "edge-ai",
    "ai-finance",
    "ai-gaming",
    "ai-healthcare",
    "ai-cybersecurity",
  ],
};

export const domainSpecificCategories = [
  {
    id: "ai-art",
    title: "AI for Art and Aesthetics",
    description: "Creating art, music, and creative content using artificial intelligence.",
    icon: <Palette className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600",
    topics: [],
  },
  {
    id: "edge-ai",
    title: "AI for Edge and IoT",
    description: "Deploying AI models on edge devices and Internet of Things systems.",
    icon: <Smartphone className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
    topics: [],
  },
  {
    id: "ai-finance",
    title: "AI in Finance",
    description: "Applications of AI in financial services and algorithmic trading.",
    icon: <DollarSign className="w-6 h-6" />,
    color: "bg-amber-50 text-amber-600",
    topics: [],
  },
  {
    id: "ai-gaming",
    title: "AI for Gaming",
    description:
      "AI techniques for game development: NPCs, procedural generation, and game AI.",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "ai-healthcare",
    title: "AI in Healthcare",
    description:
      "Transforming healthcare with AI-powered diagnostics and treatment planning.",
    icon: <Stethoscope className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },
  {
    id: "ai-cybersecurity",
    title: "AI in Cybersecurity",
    description: "Using AI for threat detection, security analysis, and cyber defense.",
    icon: <Lock className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },
];




