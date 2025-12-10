import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapIcon,
  Clock,
  Award,
  BookOpen,
  Brain,
  Activity,
  Database,
  MessageSquare,
  Eye,
  Server,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureCard } from "../components/Card";
import SEO from "../components/SEO";

const RoadmapsPage = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const roadmaps = [
    {
      id: "ai-engineer",
      title: "AI Engineer Career Path",
      description:
        "Master the fundamentals of AI engineering, from neural networks to production deployment. Build real-world AI applications.",
      icon: <Brain size={20} className="text-indigo-600 dark:text-indigo-400" />,
      duration: "12 months",
      level: "Beginner to Advanced",
      topics: 25,
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: "ml-engineer",
      title: "Machine Learning Engineer Path",
      description:
        "Learn to design, build, and deploy scalable ML systems. Master MLOps, model optimization, and production best practices.",
      icon: <Activity size={20} className="text-violet-600 dark:text-violet-400" />,
      duration: "10 months",
      level: "Intermediate to Advanced",
      topics: 20,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: "data-scientist",
      title: "Data Scientist Career Track",
      description:
        "Become a data scientist with expertise in statistics, ML algorithms, and data storytelling. Transform data into insights.",
      icon: <Database size={20} className="text-blue-600 dark:text-blue-400" />,
      duration: "14 months",
      level: "Beginner to Advanced",
      topics: 30,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "nlp-specialist",
      title: "NLP Specialist Roadmap",
      description:
        "Specialize in Natural Language Processing. Master transformers, LLMs, and build advanced language AI applications.",
      icon: <MessageSquare size={20} className="text-pink-600 dark:text-pink-400" />,
      duration: "8 months",
      level: "Intermediate to Advanced",
      topics: 18,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "computer-vision",
      title: "Computer Vision Engineer Path",
      description:
        "Learn to build vision AI systems. Master CNNs, object detection, segmentation, and deploy vision models at scale.",
      icon: <Eye size={20} className="text-cyan-600 dark:text-cyan-400" />,
      duration: "9 months",
      level: "Intermediate to Advanced",
      topics: 22,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "mlops-engineer",
      title: "MLOps Engineer Track",
      description:
        "Master ML operations and infrastructure. Learn CI/CD for ML, model monitoring, and production-grade ML pipelines.",
      icon: <Server size={20} className="text-emerald-600 dark:text-emerald-400" />,
      duration: "7 months",
      level: "Intermediate to Advanced",
      topics: 16,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "self-driving-engineer",
      title: "Self-Driving Car Engineer",
      description:
        "Build autonomous vehicle systems. Master perception, sensor fusion, path planning, and control algorithms for self-driving cars.",
      icon: <Brain size={20} className="text-blue-600 dark:text-blue-400" />,
      duration: "11 months",
      level: "Advanced",
      topics: 24,
      color: "from-blue-600 to-cyan-500",
    },
    {
      id: "robotics-engineer",
      title: "Robotics Software Engineer",
      description:
        "Develop intelligent robotics systems. Learn manipulation, navigation, SLAM, and integrate AI for autonomous robotics.",
      icon: <Activity size={20} className="text-slate-600 dark:text-slate-400" />,
      duration: "10 months",
      level: "Advanced",
      topics: 21,
      color: "from-slate-500 to-gray-500",
    },
    {
      id: "autonomous-flight",
      title: "Autonomous Flight Engineer",
      description:
        "Build AI systems for autonomous aerial vehicles. Master flight control, computer vision for drones, and urban air mobility.",
      icon: <Eye size={20} className="text-sky-600 dark:text-sky-400" />,
      duration: "9 months",
      level: "Advanced",
      topics: 19,
      color: "from-sky-500 to-blue-400",
    },
    {
      id: "ai-healthcare",
      title: "AI in Healthcare Specialist",
      description:
        "Transform healthcare with AI. Learn medical imaging, diagnostics, drug discovery, and clinical decision support systems.",
      icon: <Server size={20} className="text-red-600 dark:text-red-400" />,
      duration: "12 months",
      level: "Intermediate to Advanced",
      topics: 26,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "ai-finance",
      title: "AI in Finance Engineer",
      description:
        "Apply AI to financial services. Master algorithmic trading, fraud detection, risk assessment, and quantitative finance with ML.",
      icon: <Database size={20} className="text-amber-600 dark:text-amber-400" />,
      duration: "10 months",
      level: "Intermediate to Advanced",
      topics: 22,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "ai-cybersecurity",
      title: "AI Cybersecurity Specialist",
      description:
        "Secure systems with AI. Learn threat detection, anomaly detection, malware analysis, and AI-powered cyber defense.",
      icon: <Brain size={20} className="text-red-700 dark:text-red-400" />,
      duration: "9 months",
      level: "Advanced",
      topics: 20,
      color: "from-red-600 to-rose-600",
    },
    {
      id: "ai-gaming",
      title: "AI for Game Development",
      description:
        "Create intelligent game AI. Learn NPC behavior, procedural generation, reinforcement learning for games, and game balancing.",
      icon: <MessageSquare size={20} className="text-purple-600 dark:text-purple-400" />,
      duration: "8 months",
      level: "Intermediate",
      topics: 17,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "recommender-systems",
      title: "Recommender Systems Engineer",
      description:
        "Build personalized recommendation engines. Master collaborative filtering, content-based systems, and deep learning for recommendations.",
      icon: <Activity size={20} className="text-pink-600 dark:text-pink-400" />,
      duration: "7 months",
      level: "Intermediate to Advanced",
      topics: 15,
      color: "from-pink-600 to-rose-500",
    },
    {
      id: "edge-ai",
      title: "Edge AI & IoT Engineer",
      description:
        "Deploy AI on edge devices. Learn model optimization, TinyML, on-device inference, and building AI for IoT systems.",
      icon: <Server size={20} className="text-cyan-600 dark:text-cyan-400" />,
      duration: "8 months",
      level: "Intermediate to Advanced",
      topics: 18,
      color: "from-cyan-600 to-teal-500",
    },
    {
      id: "ai-research-scientist",
      title: "AI Research Scientist",
      description:
        "Advance the state of AI research. Master evolutionary algorithms, adversarial ML, Bayesian methods, and publish cutting-edge papers.",
      icon: <Brain size={20} className="text-teal-600 dark:text-teal-400" />,
      duration: "18 months",
      level: "Advanced to Expert",
      topics: 32,
      color: "from-teal-600 to-green-500",
    },
    {
      id: "multimodal-ai-engineer",
      title: "Multimodal AI Engineer",
      description:
        "Build AI systems processing multiple modalities. Master vision-language models, audio-visual AI, and cross-modal learning.",
      icon: <Eye size={20} className="text-violet-600 dark:text-violet-400" />,
      duration: "10 months",
      level: "Advanced",
      topics: 23,
      color: "from-violet-600 to-purple-500",
    },
    {
      id: "audio-ai-engineer",
      title: "Audio AI Engineer",
      description:
        "Specialize in audio processing with AI. Master speech recognition, TTS, music generation, and audio synthesis systems.",
      icon: <MessageSquare size={20} className="text-fuchsia-600 dark:text-fuchsia-400" />,
      duration: "9 months",
      level: "Intermediate to Advanced",
      topics: 20,
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      id: "automl-nas-engineer",
      title: "AutoML & NAS Engineer",
      description:
        "Automate ML workflows. Master neural architecture search, hyperparameter optimization, and automated model selection.",
      icon: <Activity size={20} className="text-yellow-600 dark:text-yellow-400" />,
      duration: "8 months",
      level: "Advanced",
      topics: 17,
      color: "from-yellow-500 to-amber-500",
    },
    {
      id: "gpu-cuda-engineer",
      title: "GPU/CUDA Performance Engineer",
      description:
        "Optimize AI for GPUs. Master CUDA programming, kernel optimization, GPU architectures, and high-performance computing.",
      icon: <Server size={20} className="text-indigo-700 dark:text-indigo-400" />,
      duration: "10 months",
      level: "Advanced",
      topics: 21,
      color: "from-indigo-600 to-blue-600",
    },
    {
      id: "ai-ethics-safety",
      title: "AI Ethics & Safety Specialist",
      description:
        "Ensure responsible AI deployment. Master XAI, fairness, federated learning, and AI governance frameworks.",
      icon: <Brain size={20} className="text-rose-600 dark:text-rose-400" />,
      duration: "9 months",
      level: "Intermediate to Advanced",
      topics: 19,
      color: "from-rose-500 to-red-500",
    },
  ];

  const handleRoadmapClick = (roadmapId) => {
    // Future: navigate to specific roadmap detail page
    console.log(`Clicked roadmap: ${roadmapId}`);
  };

  return (
    <div className="pb-16 relative z-10">
      <SEO
        title="Career Roadmaps"
        description="Explore structured learning paths for AI, ML, and Data Science careers. From beginner to advanced, find your perfect roadmap."
        url="/roadmaps"
      />

      {/* Hero Section */}
      <Hero
        title="Career Roadmaps"
        subtitle="Structured learning paths to guide your journey from beginner to expert in AI, Machine Learning, and Data Science"
        icon={<MapIcon size={22} className="text-white drop-shadow-sm" />}
      />

      {/* Roadmaps Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {roadmaps.map((roadmap, index) => (
            <div
              key={roadmap.id}
              className="group relative h-full transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <FeatureCard
                onClick={() => handleRoadmapClick(roadmap.id)}
                className="rounded-3xl flex flex-col h-full cursor-pointer"
              >
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header with icon and badges */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${roadmap.color} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm border border-white/60 dark:border-slate-700/60 transition-all duration-500 group-hover:scale-105 shadow-lg`}
                    >
                      {roadmap.icon}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-200/50 dark:border-indigo-800/40">
                        <Clock size={11} />
                        <span>{roadmap.duration}</span>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-pink-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/40 flex-shrink-0">
                        {roadmap.topics} Chapters
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300 line-clamp-2 text-balance">
                    {roadmap.title}
                  </h3>

                  {/* Level Badge */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Award size={14} className="text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {roadmap.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-4 flex-1 group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors duration-300 line-clamp-3">
                    {roadmap.description}
                  </p>

                  {/* Coming Soon Badge */}
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/40">
                      <Sparkles size={12} className="text-amber-600 dark:text-amber-400" />
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  {/* Footer with action */}
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore Roadmap
                      </span>
                      <div className="p-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-0.5 transition-transform duration-300 relative z-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FeatureCard>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 dark:from-indigo-900/20 dark:via-violet-900/20 dark:to-pink-900/20 border border-indigo-200/50 dark:border-indigo-800/40">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <BookOpen size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Roadmaps Coming Soon
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We're crafting comprehensive, step-by-step learning paths tailored to each career
                track. Each roadmap will include curated topics, hands-on projects, and industry
                best practices to accelerate your AI journey. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RoadmapsPage;
