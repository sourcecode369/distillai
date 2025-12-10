import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ArrowRight, Shield, Users, Heart, AlertTriangle, CheckCircle2, Mail, Scale, FileText, Clock, ExternalLink, Eye } from "lucide-react";
import Callout from "../components/Callout";
import Hero from "../components/Hero";

const CodeOfConductPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const principles = useMemo(() => [
    {
      icon: <Users size={24} className="drop-shadow-lg" />,
      title: t('codeOfConduct.standards.respectful.title'),
      description: t('codeOfConduct.standards.respectful.description'),
    },
    {
      icon: <Heart size={24} className="drop-shadow-lg" />,
      title: t('codeOfConduct.standards.inclusive.title'),
      description: t('codeOfConduct.standards.inclusive.description'),
    },
    {
      icon: <Shield size={24} className="drop-shadow-lg" />,
      title: t('codeOfConduct.standards.constructive.title'),
      description: t('codeOfConduct.standards.constructive.description'),
    },
    {
      icon: <CheckCircle2 size={24} className="drop-shadow-lg" />,
      title: t('codeOfConduct.standards.collaborative.title'),
      description: t('codeOfConduct.standards.collaborative.description'),
    },
  ], [t]);

  const unacceptableBehaviors = useMemo(() => [
    {
      category: t('codeOfConduct.unacceptable.harassment.category'),
      items: t('codeOfConduct.unacceptable.harassment.items', { returnObjects: true }),
    },
    {
      category: t('codeOfConduct.unacceptable.communication.category'),
      items: t('codeOfConduct.unacceptable.communication.items', { returnObjects: true }),
    },
    {
      category: t('codeOfConduct.unacceptable.privacy.category'),
      items: t('codeOfConduct.unacceptable.privacy.items', { returnObjects: true }),
    },
    {
      category: t('codeOfConduct.unacceptable.other.category'),
      items: t('codeOfConduct.unacceptable.other.items', { returnObjects: true }),
    },
  ], [t]);


  return (
    <div className="min-h-screen relative z-10 pb-16 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-violet-50/30 to-pink-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Hero
        title={t('codeOfConduct.title')}
        subtitle={t('codeOfConduct.subtitle')}
        icon={<Shield size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate('/')}
      />

      {/* Main Content Section */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        {/* Introduction Section */}
        <section id="introduction" className="mb-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('codeOfConduct.introduction')}
            </p>
            <Callout type="info" title={t('codeOfConduct.commitment.title')}>
              {t('codeOfConduct.commitment.description')}
            </Callout>
          </div>
        </section>

        {/* Pledge Section */}
        <section id="pledge" className="mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-indigo-200/50 dark:border-indigo-800/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg">
                  <FileText size={28} className="text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-2 leading-tight">
                    {t('codeOfConduct.pledge.title')}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full mb-4"></div>
                </div>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {t('codeOfConduct.pledge.description1')}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('codeOfConduct.pledge.description2')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Standards Section */}
        <section id="standards" className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3 leading-tight">
              {t('codeOfConduct.standards.title')}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {t('codeOfConduct.standards.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 w-fit">
                    {principle.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-2 leading-tight">
                      {principle.title}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Callout type="tip" title="Pro Tip">
            {t('codeOfConduct.standards.tip')}
          </Callout>
        </section>

        {/* Unacceptable Behavior Section */}
        <section id="unacceptable" className="mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-red-200/50 dark:border-red-900/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
                  <AlertTriangle size={28} className="text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-2 leading-tight">
                    {t('codeOfConduct.unacceptable.title')}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-4"></div>
                </div>
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {t('codeOfConduct.unacceptable.subtitle')}
              </p>

              <div className="space-y-6">
                {unacceptableBehaviors.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border-l-4 border-red-500/50 dark:border-red-600/50 pl-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                      {category.category}
                    </h3>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-red-500 dark:bg-red-400"></span>
                          <span className="flex-1 text-base leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enforcement Section */}
        <section id="enforcement" className="mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-indigo-200/50 dark:border-indigo-800/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg">
                  <Scale size={28} className="text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-2 leading-tight">
                    {t('codeOfConduct.enforcement.title')}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full mb-4"></div>
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('codeOfConduct.enforcement.description1')}
                </p>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mt-6 mb-3">
                  {t('codeOfConduct.enforcement.authority.title')}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('codeOfConduct.enforcement.authority.description')}
                </p>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mt-6 mb-3">
                  {t('codeOfConduct.enforcement.transparency.title')}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('codeOfConduct.enforcement.transparency.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reporting Section */}
        <section id="reporting" className="mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-indigo-200/50 dark:border-indigo-800/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg">
                  <Mail size={28} className="text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-2 leading-tight">
                    {t('codeOfConduct.reporting.title')}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full mb-4"></div>
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('codeOfConduct.reporting.description1')}
                </p>

                <Callout type="warning" title={t('messages.warning', { defaultValue: 'Important' })}>
                  {t('codeOfConduct.reporting.important')}
                </Callout>

                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200/50 dark:border-indigo-800/30">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                    {t('codeOfConduct.reporting.howTo.title')}
                  </h3>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    {t('codeOfConduct.reporting.howTo.description1')}{" "}
                    <a
                      href="#contact"
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {t('codeOfConduct.reporting.howTo.contactPage')}
                      <ExternalLink size={16} />
                    </a>
                    {" "}{t('codeOfConduct.reporting.howTo.description2')}
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('codeOfConduct.reporting.howTo.description3')}
                  </p>
                  <ul className="mt-2 space-y-1.5 text-base text-gray-700 dark:text-gray-300">
                    {t('codeOfConduct.reporting.howTo.items', { returnObjects: true }).map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scope Section */}
        <section id="scope" className="mb-16">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-lg p-6 lg:p-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3 leading-tight">
              {t('codeOfConduct.scope.title')}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full mb-4"></div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('codeOfConduct.scope.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Attribution Section */}
        <section id="attribution" className="mb-8">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-lg p-6 lg:p-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3 leading-tight">
              {t('codeOfConduct.attribution.title')}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full mb-4"></div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('codeOfConduct.attribution.description1')}{" "}
                <a
                  href="https://www.contributor-covenant.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  {t('codeOfConduct.attribution.covenant')}
                  <ExternalLink size={16} />
                </a>
                {", "}{t('codeOfConduct.attribution.description2')}{" "}
                <a
                  href="https://www.contributor-covenant.org/version/2/1/code_of_conduct/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  {t('codeOfConduct.attribution.versionUrl')}
                  <ExternalLink size={16} />
                </a>
              </p>
              <p className="text-base text-gray-600 dark:text-slate-400 leading-relaxed">
                {t('codeOfConduct.attribution.description3')}{" "}
                <a
                  href="https://www.contributor-covenant.org/faq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium underline decoration-2 underline-offset-4 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  {t('codeOfConduct.attribution.faqUrl')}
                  <ExternalLink size={16} />
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

CodeOfConductPage.propTypes = {
};

export default CodeOfConductPage;