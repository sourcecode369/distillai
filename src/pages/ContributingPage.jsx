import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ArrowRight, Github, Code, BookOpen, Bug, Lightbulb, Users, Heart, GitBranch, CheckCircle2, Sparkles, Zap, FileText, MessageSquare, Award, Rocket, Star, ArrowDown, ExternalLink, HelpCircle, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";

const ContributingPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const contributionTypes = useMemo(() => [
    {
      icon: <BookOpen size={24} className="drop-shadow-lg" />,
      title: t('contributing.contributionTypes.content.title'),
      description: t('contributing.contributionTypes.content.description'),
      items: [
        t('contributing.contributionTypes.content.items.fixTypos'),
        t('contributing.contributionTypes.content.items.updateInfo'),
        t('contributing.contributionTypes.content.items.addExamples'),
        t('contributing.contributionTypes.content.items.improveCode'),
        t('contributing.contributionTypes.content.items.translate'),
      ],
      color: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50/90 to-cyan-50/90 dark:from-blue-900/20 dark:to-cyan-900/20",
      badge: t('contributing.contributionTypes.content.badge'),
      difficulty: t('contributing.contributionTypes.content.difficulty'),
    },
    {
      icon: <Code size={24} className="drop-shadow-lg" />,
      title: t('contributing.contributionTypes.code.title'),
      description: t('contributing.contributionTypes.code.description'),
      items: [
        t('contributing.contributionTypes.code.items.fixBugs'),
        t('contributing.contributionTypes.code.items.addFeatures'),
        t('contributing.contributionTypes.code.items.improveUI'),
        t('contributing.contributionTypes.code.items.optimize'),
        t('contributing.contributionTypes.code.items.tests'),
      ],
      color: "from-indigo-500 to-violet-600",
      bgGradient: "from-indigo-50/90 to-violet-50/90 dark:from-indigo-900/20 dark:to-violet-900/20",
      badge: t('contributing.contributionTypes.code.badge'),
      difficulty: t('contributing.contributionTypes.code.difficulty'),
    },
    {
      icon: <Bug size={24} className="drop-shadow-lg" />,
      title: t('contributing.contributionTypes.bugs.title'),
      description: t('contributing.contributionTypes.bugs.description'),
      items: [
        t('contributing.contributionTypes.bugs.items.reportLinks'),
        t('contributing.contributionTypes.bugs.items.documentIssues'),
        t('contributing.contributionTypes.bugs.items.accessibility'),
        t('contributing.contributionTypes.bugs.items.browser'),
      ],
      color: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50/90 to-red-50/90 dark:from-orange-900/20 dark:to-red-900/20",
      badge: t('contributing.contributionTypes.bugs.badge'),
      difficulty: t('contributing.contributionTypes.bugs.difficulty'),
    },
    {
      icon: <Lightbulb size={24} className="drop-shadow-lg" />,
      title: t('contributing.contributionTypes.suggestions.title'),
      description: t('contributing.contributionTypes.suggestions.description'),
      items: [
        t('contributing.contributionTypes.suggestions.items.proposeTopics'),
        t('contributing.contributionTypes.suggestions.items.suggestFeatures'),
        t('contributing.contributionTypes.suggestions.items.learningPaths'),
        t('contributing.contributionTypes.suggestions.items.resources'),
      ],
      color: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50/90 to-pink-50/90 dark:from-purple-900/20 dark:to-pink-900/20",
      badge: t('contributing.contributionTypes.suggestions.badge'),
      difficulty: t('contributing.contributionTypes.suggestions.difficulty'),
    },
  ], [t]);

  const steps = useMemo(() => [
    {
      step: 1,
      title: t('contributing.process.fork.title'),
      description: t('contributing.process.fork.description'),
      icon: <GitBranch size={22} className="drop-shadow-sm" />,
      details: t('contributing.process.fork.details'),
    },
    {
      step: 2,
      title: t('contributing.process.branch.title'),
      description: t('contributing.process.branch.description'),
      icon: <Code size={22} className="drop-shadow-sm" />,
      details: t('contributing.process.branch.details'),
    },
    {
      step: 3,
      title: t('contributing.process.changes.title'),
      description: t('contributing.process.changes.description'),
      icon: <Zap size={22} className="drop-shadow-sm" />,
      details: t('contributing.process.changes.details'),
    },
    {
      step: 4,
      title: t('contributing.process.test.title'),
      description: t('contributing.process.test.description'),
      icon: <CheckCircle2 size={22} className="drop-shadow-sm" />,
      details: t('contributing.process.test.details'),
    },
    {
      step: 5,
      title: t('contributing.process.pr.title'),
      description: t('contributing.process.pr.description'),
      icon: <GitBranch size={22} className="drop-shadow-sm" />,
      details: t('contributing.process.pr.details'),
    },
    {
      step: 6,
      title: t('contributing.process.review.title'),
      description: t('contributing.process.review.description'),
      icon: <Sparkles size={22} className="drop-shadow-sm" />,
      details: t('contributing.process.review.details'),
    },
  ], [t]);

  const guidelines = useMemo(() => [
    {
      icon: <FileText size={20} />,
      title: t('contributing.guidelines.codeStyle.title'),
      description: t('contributing.guidelines.codeStyle.description'),
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Star size={20} />,
      title: t('contributing.guidelines.quality.title'),
      description: t('contributing.guidelines.quality.description'),
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <CheckCircle2 size={20} />,
      title: t('contributing.guidelines.testing.title'),
      description: t('contributing.guidelines.testing.description'),
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <MessageSquare size={20} />,
      title: t('contributing.guidelines.communication.title'),
      description: t('contributing.guidelines.communication.description'),
      color: "from-orange-500 to-amber-600",
    },
  ], [t]);

  const quickStart = useMemo(() => [
    {
      title: t('contributing.quickStart.firstTime.title'),
      description: t('contributing.quickStart.firstTime.description'),
      action: t('contributing.quickStart.firstTime.action'),
      icon: <Rocket size={20} />,
    },
    {
      title: t('contributing.quickStart.ideas.title'),
      description: t('contributing.quickStart.ideas.description'),
      action: t('contributing.quickStart.ideas.action'),
      icon: <Lightbulb size={20} />,
    },
    {
      title: t('contributing.quickStart.help.title'),
      description: t('contributing.quickStart.help.description'),
      action: t('contributing.quickStart.help.action'),
      icon: <HelpCircle size={20} />,
    },
  ], [t]);

  return (
    <div className="min-h-screen relative z-10 pb-16 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-violet-50/30 to-pink-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Hero
        title={t('contributing.title')}
        subtitle={t('contributing.subtitle')}
        icon={<Users size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate('/')}
        rightActions={
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Github size={16} className="group-hover:scale-110 transition-transform duration-300" />
            {t('contributing.viewOnGitHub')}
            <ExternalLink size={12} className="opacity-60" />
          </a>
        }
      />

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Spacer */}
        <div className="h-8"></div>

        {/* Welcome Message */}
        <section className="relative group mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-pink-500/10 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2rem] p-8 lg:p-10 border border-gray-200/40 dark:border-slate-700/40 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl"></div>
                <div className="relative p-5 bg-gradient-to-br from-indigo-500 via-violet-600 to-pink-600 rounded-3xl shadow-lg">
                  <Heart size={26} className="text-white drop-shadow-md" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-4 leading-tight tracking-tight">
                    {t('contributing.thankYou.title')}
                  </h2>
                  <div className="space-y-3 text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      {t('contributing.thankYou.description1')}
                    </p>
                    <p>
                      {t('contributing.thankYou.description2')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <Github size={18} className="group-hover:scale-110 transition-transform duration-200" />
                    {t('contributing.thankYou.viewRepo')}
                    <ExternalLink size={14} className="opacity-70" />
                  </a>
                  <a
                    href="#quick-start"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 font-medium text-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t('contributing.thankYou.quickStart')}
                    <ArrowDown size={16} className="animate-bounce" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section id="quick-start" className="mb-16">
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold tracking-wide uppercase">
              <Rocket size={14} />
              Getting Started
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 tracking-tight">
              {t('contributing.quickStart.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {t('contributing.quickStart.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {quickStart.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-slate-700/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-bl-3xl rounded-tr-2xl"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-4 shadow-md">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-gray-50 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-[15px]">
                    {item.description}
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium leading-relaxed">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent mb-16"></div>

        {/* Contribution Types */}
        <section className="mb-16">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-semibold tracking-wide uppercase">
              <Award size={14} />
              Contribution Types
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 tracking-tight">
              {t('contributing.contributionTypes.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {t('contributing.contributionTypes.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-7">
            {contributionTypes.map((type, index) => (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-md border border-gray-200/40 dark:border-slate-700/40 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${type.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>

                {/* Top Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${type.color}`}></div>

                <div className="relative p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${type.color} text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      {type.icon}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${type.color} shadow-sm tracking-wide uppercase`}>
                        {type.badge}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400">
                        {type.difficulty}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-50 mb-2 leading-tight">{type.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-5 text-[15px] leading-relaxed">{type.description}</p>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      {t('contributing.contributionTypes.whatYouCanDo')}:
                    </p>
                    <ul className="space-y-2.5">
                      {type.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">
                          <div className={`mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${type.color} shadow-sm`}></div>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent mb-16"></div>

        {/* Contribution Process */}
        <section className="mb-16">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-semibold tracking-wide uppercase">
              <GitBranch size={14} />
              Step-by-Step Process
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 tracking-tight">
              {t('contributing.process.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {t('contributing.process.subtitle')}
            </p>
          </div>
          <div className="relative">
            {/* Connection Line for Desktop */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-md border border-gray-200/40 dark:border-slate-700/40 p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Step Number with Gradient */}
                  <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300 ring-4 ring-white dark:ring-slate-800">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 mt-3">
                    <div className="inline-flex p-3.5 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-gray-50 mb-2 leading-tight">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px] mb-2">{step.description}</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium leading-relaxed">
                    {step.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent mb-16"></div>

        {/* Guidelines */}
        <section className="mb-16">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold tracking-wide uppercase">
              <CheckCircle2 size={14} />
              Best Practices
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 tracking-tight">
              {t('contributing.guidelines.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {t('contributing.guidelines.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {guidelines.map((guideline, index) => (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-7 border border-gray-200/40 dark:border-slate-700/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${guideline.color} rounded-t-2xl`}></div>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${guideline.color} text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    {guideline.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-gray-50 mb-2 leading-tight">{guideline.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">{guideline.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent mb-16"></div>

        {/* FAQ / Help Section */}
        <section className="mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-pink-500/5 rounded-[2rem] blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2rem] p-8 lg:p-10 border border-gray-200/40 dark:border-slate-700/40 shadow-lg">
              <div className="flex items-start gap-5 mb-8">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-md flex-shrink-0">
                  <HelpCircle size={24} className="text-white drop-shadow-sm" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-2 leading-tight">{t('contributing.help.title')}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed">{t('contributing.help.subtitle')}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 rounded-xl border border-indigo-200/40 dark:border-indigo-800/40">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-gray-50 mb-2 leading-tight">{t('contributing.help.questions.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px] mb-4">
                    {t('contributing.help.questions.description')}
                  </p>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline group"
                  >
                    {t('contributing.help.questions.action')}
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </a>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl border border-purple-200/40 dark:border-purple-800/40">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-gray-50 mb-2 leading-tight">{t('contributing.help.bugs.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px] mb-4">
                    {t('contributing.help.bugs.description')}
                  </p>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline group"
                  >
                    {t('contributing.help.bugs.action')}
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-pink-500/10 rounded-[2rem] blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-indigo-50/80 via-violet-50/80 to-pink-50/80 dark:from-indigo-900/20 dark:via-violet-900/20 dark:to-pink-900/20 backdrop-blur-2xl rounded-[2rem] p-10 lg:p-12 border border-indigo-200/40 dark:border-indigo-800/40 shadow-xl text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 via-violet-600 to-pink-600 rounded-2xl shadow-lg mb-5">
                <Star size={26} className="text-white drop-shadow-sm" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-4 tracking-tight">
                {t('contributing.ready.title')}
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                {t('contributing.ready.description')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-violet-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-base hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <Github size={20} className="group-hover:scale-110 transition-transform duration-200" />
                  {t('contributing.ready.start')}
                  <ExternalLink size={16} className="opacity-70" />
                </a>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 font-medium text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowRight className="rotate-180" size={16} />
                  {t('contributing.ready.backToHome')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

ContributingPage.propTypes = {
};

export default ContributingPage;
