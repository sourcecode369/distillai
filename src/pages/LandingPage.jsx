import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Map as MapIcon,
  Network,
  Library,
  Briefcase,
  ArrowRight,
  Sparkles,
  Rocket,
  Target,
  Code2,
  Brain,
  TrendingUp,
  FileText
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import { FeatureCard } from "../components/Card";
import { useAuth } from "../context/AuthContext";
import Hero3DScene from "../components/Hero3DScene";
import TextRotator from "../components/TextRotator";
import SEO from "../components/SEO";

const LandingPage = () => {
  const { t } = useTranslation('landing');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef([]);
  const benefitsRef = useRef([]);
  const ctaRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Intersection Observer for fade-in animations with stagger
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-fade-in-up");
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    [...featuresRef.current, ...benefitsRef.current].forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  const allFeatures = useMemo(() => [
    {
      icon: <BookOpen size={24} strokeWidth={2} />,
      title: t('features.handbooks.title'),
      description: t('features.handbooks.description'),
      color: "text-indigo-600 dark:text-indigo-400",
      action: t('features.handbooks.action'),
      stats: t('features.handbooks.stats'),
      available: true,
      onClick: () => navigate('/handbooks'),
    },
    {
      icon: <FileText size={24} strokeWidth={2} />,
      title: "Weekly Report",
      description: "Stay updated with the latest AI news, trends, and breakthroughs delivered weekly.",
      color: "text-sky-600 dark:text-sky-400",
      action: "Read Reports",
      stats: "New",
      available: true,
      onClick: () => navigate('/weekly-report'),
    },
    {
      icon: <MapIcon size={24} strokeWidth={2} />,
      title: t('features.roadmaps.title'),
      description: t('features.roadmaps.description'),
      color: "text-blue-600 dark:text-blue-400",
      action: t('features.roadmaps.action'),
      stats: t('features.roadmaps.stats'),
      available: false,
    },
    {
      icon: <Network size={24} strokeWidth={2} />,
      title: t('features.ecosystem.title'),
      description: t('features.ecosystem.description'),
      color: "text-purple-600 dark:text-purple-400",
      action: t('features.ecosystem.action'),
      stats: t('features.ecosystem.stats'),
      available: false,
    },
    {
      icon: <Library size={24} strokeWidth={2} />,
      title: t('features.resources.title'),
      description: t('features.resources.description'),
      color: "text-emerald-600 dark:text-emerald-400",
      action: t('features.resources.action'),
      stats: t('features.resources.stats'),
      available: false,
    },
    {
      icon: <Briefcase size={24} strokeWidth={2} />,
      title: t('features.opportunities.title'),
      description: t('features.opportunities.description'),
      color: "text-orange-600 dark:text-orange-400",
      action: t('features.opportunities.action'),
      stats: t('features.opportunities.stats'),
      available: false,
    },
  ], [t, navigate]);

  // Filter features: show all if admin, only available features if not admin
  const features = useMemo(() => {
    return isAdmin ? allFeatures : allFeatures.filter(f => f.available);
  }, [isAdmin, allFeatures]);

  const benefits = useMemo(() => [
    {
      icon: <Target size={24} strokeWidth={2} />,
      title: t('benefits.structured.title'),
      description: t('benefits.structured.description'),
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: <Code2 size={24} strokeWidth={2} />,
      title: t('benefits.practical.title'),
      description: t('benefits.practical.description'),
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: <Brain size={24} strokeWidth={2} />,
      title: t('benefits.comprehensive.title'),
      description: t('benefits.comprehensive.description'),
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      icon: <TrendingUp size={24} strokeWidth={2} />,
      title: t('benefits.upToDate.title'),
      description: t('benefits.upToDate.description'),
      color: "text-blue-600 dark:text-blue-400",
    },
  ], [t]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SEO
        title="Master Artificial Intelligence"
        description="Comprehensive guides to artificial intelligence concepts, techniques, and applications. Learn AI, ML, and Data Science."
        url="/"
      />
      {/* Enhanced animated background with depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pointer-events-none"></div>

      {/* Dynamic gradient orbs that follow mouse */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.12) 0%, transparent 50%)`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-25 dark:opacity-15 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)`,
        }}
      />

      {/* Subtle grid pattern */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Hero Section - Premium Design */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-20 overflow-hidden"
      >
        {/* Premium 3D AI-themed background */}
        <Hero3DScene />

        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => {
            const size = Math.random() * 2 + 1;
            const delay = Math.random() * 5;
            const duration = 4 + Math.random() * 4;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-indigo-400/25 to-violet-400/25 dark:from-indigo-500/15 dark:to-violet-500/15 blur-[0.5px]"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  animation: `float 8s ease-in-out infinite, twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                }}
              />
            );
          })}
        </div>

        {/* Large gradient orb for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-indigo-500/8 via-violet-500/8 to-pink-500/8 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-indigo-200/60 dark:border-indigo-800/50 shadow-lg shadow-indigo-500/5 mb-12 animate-fade-in-up hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="relative">
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-indigo-400/20 blur-lg"></div>
            </div>
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide">
              {t('hero.badge', { defaultValue: 'Your Complete AI Learning Platform' })}
            </span>
          </div>

          {/* Enhanced Main Heading with better contrast */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight mb-8 animate-fade-in-up animation-delay-100 leading-[1.05]">
            <span className="block text-slate-900 dark:text-slate-50 mb-3 tracking-tighter">{t('hero.title')}</span>
            <span className="block relative mb-4">
              <TextRotator
                words={[
                  t('hero.rotatingWords.ai', { defaultValue: 'Artificial Intelligence' }),
                  t('hero.rotatingWords.ml', { defaultValue: 'Machine Learning' }),
                  t('hero.rotatingWords.dataScience', { defaultValue: 'Data Science' }),
                  t('hero.rotatingWords.neuralNetworks', { defaultValue: 'Neural Networks' })
                ]}
              />
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 blur-3xl opacity-20 pointer-events-none"></span>
            </span>
            <span className="block text-slate-600 dark:text-slate-400 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mt-4 font-bold tracking-tight">
              {t('hero.subtitle', { defaultValue: 'From Fundamentals to Advanced' })}
            </span>
          </h1>

          {/* Enhanced Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed animate-fade-in-up animation-delay-200 font-normal">
            {t('hero.description')}
            <span className="block mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-500 font-light">
              {t('hero.descriptionSecondary', { defaultValue: 'Learn at your own pace with structured content designed for all skill levels.' })}
            </span>
          </p>

          {/* Premium CTA Buttons - Consistent */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up animation-delay-300">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate('/handbooks')}
              icon={ArrowRight}
              iconPosition="right"
              className="group relative overflow-hidden shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <span className="relative z-10">{t('hero.cta')}</span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            </Button>
            <Button
              variant="gradient"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="group"
              onClick={() => navigate('/handbooks')}
            >
              {t('hero.secondaryCta')}
            </Button>
          </div>

          {/* Stats Cards Container with Scroll Indicator */}
          <div className="flex flex-col items-center">
            {/* Enhanced Stats */}
            <div className={`grid gap-6 max-w-5xl mx-auto animate-fade-in-up animation-delay-400 w-full ${isAdmin ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-1"
              }`}>
              {useMemo(() => [
                { label: t('stats.topics', { defaultValue: 'Topics' }), value: "50+", icon: <BookOpen size={28} strokeWidth={2} />, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-100 dark:border-indigo-800", adminOnly: false },
                { label: t('stats.roadmaps', { defaultValue: 'Roadmaps' }), value: "3", icon: <MapIcon size={28} strokeWidth={2} />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-800", adminOnly: true },
                { label: t('stats.resources', { defaultValue: 'Resources' }), value: "1000+", icon: <Library size={28} strokeWidth={2} />, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-100 dark:border-violet-800", adminOnly: true },
                { label: t('stats.tools', { defaultValue: 'Tools' }), value: "100+", icon: <Network size={28} strokeWidth={2} />, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-100 dark:border-pink-800", adminOnly: true },
              ], [t]).filter(stat => !stat.adminOnly || isAdmin).map((stat, i) => (
                <div
                  key={i}
                  className="group relative h-full perspective-1000"
                  onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
                    const rotateY = ((x - centerX) / centerX) * 5;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                  }}
                  style={{ transition: 'transform 0.1s ease-out' }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[1.5rem] opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

                  {/* Main card */}
                  <div
                    className="relative bg-white dark:bg-slate-900 rounded-[1.4rem] p-6 h-full transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden border border-slate-100 dark:border-slate-800"
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="relative z-10 flex flex-col items-center">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl ${stat.color} ${stat.bg} border ${stat.border} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                        {stat.icon}
                      </div>

                      <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
                        {stat.value}
                      </div>

                      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Scroll Indicator - Centered below stats cards using normal layout */}
            <div className="mx-auto mt-6 animate-bounce">
              <div className="w-6 h-10 border-2 border-slate-300/60 dark:border-slate-600/60 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-white/30 dark:bg-slate-800/30">
                <div className="w-1.5 h-1.5 bg-indigo-500 dark:text-indigo-400 rounded-full animate-scroll-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 2 Rows Layout (3 + 2 centered) */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/20 to-transparent dark:via-indigo-950/10 pointer-events-none"></div>
        {/* Subtle divider line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent dark:via-indigo-800/30"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-5">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                {t('features.sectionLabel', { defaultValue: 'Platform Features' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-tight tracking-tight">
              {t('features.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              {t('features.subtitle')}
            </p>
          </div>

          {/* All Feature Cards - Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featuresRef.current[index] = el)}
                className="group relative transform transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FeatureCard
                  onClick={feature.available ? feature.onClick : undefined}
                  className="rounded-3xl flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-500 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="relative z-10 flex flex-col h-full p-2">
                    {/* Header with icon */}
                    <div className="flex items-start justify-between mb-6 gap-2 sm:gap-3">
                      <div className={`p-3.5 rounded-2xl ${feature.color} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-md border border-white/60 dark:border-slate-700/60 transition-all duration-500 group-hover:scale-110 shadow-lg flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end min-w-0 flex-1">
                        <div className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-all duration-300 whitespace-nowrap">
                          {feature.stats}
                        </div>
                        {!feature.available && (
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-800/40 shadow-sm backdrop-blur-sm whitespace-nowrap">
                            {t('features.comingSoon', { defaultValue: 'Soon' })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Footer with action */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                          {feature.action}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </FeatureCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section - Handbook Card Style */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Visual separation - Different background tint */}
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 pointer-events-none"></div>
        {/* Subtle divider line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent dark:via-indigo-800/30"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block mb-5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                {t('benefits.sectionLabel', { defaultValue: 'Why Choose Us' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-tight tracking-tight">
              {t('benefits.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                ref={(el) => (benefitsRef.current[index] = el)}
                className="group relative h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

                {/* Main card - Handbook style */}
                <div
                  className="relative bg-white dark:bg-slate-900 rounded-[1.9rem] p-8 h-full transition-all duration-500 flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800 group-hover:translate-y-[-2px]"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${benefit.color} bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                      {benefit.icon}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {benefit.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section - Enhanced */}
      <section className="relative py-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/20 to-transparent dark:via-pink-950/10 pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div
            ref={ctaRef}
            className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 rounded-[2.5rem] p-12 sm:p-16 lg:p-20 shadow-[0_30px_80px_-15px_rgba(99,102,241,0.4)] overflow-hidden group"
          >
            {/* Enhanced background pattern */}
            <div className="absolute inset-0 opacity-[0.06]">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '48px 48px'
              }}></div>
            </div>

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-violet-600/0 to-pink-600/0 group-hover:from-indigo-600/20 group-hover:via-violet-600/20 group-hover:to-pink-600/20 transition-all duration-700"></div>

            {/* Enhanced glow effect - multiple layers */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 rounded-[2.5rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 -z-10"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/50 via-violet-600/50 to-pink-600/50 rounded-[2.5rem] blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-700 -z-20"></div>

            {/* Additional inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent rounded-[2.5rem]"></div>

            <div className="relative z-10">
              <div className="inline-flex p-5 rounded-2xl bg-white/20 backdrop-blur-sm mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/20 shadow-lg">
                <Rocket size={44} className="text-white drop-shadow-lg" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 leading-tight tracking-tight">
                {t('cta.title')}
              </h2>
              <p className="text-xl sm:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                {t('cta.subtitle')}
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/handbooks')}
                icon={ArrowRight}
                iconPosition="right"
                className="bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] mx-auto"
              >
                {t('cta.button')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
