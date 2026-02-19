import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-gray-950">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Footer illustration */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 opacity-30"
          aria-hidden="true"
        >
          <img
            className="max-w-none"
            src="/images/footer-illustration.svg"
            width={1076}
            height={378}
            alt="Footer illustration"
          />
        </div>

        <div className="grid grid-cols-2 justify-between gap-12 border-t py-12 sm:grid-rows-[auto_auto] md:grid-cols-4 md:grid-rows-[auto_auto] md:py-16 lg:grid-cols-[repeat(4,minmax(0,140px))_1fr] lg:grid-rows-1 xl:gap-20" style={{
          borderImage: 'linear-gradient(to right, transparent, rgba(148, 163, 184, 0.25), transparent) 1'
        }}>
          {/* 1st block - Platform */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/handbooks'); }}
                >
                  Handbooks
                </a>
              </li>
            </ul>
          </div>

          {/* 2nd block - Resources */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/faq'); }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* 3rd block - Community */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/bookmarks'); }}
                >
                  Bookmarks
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/profile'); }}
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/progress'); }}
                >
                  Progress
                </a>
              </li>
            </ul>
          </div>

          {/* 4th block - Learning */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Learning</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/handbooks'); }}
                >
                  Get Started
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/search-history'); }}
                >
                  Search History
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}
                >
                  Notifications
                </a>
              </li>
            </ul>
          </div>

          {/* 5th block - Branding & Social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:text-right">
            <div className="mb-3">
              <div className="inline-flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700">
                  <svg viewBox="0 0 100 100" className="w-5 h-5" aria-hidden="true">
                    <defs>
                      <linearGradient id="footer-d" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#c7d2fe" />
                      </linearGradient>
                    </defs>
                    <path d="M28 20 L28 80 L52 80 C70 80 78 68 78 50 C78 32 70 20 52 20 Z M40 32 L50 32 C62 32 66 39 66 50 C66 61 62 68 50 68 L40 68 Z" fill="url(#footer-d)" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-200">Distill AI</span>
              </div>
            </div>
            <div className="text-sm">
              <p className="mb-3 text-indigo-200/65">
                © 2025 Distill AI
              </p>
              <ul className="inline-flex gap-1">
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <svg
                      className="h-8 w-8 fill-current"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="h-8 w-8 fill-current"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23 8H9a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Zm-8 12h-2v-6h2v6Zm-1-6.8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4ZM20 20h-2v-3.2c0-1-.4-1.8-1.4-1.8-.8 0-1.2.5-1.4 1-.1.2-.1.4-.1.6V20h-2v-6h2v.8c.3-.4.9-1 2.1-1 1.5 0 2.7 1 2.7 3.1V20Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Github"
                  >
                    <svg
                      className="h-8 w-8 fill-current"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;

