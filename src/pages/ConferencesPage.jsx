import React, { useEffect } from "react";
import { Calendar } from "lucide-react";
import Hero from "../components/Hero";
import SEO from "../components/SEO";
import ConferenceCard from "../components/ConferenceCard";
import HorizontalScroller from "../components/HorizontalScroller";
import { conferenceDomains } from "../data/conferencesData";

/**
 * ConferencesPage Component
 * 
 * Displays AI/ML conferences organized by domain
 * Each domain has a horizontal scrollable row of conference cards
 */
const ConferencesPage = () => {
  // Scroll-triggered fade-in for sections (matching handbooks page)
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.conference-section-fade');
    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className="pb-0 relative z-10 overflow-x-hidden">
      <SEO
        title="AI & ML Conferences"
        description="Explore top AI and ML conferences across all domains - from NeurIPS to CVPR, discover the premier venues for cutting-edge research."
        url="/conferences"
      />

      {/* Hero Section */}
      <Hero
        title="AI & ML Conferences"
        subtitle="Explore top venues in each domain. Click a card to open the official conference website."
        icon={<Calendar size={22} className="text-white drop-shadow-sm" />}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 mb-16">
        {conferenceDomains.map((domain, idx) => (
          <section
            key={domain.id}
            className="conference-section-fade section-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Domain Header */}
            <div className="mb-10">
              {/* Section Title with gradient on last word */}
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight relative inline-block text-balance mb-3">
                {(() => {
                  const titleParts = domain.title.split(' ');
                  const lastWord = titleParts.pop();
                  const restOfTitle = titleParts.join(' ');
                  return (
                    <>
                      {restOfTitle && <span className="text-slate-700 dark:text-slate-200">{restOfTitle} </span>}
                      <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">{lastWord}</span>
                    </>
                  );
                })()}
                <span className="absolute -bottom-1.5 left-0 right-0 h-px section-divider"></span>
              </h2>

              {/* Description */}
              <p className="mt-3 text-base text-gray-600 dark:text-slate-400 max-w-3xl">
                {domain.description}
              </p>
            </div>

            {/* Horizontal Scroller with Conference Cards */}
            <HorizontalScroller
              scrollId={domain.id}
              ariaLabel={`${domain.title} conferences`}
            >
              {domain.conferences.map((conference) => (
                <ConferenceCard
                  key={conference.id}
                  name={conference.name}
                  tier={conference.tier}
                  domainTag={conference.domainTag}
                  subtitle={conference.subtitle}
                  frequency={conference.frequency}
                  usualMonth={conference.usualMonth}
                  badgeChip={conference.badgeChip}
                  url={conference.url}
                />
              ))}
            </HorizontalScroller>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ConferencesPage;
