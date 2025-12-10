import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Github, Linkedin, Mail, Twitter, BookOpen, Users, FileText, HelpCircle, Shield, Code, Heart } from "lucide-react";

const Footer = ({ onAboutClick, onFAQClick, onContributingClick, onCodeOfConductClick, onContactClick }) => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    resources: [
      { name: t('nav.about'), icon: BookOpen, onClick: onAboutClick },
      { name: t('nav.faq'), icon: HelpCircle, onClick: onFAQClick },
      { name: t('nav.contributing'), icon: Code, onClick: onContributingClick },
      { name: t('nav.codeOfConduct'), icon: Shield, onClick: onCodeOfConductClick },
    ],
    connect: [
      { name: "GitHub", icon: Github, href: "https://github.com" },
      { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
      { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
      { name: t('nav.contact'), icon: Mail, onClick: onContactClick },
    ],
  };

  return (
    <footer className="relative border-t-2 border-gray-300/60 dark:border-slate-700/80 glass-enhanced pt-8">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-pink-500/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                <BookOpen size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-gray-100 tracking-tight">
                AI<span className="text-slate-600 dark:text-gray-400 font-semibold">Handbooks</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500 flex-wrap">
              <Heart size={12} className="text-red-500 flex-shrink-0" />
              <span className="break-words">{t('footer.madeWith')}</span>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={link.onClick}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group active:scale-95 focus:outline-none rounded-lg px-1 py-0.5"
                    aria-label={link.name}
                  >
                    <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              {t('footer.connect')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group active:scale-95 focus:outline-none rounded-lg px-1 py-0.5"
                      aria-label={link.name}
                    >
                      <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group"
                    >
                      <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              {t('footer.community')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#discord"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group active:scale-95 focus:outline-none rounded-lg px-1 py-0.5"
                  aria-label="Discord"
                >
                  <Users size={16} className="group-hover:scale-110 transition-transform" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#forum"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group active:scale-95 focus:outline-none rounded-lg px-1 py-0.5"
                  aria-label="Forum"
                >
                  <FileText size={16} className="group-hover:scale-110 transition-transform" />
                  Forum
                </a>
              </li>
              <li>
                <a
                  href="#newsletter"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group active:scale-95 focus:outline-none rounded-lg px-1 py-0.5"
                  aria-label="Newsletter"
                >
                  <Mail size={16} className="group-hover:scale-110 transition-transform" />
                  Newsletter
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group active:scale-95 focus:outline-none rounded-lg px-1 py-0.5"
                  aria-label="Blog"
                >
                  <BookOpen size={16} className="group-hover:scale-110 transition-transform" />
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200/50 dark:border-slate-700/50 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-500 text-center sm:text-left whitespace-nowrap">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-slate-500 flex-wrap justify-center sm:justify-end">
              <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
                {t('footer.termsOfService')}
              </a>
              <a href="#license" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
                {t('footer.license')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  onAboutClick: PropTypes.func.isRequired,
  onFAQClick: PropTypes.func.isRequired,
  onContributingClick: PropTypes.func.isRequired,
  onCodeOfConductClick: PropTypes.func.isRequired,
  onContactClick: PropTypes.func.isRequired,
};

export default Footer;

