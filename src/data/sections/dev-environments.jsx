import React from "react";
import { Code2, BookOpen } from "../shared/icons";

export const devEnvironmentsSection = {
  title: "Development Environments",
  subtitle:
    "IDEs and development tools for ML: Jupyter notebooks, cloud notebooks, and specialized ML IDEs.",
  categories: ["jupyter-lab", "google-colab", "vscode-ml", "pycharm", "cursor-ide"],
};

export const devEnvironmentsCategories = [
  {
    id: "jupyter-lab",
    title: "Jupyter Lab",
    description:
      "Interactive development environment: notebooks, terminals, and text editors in one interface.",
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    topics: [],
  },
  {
    id: "google-colab",
    title: "Google Colab",
    description:
      "Free cloud Jupyter notebooks: run Python code with GPUs and TPUs in the browser.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600",
    topics: [],
  },
  {
    id: "vscode-ml",
    title: "VS Code for ML",
    description:
      "Visual Studio Code: powerful IDE with ML extensions, Python debugging, and Jupyter support.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    topics: [],
  },
  {
    id: "pycharm",
    title: "PyCharm",
    description:
      "Python IDE: professional tools for Python development with ML integrations.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-green-50 text-green-600",
    topics: [],
  },
  {
    id: "cursor-ide",
    title: "Cursor IDE",
    description:
      "AI-powered code editor: intelligent code completion and AI pair programming.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    topics: [],
  },
];
