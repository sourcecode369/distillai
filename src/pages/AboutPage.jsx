import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ArrowRight, Github, Mail, Sparkles, Target, BookOpen, Zap, Users, Heart, TrendingUp, Globe, Award, Rocket, Lightbulb, Star, Code, Layers, Brain } from "lucide-react";
import Hero from "../components/Hero";
import SEO from "../components/SEO";

const AboutPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const journeySteps = useMemo(() => [
    {
      icon: <Lightbulb size={32} className="drop-shadow-lg" />,
      title: t('about.ourJourney.vision.title'),
      description: t('about.ourJourney.vision.description'),
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: <Rocket size={32} className="drop-shadow-lg" />,
      title: t('about.ourJourney.launch.title'),
      description: t('about.ourJourney.launch.description'),
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: <Users size={32} className="drop-shadow-lg" />,
      title: t('about.ourJourney.community.title'),
      description: t('about.ourJourney.community.description'),
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <TrendingUp size={32} className="drop-shadow-lg" />,
      title: t('about.ourJourney.future.title'),
      description: t('about.ourJourney.future.description'),
      color: "from-violet-500 to-pink-600",
    },
  ], [t]);

  const values = useMemo(() => [
    {
      icon: <Target size={28} className="drop-shadow-lg" />,
      title: t('about.values.clarity.title'),
      description: t('about.values.clarity.description'),
      color: "from-indigo-500 to-violet-600",
      bgColor: "from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/20 dark:to-violet-900/20",
    },
    {
      icon: <Sparkles size={28} className="drop-shadow-lg" />,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description'),
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50/80 to-purple-50/80 dark:from-violet-900/20 dark:to-purple-900/20",
    },
    {
      icon: <Zap size={28} className="drop-shadow-lg" />,
      title: t('about.values.practical.title'),
      description: t('about.values.practical.description'),
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20",
    },
    {
      icon: <Heart size={28} className="drop-shadow-lg" />,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50/80 to-rose-50/80 dark:from-pink-900/20 dark:to-rose-900/20",
    },
    {
      icon: <TrendingUp size={28} className="drop-shadow-lg" />,
      title: t('about.values.evolving.title'),
      description: t('about.values.evolving.description'),
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20",
    },
    {
      icon: <Globe size={28} className="drop-shadow-lg" />,
      title: t('about.values.accessible.title'),
      description: t('about.values.accessible.description'),
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
  ], [t]);

  const stats = useMemo(() => [
    {
      label: t('about.growingTogether.categories'),
      value: "50+",
      icon: <Layers size={28} className="drop-shadow-lg" />,
      color: "from-indigo-500 to-violet-600",
      description: t('about.growingTogether.categoriesDesc')
    },
    {
      label: t('about.growingTogether.topics'),
      value: "200+",
      icon: <BookOpen size={28} className="drop-shadow-lg" />,
      color: "from-violet-500 to-purple-600",
      description: t('about.growingTogether.topicsDesc')
    },
    {
      label: t('about.growingTogether.contributors'),
      value: "100+",
      icon: <Users size={28} className="drop-shadow-lg" />,
      color: "from-amber-500 to-orange-600",
      description: t('about.growingTogether.contributorsDesc')
    },
    {
      label: t('about.growingTogether.resources'),
      value: "1000+",
      icon: <Sparkles size={28} className="drop-shadow-lg" />,
      color: "from-emerald-500 to-teal-600",
      description: t('about.growingTogether.resourcesDesc')
    },
  ], [t]);

  return (
    <div className="min-h-screen relative z-10 pb-12 overflow-hidden">
      <SEO
        title={t('about.title')}
        description={t('about.subtitle')}
        url="/about"
      />
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-violet-50/20 to-pink-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Hero
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        icon={<Brain size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate('/')}
        rightActions={
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Github size={16} className="group-hover:scale-110 transition-transform duration-300" />
            {t('about.viewOnGitHub')}
          </a>
        }
      />

      {/* Story Section - Our Journey */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            <Sparkles size={24} className="text-indigo-500 dark:text-indigo-400" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-2">
            {t('about.ourJourney.title')}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('about.ourJourney.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-violet-200 to-pink-200 dark:from-indigo-800 dark:via-violet-800 dark:to-pink-800 transform -translate-x-1/2"></div>

          <div className="space-y-6 lg:space-y-8">
            {journeySteps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center gap-5 lg:gap-6 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
              >
                {/* Icon on Timeline */}
                <div className="relative z-10 shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full blur-2xl opacity-30`}></div>
                  <div className={`relative p-5 bg-gradient-to-br ${step.color} rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'} text-center lg:text-left`}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-800/80 dark:to-slate-900/80 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-50 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-2">
            {t('about.growingTogether.title')}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('about.growingTogether.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-8 lg:p-10 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-30 blur-2xl rounded-3xl transition-opacity duration-500`}></div>

              <div className="relative">
                <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-700 dark:from-gray-50 dark:to-gray-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </div>
                <div className="text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Values Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mission Statement */}
        <div className="relative group mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/25 to-violet-500/25 rounded-[3rem] blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-indigo-50/95 to-violet-50/95 dark:from-indigo-900/40 dark:to-violet-900/40 backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 border-2 border-indigo-200/60 dark:border-indigo-800/60 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl shadow-xl">
                  <Target size={32} className="text-white drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                  {t('about.mission.title')}
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                {t('about.mission.description1')}
              </p>
              <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                {t('about.mission.description2')}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
              <Award size={24} className="text-violet-500 dark:text-violet-400" />
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-2">
              {t('about.values.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgColor} opacity-0 group-hover:opacity-100 rounded-[2.5rem] transition-opacity duration-500`}></div>
                <div className={`absolute -inset-2 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-25 blur-2xl transition-opacity duration-500 rounded-[2.5rem]`}></div>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color} rounded-t-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} text-white mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {value.icon}
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-gray-50 mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community & Contribution Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative group mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/25 to-violet-500/25 rounded-[3rem] blur-3xl"></div>
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Heart size={32} className="text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50">
                    {t('about.builtByCommunity.title')}
                  </h2>
                  <div className="h-1.5 flex-1 max-w-32 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"></div>
                </div>
                <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-3">
                  {t('about.builtByCommunity.description1')}
                </p>
                <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-5">
                  {t('about.builtByCommunity.description2')}
                </p>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white rounded-2xl hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all shadow-xl hover:shadow-2xl font-bold text-lg hover:scale-105 active:scale-95"
                >
                  <Github size={22} className="drop-shadow-sm group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span>{t('about.builtByCommunity.contribute')}</span>
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/25 to-violet-500/25 rounded-[3rem] blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-indigo-50/95 to-violet-50/95 dark:from-indigo-900/40 dark:to-violet-900/40 backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 border-2 border-indigo-200/60 dark:border-indigo-800/60 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl shadow-xl">
                  <Globe size={32} className="text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                  {t('about.connect.title')}
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"></div>
              </div>
            </div>
            <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-5 max-w-2xl">
              {t('about.connect.description')}
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white rounded-2xl hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all shadow-xl hover:shadow-2xl font-bold text-lg hover:scale-105 active:scale-95"
              >
                <Github size={24} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                <span>{t('about.connect.github')}</span>
              </a>
              <a
                href="mailto:contact@robuildsai.com"
                className="group/btn flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-xl hover:shadow-2xl font-bold text-lg hover:scale-105 active:scale-95"
              >
                <Mail size={22} className="drop-shadow-sm group-hover/btn:scale-110 transition-transform duration-300" />
                <span>{t('about.connect.emailUs')}</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AboutPage.propTypes = {
};

export default AboutPage;
