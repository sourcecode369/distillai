import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ArrowRight, ChevronDown, HelpCircle, Search, Sparkles, BookOpen, User, Settings, Zap } from "lucide-react";
import Hero from "../components/Hero";

const FAQPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = useMemo(() => [
    {
      title: t('faq.categories.gettingStarted.title'),
      icon: <Zap size={24} className="drop-shadow-lg" />,
      color: "from-indigo-500 to-violet-600",
      bgColor: "from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/20 dark:to-violet-900/20",
      questions: [
        {
          q: t('faq.categories.gettingStarted.questions.whatIs.q'),
          a: t('faq.categories.gettingStarted.questions.whatIs.a'),
        },
        {
          q: t('faq.categories.gettingStarted.questions.howToStart.q'),
          a: t('faq.categories.gettingStarted.questions.howToStart.a'),
        },
        {
          q: t('faq.categories.gettingStarted.questions.needAccount.q'),
          a: t('faq.categories.gettingStarted.questions.needAccount.a'),
        },
        {
          q: t('faq.categories.gettingStarted.questions.isFree.q'),
          a: t('faq.categories.gettingStarted.questions.isFree.a'),
        },
      ],
    },
    {
      title: t('faq.categories.learning.title'),
      icon: <BookOpen size={24} className="drop-shadow-lg" />,
      color: "from-indigo-500 to-violet-600",
      bgColor: "from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/20 dark:to-violet-900/20",
      questions: [
        {
          q: t('faq.categories.learning.questions.updateFrequency.q'),
          a: t('faq.categories.learning.questions.updateFrequency.a'),
        },
        {
          q: t('faq.categories.learning.questions.suggestTopics.q'),
          a: t('faq.categories.learning.questions.suggestTopics.a'),
        },
        {
          q: t('faq.categories.learning.questions.prerequisites.q'),
          a: t('faq.categories.learning.questions.prerequisites.a'),
        },
        {
          q: t('faq.categories.learning.questions.offlineReading.q'),
          a: t('faq.categories.learning.questions.offlineReading.a'),
        },
      ],
    },
    {
      title: t('faq.categories.account.title'),
      icon: <User size={24} className="drop-shadow-lg" />,
      color: "from-indigo-500 to-violet-600",
      bgColor: "from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/20 dark:to-violet-900/20",
      questions: [
        {
          q: t('faq.categories.account.questions.accountFeatures.q'),
          a: t('faq.categories.account.questions.accountFeatures.a'),
        },
        {
          q: t('faq.categories.account.questions.resetPassword.q'),
          a: t('faq.categories.account.questions.resetPassword.a'),
        },
        {
          q: t('faq.categories.account.questions.socialLogin.q'),
          a: t('faq.categories.account.questions.socialLogin.a'),
        },
        {
          q: t('faq.categories.account.questions.deleteAccount.q'),
          a: t('faq.categories.account.questions.deleteAccount.a'),
        },
      ],
    },
    {
      title: t('faq.categories.technical.title'),
      icon: <Settings size={24} className="drop-shadow-lg" />,
      color: "from-indigo-500 to-violet-600",
      bgColor: "from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/20 dark:to-violet-900/20",
      questions: [
        {
          q: t('faq.categories.technical.questions.browsers.q'),
          a: t('faq.categories.technical.questions.browsers.a'),
        },
        {
          q: t('faq.categories.technical.questions.mobile.q'),
          a: t('faq.categories.technical.questions.mobile.a'),
        },
        {
          q: t('faq.categories.technical.questions.extensions.q'),
          a: t('faq.categories.technical.questions.extensions.a'),
        },
        {
          q: t('faq.categories.technical.questions.reportBug.q'),
          a: t('faq.categories.technical.questions.reportBug.a'),
        },
      ],
    },
  ], [t]);

  const filteredCategories = searchQuery
    ? faqCategories.map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter((cat) => cat.questions.length > 0)
    : faqCategories;

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        icon={<HelpCircle size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate('/')}
      />

      {/* Search Bar Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
              <Search className="text-indigo-500 dark:text-indigo-400" size={20} strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-indigo-200/50 dark:border-indigo-800/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10 transition-all duration-300 hover:border-indigo-300/70 dark:hover:border-indigo-700/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                aria-label="Clear search"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 mb-6 shadow-lg">
              <Search size={28} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('faq.noResults')}</h3>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
              {t('faq.noResultsDescription')}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('faq.clearSearch')}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category, catIndex) => (
              <div
                key={catIndex}
                className="group relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/8 dark:hover:shadow-indigo-500/15 transition-all duration-500"
              >
                {/* Subtle Gradient Background with Refined Opacity */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-30 group-hover:opacity-50 transition-opacity duration-700`}></div>

                {/* Elegant Top Border Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative p-8">
                  {/* Category Header */}
                  <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-200/50 dark:border-slate-700/50">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-100 tracking-tight mb-1 leading-tight">
                        {category.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                        {category.questions.length} {t('faq.question', { count: category.questions.length })}
                      </p>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {category.questions.map((faq, qIndex) => {
                      const globalIndex = `${catIndex}-${qIndex}`;
                      const isOpen = openIndex === globalIndex;
                      return (
                        <div
                          key={qIndex}
                          className="relative bg-white/70 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-600/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-300/80 dark:hover:border-indigo-700/60"
                        >
                          {/* Question Button */}
                          <button
                            onClick={() => toggleQuestion(globalIndex)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleQuestion(globalIndex);
                              }
                            }}
                            className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-white/80 dark:hover:bg-slate-700/70 transition-all duration-300 group/question focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-${globalIndex}`}
                            id={`faq-question-${globalIndex}`}
                          >
                            <span className={`flex-1 font-semibold text-base lg:text-lg text-slate-900 dark:text-gray-100 leading-relaxed group-hover/question:text-indigo-600 dark:group-hover/question:text-indigo-400 transition-colors duration-300 pr-4 ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                              {faq.q}
                            </span>
                            <div className="flex-shrink-0 mt-1" aria-hidden="true">
                              <div className={`p-2.5 rounded-xl bg-indigo-100/80 dark:bg-indigo-900/30 transition-all duration-300 ${isOpen ? 'bg-indigo-200 dark:bg-indigo-800/50' : 'group-hover/question:bg-indigo-200 dark:group-hover/question:bg-indigo-800/50'}`}>
                                <ChevronDown
                                  size={20}
                                  className={`text-indigo-600 dark:text-indigo-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                    }`}
                                  strokeWidth={2.5}
                                />
                              </div>
                            </div>
                          </button>

                          {/* Answer */}
                          {isOpen && (
                            <div
                              id={`faq-answer-${globalIndex}`}
                              className="px-5 pb-5 pt-0 border-t border-gray-200/50 dark:border-slate-600/50 animate-fade-in"
                              role="region"
                              aria-labelledby={`faq-question-${globalIndex}`}
                            >
                              <div className="pt-4">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base font-normal">
                                  {faq.a}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

FAQPage.propTypes = {
};

export default FAQPage;
