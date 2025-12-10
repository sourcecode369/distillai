import React from "react";
import {
  Type,
  Eye,
  Headphones,
  Layers,
  FileText,
  GraphIcon,
  Network,
  Table,
  Clock,
  Video,
} from "../shared/icons";

export const dataTypesSection = {
  title: "AI for Specific Data Types",
  subtitle:
    "Specialized AI techniques and architectures designed for processing different types of data, including text, images, audio, video, and structured information.",
  categories: [
    "nlp",
    "cv",
    "audio-ai",
    "multimodal-ai",
    "dl-documents",
    "gnn",
    "knowledge-graphs",
    "tabular-dl",
    "time-series",
    "video-ai",
  ],
};

export const dataTypesCategories = [
  {
    id: "nlp",
    title: "Natural Language Processing",
    description:
      "Techniques for processing and analyzing human language data with machine learning.",
    icon: <Type className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "cv",
    title: "Computer Vision",
    description: "From CNNs to Vision Transformers and Stable Diffusion.",
    icon: <Eye className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-600",
    topics: [
      {
        id: "stable-diffusion",
        title: "Stable Diffusion & Latent Spaces",
        difficulty: "Intermediate",
        readTime: "18 min",
        tags: ["Generative", "Art"],
        description:
          "Understanding the diffusion process and how text guides image generation.",
        lastUpdated: "Sep 15, 2023",
        video: "https://www.youtube.com/embed/1CIpzeNxIhU",
        content: {
          intro:
            "Diffusion models work by gradually denoising a random distribution. Stable Diffusion does this in a latent space to maximize efficiency.",
          sections: [],
          resources: { tutorials: [], papers: [], repos: [], blogs: [] },
        },
      },
    ],
  },
  {
    id: "audio-ai",
    title: "Audio AI",
    description:
      "Processing and generating audio with AI: speech recognition, synthesis, and music generation.",
    icon: <Headphones className="w-6 h-6" />,
    color: "bg-fuchsia-50 text-fuchsia-600",
    topics: [],
  },
  {
    id: "multimodal-ai",
    title: "Multimodal AI",
    description:
      "Integrating and processing multiple types of data (text, image, audio) in AI systems.",
    icon: <Layers className="w-6 h-6" />,
    color: "bg-violet-50 text-violet-600",
    topics: [],
  },
  {
    id: "dl-documents",
    title: "Deep Learning for Documents",
    description:
      "AI techniques for processing, understanding, and extracting information from documents.",
    icon: <FileText className="w-6 h-6" />,
    color: "bg-amber-50 text-amber-600",
    topics: [],
  },
  {
    id: "gnn",
    title: "Graph Neural Networks",
    description:
      "Neural networks designed to work with graph-structured data and relational information.",
    icon: <GraphIcon className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600",
    topics: [],
  },
  {
    id: "knowledge-graphs",
    title: "Knowledge Graphs",
    description:
      "Structured representations of knowledge using entities, relationships, and semantic networks.",
    icon: <Network className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "tabular-dl",
    title: "Tabular Deep Learning",
    description:
      "Deep learning approaches for structured tabular data and relational databases.",
    icon: <Table className="w-6 h-6" />,
    color: "bg-slate-50 text-slate-600",
    topics: [],
  },
  {
    id: "time-series",
    title: "Time Series Forecasting",
    description:
      "Predicting future values in sequential data using deep learning and statistical methods.",
    icon: <Clock className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },
  {
    id: "video-ai",
    title: "Video",
    description:
      "AI for video understanding, generation, and analysis: action recognition, video generation, and temporal modeling.",
    icon: <Video className="w-6 h-6" />,
    color: "bg-red-50 text-red-600",
    topics: [],
  },
];




