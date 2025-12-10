import React from "react";
import { Package, Car, Plane, Radio, BarChart3 } from "../shared/icons";

export const autonomousSystemsSection = {
  title: "Autonomous Systems",
  subtitle:
    "AI-powered systems that can operate independently, making decisions and taking actions in real-world environments without constant human intervention.",
  categories: [
    "robotics-ai",
    "self-driving-cars",
    "flying-cars",
    "sensor-fusion",
    "recommender-systems",
  ],
};

export const autonomousSystemsCategories = [
  {
    id: "robotics-ai",
    title: "Robotics and AI",
    description:
      "Combining AI with robotics for autonomous navigation, manipulation, and decision-making.",
    icon: <Package className="w-6 h-6" />,
    color: "bg-gray-50 text-gray-600",
    topics: [],
  },
  {
    id: "self-driving-cars",
    title: "Self Driving Cars",
    description:
      "Autonomous vehicle technology: perception, planning, and control systems.",
    icon: <Car className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "flying-cars",
    title: "Flying Cars",
    description: "AI systems for autonomous aerial vehicles and urban air mobility.",
    icon: <Plane className="w-6 h-6" />,
    color: "bg-sky-50 text-sky-600",
    topics: [],
  },
  {
    id: "sensor-fusion",
    title: "Sensor Fusion",
    description:
      "Combining data from multiple sensors to improve perception and decision-making in autonomous systems.",
    icon: <Radio className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
  {
    id: "recommender-systems",
    title: "Recommender Systems",
    description:
      "AI-powered systems for personalized recommendations and content discovery.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600",
    topics: [],
  },
];




