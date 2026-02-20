import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ArrowRight, Mail, Send, MessageSquare, Github, Twitter, Linkedin, CheckCircle2, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import Hero from "../components/Hero";
import { dbHelpers } from "../lib/supabase";

const CONTACT_EMAIL = "sourcecode369@gmail.com";

const ContactPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dbHelpers.saveContactSubmission(formData);
    } catch {
      // DB unavailable — fall back to mailto so the message isn't lost
      const params = new URLSearchParams({
        subject: `[Distill AI] ${formData.subject}`,
        body: `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
      });
      window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString()}`;
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = useMemo(() => [
    {
      icon: Mail,
      title: t('contact.getInTouch.email.title'),
      description: t('contact.getInTouch.email.description'),
      contact: "contact@distillai.com",
      link: "mailto:contact@distillai.com",
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "from-indigo-600 to-indigo-700",
    },
    {
      icon: Github,
      title: t('contact.getInTouch.github.title'),
      description: t('contact.getInTouch.github.description'),
      contact: "github.com/sourcecode369",
      link: "https://github.com/sourcecode369",
      gradient: "from-violet-500 to-violet-600",
      hoverGradient: "from-violet-600 to-violet-700",
    },
    {
      icon: Twitter,
      title: t('contact.getInTouch.twitter.title'),
      description: t('contact.getInTouch.twitter.description'),
      contact: "@distillai",
      link: "https://twitter.com/distillai",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
    },
    {
      icon: Linkedin,
      title: t('contact.getInTouch.linkedin.title'),
      description: t('contact.getInTouch.linkedin.description'),
      contact: "Distill AI",
      link: "https://linkedin.com",
      gradient: "from-indigo-600 to-blue-600",
      hoverGradient: "from-indigo-700 to-blue-700",
    },
  ], [t]);

  return (
    <div className="min-h-screen relative z-10 pb-16 sm:pb-20">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Hero
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
        icon={<MessageSquare size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate('/')}
      />

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Spacer */}
        <div className="h-16"></div>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-14">
          {/* Enhanced Contact Methods Section */}
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-2 tracking-tight">
                {t('contact.getInTouch.title')}
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                {t('contact.getInTouch.description')}
              </p>
            </div>

            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <a
                    key={index}
                    href={method.link}
                    target={method.link.startsWith("http") ? "_blank" : undefined}
                    rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group relative block bg-gray-900/50 rounded-2xl border border-gray-800/60 p-6 hover:border-indigo-700/60 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1.5"
                  >
                    {/* Subtle hover glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                    <div className="relative flex items-start gap-5">
                      <div className={`flex-shrink-0 p-3.5 rounded-xl bg-gradient-to-br ${method.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <IconComponent size={20} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                            {method.title}
                          </h3>
                          <ArrowUpRight size={18} className="text-gray-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-200 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                        </div>
                        <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                          {method.description}
                        </p>
                        <p className={`text-sm font-semibold bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent`}>
                          {method.contact}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Enhanced Response Time Info Card */}
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-950/30 to-violet-950/20 rounded-2xl border border-indigo-800/40 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white">
                  <Clock size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-100 mb-1.5">
                    {t('contact.responseTime.title')}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('contact.responseTime.description') }} />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-2 tracking-tight">
                {t('contact.sendMessage.title')}
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                {t('contact.sendMessage.description')}
              </p>
            </div>

            {submitted ? (
              <div className="relative bg-gray-900/60 rounded-2xl border border-indigo-800/40 p-12 sm:p-14 text-center">
                {/* Success glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-2xl blur-2xl"></div>

                <div className="relative">
                  <div className="inline-flex p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30">
                    <CheckCircle2 size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-3">
                    {t('contact.sendMessage.sent')}
                  </h3>
                  <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed">
                    {t('contact.sendMessage.sentDescription')}
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative bg-gray-900/50 rounded-2xl border border-gray-800/60 p-7 sm:p-9 space-y-6"
              >
                {/* Form glow on focus */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 rounded-2xl blur-2xl transition-opacity duration-500"
                  style={{ opacity: focusedField ? 0.05 : 0 }}></div>

                <div className="relative space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-100"
                    >
                      {t('contact.sendMessage.name')}
                      <span className="text-indigo-600 dark:text-indigo-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-base"
                      placeholder={t('contact.sendMessage.namePlaceholder')}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-100"
                    >
                      {t('contact.sendMessage.email')}
                      <span className="text-indigo-600 dark:text-indigo-400 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-base"
                      placeholder={t('contact.sendMessage.emailPlaceholder')}
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-100"
                    >
                      {t('contact.sendMessage.subject')}
                      <span className="text-indigo-600 dark:text-indigo-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-base"
                      placeholder={t('contact.sendMessage.subjectPlaceholder')}
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-100"
                    >
                      {t('contact.sendMessage.message')}
                      <span className="text-indigo-600 dark:text-indigo-400 ml-1">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={7}
                      className="w-full px-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-base leading-relaxed"
                      placeholder={t('contact.sendMessage.messagePlaceholder')}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full relative flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base rounded-xl hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    {submitting ? (
                      <svg className="relative z-10 animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <Send size={18} className="relative z-10" strokeWidth={2.5} />
                    )}
                    <span className="relative z-10">{submitting ? "Sending…" : t('contact.sendMessage.send')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ContactPage.propTypes = {
};

export default ContactPage;
