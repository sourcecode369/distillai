import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { useSidebarOffset } from "../hooks/useSidebarOffset";
import { useActiveSection as useActiveSectionHook } from "../hooks/useActiveSection";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  Video,
  Layers,
  Printer,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Calendar,
  Code,
  EyeOff,
  Eye,
  Loader2,
} from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import BookmarkButton from "../components/BookmarkButton";
import ShareButtons from "../components/ShareButtons";
import RelatedTopics from "../components/RelatedTopics";
import Breadcrumbs from "../components/Breadcrumbs";
import MarkAsCompleteButton from "../components/MarkAsCompleteButton";
import CodeBlock from "../components/CodeBlock";
import Table from "../components/Table";
import LazyImage from "../components/LazyImage";
import Hero from "../components/Hero";
import MathEquation from "../components/MathEquation";
import Callout from "../components/Callout";
import Quote from "../components/Quote";
import Definition from "../components/Definition";
import Steps from "../components/Steps";
import Checklist from "../components/Checklist";
import Tabs from "../components/Tabs";
import Prerequisites from "../components/Prerequisites";
import LearningObjectives from "../components/LearningObjectives";
import { exportToPDF } from "../utils/pdfExport";
import SEO from "../components/SEO";
import CompletionDialog from "../components/CompletionDialog";
import TopicProgressBar from "../components/topic/TopicProgressBar";
import TopicTableOfContents from "../components/topic/TopicTableOfContents";
import { ErrorState } from "../components/EmptyState";
import { dbHelpers } from "../lib/supabase";
import { loadTopic } from "../utils/topicLoader";
import { loadSectionsWithCategories } from "../utils/dataLoader";
import { useTranslation } from "react-i18next";
import { translateSectionsWithCategories } from "../utils/translateContent";

const TopicView = () => {
  const { t } = useTranslation('handbook');
  const { addToHistory, darkMode } = useApp();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { categoryId, topicId } = useParams();
  const [isMobileTOCOpen, setIsMobileTOCOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);
  const [hideCode, setHideCode] = useState(false);
  const [hasCode, setHasCode] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const topicContentRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Mouse tracking for dynamic gradients
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Memoized particle configurations
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)],
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.5,
      color: i % 3 === 0 ? 'from-indigo-400 to-violet-400' : i % 3 === 1 ? 'from-violet-400 to-pink-400' : 'from-pink-400 to-indigo-400'
    }));
  }, []);

  // Fetch sections to get category metadata
  const { data: sectionsData } = useQuery({
    queryKey: ["sections-with-categories"],
    queryFn: loadSectionsWithCategories,
  });

  // Find the category from sections
  const category = useMemo(() => {
    if (!sectionsData) return null;
    const translatedSections = translateSectionsWithCategories(sectionsData, t);
    for (const section of translatedSections) {
      const found = section.categories.find(c => c.id === categoryId || c.category_id === categoryId);
      if (found) return found;
    }
    return null;
  }, [sectionsData, categoryId, t]);

  // Fetch topic data
  const {
    data: topic,
    isLoading: loadingTopic,
    error: topicError
  } = useQuery({
    queryKey: ["topic", categoryId, topicId],
    queryFn: () => loadTopic(categoryId, topicId),
    enabled: !!categoryId && !!topicId,
  });

  // Custom hooks for optimized behavior
  const { readingProgress, contentRef } = useReadingProgress(topic);
  const sidebarOffset = useSidebarOffset();
  const activeSectionHook = useActiveSectionHook(topic); // Renamed to avoid conflict with local state

  // Scroll animation hook
  useScrollAnimation(topic);

  // Fetch completion status using React Query
  const {
    data: completionData,
    isLoading: isCheckingCompletion,
  } = useQuery({
    queryKey: ["topic-completion", user?.id, categoryId, topicId],
    queryFn: async () => {
      if (!user?.id || !categoryId || !topicId) return { completed: false };
      const { data, error } = await dbHelpers.getUserProgress(
        user.id,
        categoryId,
        topicId
      );
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching completion status:", error);
        return { completed: false };
      }
      return { completed: data?.completed || false };
    },
    enabled: !!user?.id && !!categoryId && !!topicId,
  });

  const isTopicCompleted = completionData?.completed || false;

  // Add to reading history (only if user is signed in)
  useEffect(() => {
    if (user?.id && topic && category) {
      addToHistory({
        id: topic.id,
        type: 'topic',
        categoryId: category.id,
        topicId: topic.id,
        title: topic.title,
        categoryTitle: category.title,
      }, user.id);
    }
  }, [user?.id, topic, category, addToHistory]);

  // Memoize handlers
  const handlePrint = () => {
    window.print();
  };

  const handleTakeQuiz = () => {
    navigate(`/quiz/${categoryId}/${topicId}`);
  };

  const handleBackToCategory = useCallback(() => {
    if (category) {
      navigate(`/category/${category.id}`);
    } else {
      navigate('/handbooks');
    }
  }, [navigate, category]);

  // Check if user has reached the end for completion dialog
  useEffect(() => {
    if (!user?.id || hasShownDialog || readingProgress < 90 || isTopicCompleted || isCheckingCompletion) return;

    const checkEndReached = () => {
      const feedbackSection = document.getElementById('feedback-section');
      if (feedbackSection) {
        const rect = feedbackSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !isTopicCompleted) {
          setShowCompletionDialog(true);
          setHasShownDialog(true);
        }
      }
    };

    const timer = setTimeout(checkEndReached, 300);
    return () => clearTimeout(timer);
  }, [readingProgress, user?.id, hasShownDialog, isTopicCompleted, isCheckingCompletion]);

  // Memoize the bookmark item object
  const bookmarkItem = useMemo(() => {
    if (!topic || !category) return null;
    return {
      id: topic.id,
      type: 'topic',
      categoryId: category.id,
      topicId: topic.id,
      title: topic.title,
      categoryTitle: category.title,
    };
  }, [topic, category]);

  // Memoize breadcrumbs items
  const breadcrumbsItems = useMemo(() => {
    if (!topic || !category) return [];
    return [
      { label: t('nav.handbooks', { defaultValue: 'Handbooks' }), to: '/handbooks' },
      { label: category.title, to: `/category/${category.id}` },
      { label: topic.title }
    ];
  }, [category, topic, t]);

  // Generate table of contents
  const tableOfContents = useMemo(() => {
    if (!topic) return [];
    const toc = [
      { id: "overview", title: "Overview", level: 2 },
      ...((topic.video || topic.content?.video) ? [{ id: "video", title: "Video Tutorial", level: 2 }] : []),
      ...(topic.content?.sections || []).map((section, i) => ({
        id: `section-${i}`,
        title: section.title,
        level: 2,
      })),
      { id: "resources", title: "Resources", level: 2 },
    ];
    return toc;
  }, [topic]);

  const handleFeedback = useCallback((helpful) => {
    setFeedbackSubmitted(true);
    // TODO: Send feedback to backend
  }, []);

  // Check for code blocks
  useEffect(() => {
    if (!topic?.content?.sections) return;
    const hasAnyCode = topic.content.sections.some(section => section.code);
    setHasCode(hasAnyCode);
  }, [topic]);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    if (!topic?.content?.sections) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Trigger when section is near top
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections including overview, video, and resources
    const sectionsToObserve = [
      'overview',
      ...(topic.video || topic.content?.video ? ['video'] : []),
      ...topic.content.sections.map((_, idx) => `section-${idx}`),
      'resources'
    ];

    sectionsToObserve.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [topic]);

  if (loadingTopic || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (topicError || !topic) {
    return (
      <ErrorState
        title={t('topicPage.errors.loadFailed', { defaultValue: 'Failed to load topic' })}
        description={topicError?.message || t('topicPage.errors.loadFailedDescription', { defaultValue: 'Unable to load topic content.' })}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Calculate estimated read time if not provided
  const estimatedReadTime = topic.readTime || "5 min";

  // Get last updated date
  const lastUpdated = topic.updatedAt || new Date().toLocaleDateString();

  // Generate topic URL (for SEO)
  const topicUrl = `/topic/${category.id}/${topic.id}`;

  // Get description from intro or description
  const seoDescription = topic.description || topic.content?.intro || `Learn about ${topic.title} in ${category.title}`;

  // Get dates for structured data
  const datePublished = topic.lastUpdated || new Date().toISOString();
  const dateModified = topic.lastUpdated || datePublished;

  return (
    <>
      <SEO
        title={topic.title}
        description={seoDescription}
        type="article"
        url={topicUrl}
        image={topic.content?.thumbnail || topic.content?.image || "/vite.svg"}
        author="Distill AI"
        datePublished={datePublished}
        dateModified={dateModified}
        keywords={[...(topic.tags || []), topic.difficulty, category.title, "AI", "Machine Learning", "Data Science"]}
      />
      {/* Reading Progress Bar */}
      <TopicProgressBar
        readingProgress={readingProgress}
        sidebarOffset={sidebarOffset}
        darkMode={darkMode}
      />

      <div className="relative min-h-screen bg-slate-950 pb-24 topic-content">
        {/* Dynamic gradient orbs */}
        <div
          className="pointer-events-none absolute -z-10 opacity-40 blur-3xl transition-all duration-700"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -z-10 opacity-30 blur-3xl transition-all duration-1000"
          style={{
            left: `${100 - mousePosition.x}%`,
            top: `${100 - mousePosition.y}%`,
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          {particles.map((particle, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-gradient-to-br ${particle.color}`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              }}
            />
          ))}
        </div>
        <Hero
          title={topic.title}
          subtitle={topic.description}
          children={
            <>
              <Breadcrumbs
                items={breadcrumbsItems}
                className="mb-4"
              />
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 shadow-sm ${topic.difficulty === "Expert"
                    ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:shadow-md"
                    : topic.difficulty === "Advanced"
                      ? "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:shadow-md"
                      : "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:shadow-md"
                    }`}
                >
                  {topic.difficulty}
                </span>
                <span className="text-xs text-gray-600 dark:text-slate-400 flex items-center gap-1.5 font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  <Clock size={14} className="text-indigo-500 dark:text-indigo-400 transition-transform hover:scale-110" /> {estimatedReadTime} read
                </span>
                <span className="text-xs text-gray-600 dark:text-slate-400 flex items-center gap-1.5 font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  <Calendar size={14} className="text-indigo-500 dark:text-indigo-400 transition-transform hover:scale-110" /> Updated {lastUpdated}
                </span>
              </div>
            </>
          }
          rightActions={
            <div className="flex flex-col gap-3 sm:gap-4 no-print w-full sm:w-auto">
              {/* First Row - Quiz and Complete Buttons */}
              {user && (
                <div className="flex items-stretch gap-2 sm:gap-3 w-full">
                  {topic.content?.quiz && topic.content.quiz.length > 0 && (
                    <button
                      onClick={handleTakeQuiz}
                      className="flex-1 flex items-center justify-center gap-2.5 h-[48px] sm:h-[52px] px-4 sm:px-6 py-3 text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl touch-manipulation transition-all duration-300 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] text-white rounded-xl"
                    >
                      <PlayCircle size={20} className="flex-shrink-0" />
                      <span>Take Quiz</span>
                    </button>
                  )}
                  <div className="flex-1 h-[48px] sm:h-[52px] [&>button]:w-full [&>button]:h-full [&>button]:min-h-[48px] sm:[&>button]:min-h-[52px]">
                    <MarkAsCompleteButton
                      categoryId={category.id}
                      topicId={topic.id}
                    />
                  </div>
                </div>
              )}

              {/* Second Row - Secondary Actions Group */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
                {/* User Actions */}
                {user && (
                  <div className="flex items-center gap-1.5 pr-1.5 sm:pr-2 border-r border-gray-200 dark:border-slate-700">
                    <BookmarkButton
                      item={bookmarkItem}
                    />
                  </div>
                )}

                {/* View Options */}
                {hasCode && (
                  <div className="flex items-center gap-1.5 pr-1.5 sm:pr-2 border-r border-gray-200 dark:border-slate-700">
                    <button
                      onClick={() => setHideCode(!hideCode)}
                      className={`min-w-[44px] min-h-[44px] p-2.5 rounded-lg border transition-all duration-300 shadow-sm hover:shadow-md touch-manipulation flex items-center justify-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${hideCode
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                        : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                        }`}
                      title={hideCode ? "Show code blocks" : "Hide code blocks"}
                      aria-label={hideCode ? "Show code blocks" : "Hide code blocks"}
                    >
                      {hideCode ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                )}

                {/* Export Actions */}
                <div className="flex items-center gap-1.5 pr-1.5 sm:pr-2 border-r border-gray-200 dark:border-slate-700">
                  <button
                    onClick={handlePrint}
                    className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md touch-manipulation flex items-center justify-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    title="Print"
                    aria-label="Print"
                  >
                    <Printer size={20} />
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md touch-manipulation flex items-center justify-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    title="Export to PDF"
                    aria-label="Export to PDF"
                  >
                    <FileText size={20} />
                  </button>
                </div>

                {/* Share Actions */}
                <ShareButtons
                  title={topic.title}
                  description={topic.description}
                />
              </div>
            </div>
          }
        />

        {/* Desktop: Flex layout with content left, sidebar right */}
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:justify-center">
            {/* Content Container */}
            <div className="flex-1 min-w-0 lg:max-w-5xl">
              {/* Main Content Area */}
              <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16" data-content-container>
              {/* Mobile TOC Dropdown */}
              <TopicTableOfContents
                tableOfContents={tableOfContents}
                activeSection={activeSection}
                isMobileOpen={isMobileTOCOpen}
                onMobileToggle={setIsMobileTOCOpen}
              />

              {/* Content Container - Expanded width for better reading */}
              <div className="w-full max-w-5xl">
                {/* Overview Section */}
                <main className="w-full max-w-5xl" ref={contentRef}>
                  <div className="mb-16 pt-2 scroll-mt-24 section-fade-in" id="overview">
                    {topic.content.prerequisites && (
                      <div className="mb-6">
                        <Prerequisites items={topic.content.prerequisites} />
                      </div>
                    )}
                    {topic.content.learningObjectives && (
                      <div className="mb-6">
                        <LearningObjectives objectives={topic.content.learningObjectives} />
                      </div>
                    )}
                    <p className="text-base text-slate-200 leading-relaxed mb-4">
                      {topic.content.intro}
                    </p>
                  </div>

                  {/* Video Section */}
                  {(topic.video || topic.content?.video) && (
                    <div className="mb-10 scroll-mt-24 section-fade-in" id="video">
                      <div className="mt-2 mb-4 pb-4 border-b-2 border-slate-800/50 transition-colors hover:border-indigo-600/60">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-200 leading-tight tracking-tight transition-colors hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:to-violet-400 flex items-center gap-3 group">
                          <div className="flex-shrink-0 relative transition-transform duration-500 group-hover:scale-110">
                            <div className="p-2.5 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/30 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:shadow-indigo-500/50">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all duration-500 blur-xl" />
                              <div className="relative"><Video size={24} className="text-white" /></div>
                            </div>
                          </div>
                          Topic Deep Dive
                        </h2>
                      </div>
                      <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-slate-700/60 bg-gray-900 group hover:shadow-xl hover:border-indigo-600/60 transition-all duration-300">
                        <iframe
                          className="w-full h-full"
                          src={topic.video || topic.content?.video}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Main Content Sections */}
                  {topic.content.sections.map((section, idx) => (
                    <div key={idx} id={`section-${idx}`} className="mb-10 scroll-mt-24 section-fade-in">
                      {/* Section Header */}
                      <div className="mt-2 mb-4 pb-4 border-b-2 border-slate-800/50 transition-colors hover:border-indigo-600/60">
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight transition-all duration-300 ${activeSection === idx ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 scale-[1.02]' : 'text-slate-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:to-violet-400'}`}>
                          {section.title}
                        </h2>
                      </div>

                      {/* Section Content */}
                      <div className="space-y-4">
                        {section.body && (
                          <div
                            className="text-base text-slate-200 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: section.body }}
                          />
                        )}
                        {section.bodyText && (
                          <p className="text-base text-slate-200 leading-relaxed mb-4">
                            {section.bodyText}
                          </p>
                        )}
                        {section.list && (
                          <ul className="space-y-3 list-disc list-outside ml-6 text-base text-slate-200 leading-relaxed">
                            {section.list.map((item, idx) => (
                              <li key={idx} className="pl-2">{item}</li>
                            ))}
                          </ul>
                        )}
                        {section.callout && (
                          <Callout type={section.callout.type} title={section.callout.title}>
                            {section.callout.content}
                          </Callout>
                        )}
                        {section.quote && (
                          <Quote
                            text={section.quote.text}
                            author={section.quote.author}
                            source={section.quote.source}
                          />
                        )}
                        {section.definition && (
                          <Definition
                            term={section.definition.term}
                            definition={section.definition.definition}
                            inline={section.definition.inline}
                          />
                        )}
                        {section.steps && (
                          <Steps
                            steps={section.steps.items}
                            title={section.steps.title}
                          />
                        )}
                        {section.checklist && (
                          <Checklist
                            items={section.checklist.items}
                            title={section.checklist.title}
                            persistKey={section.checklist.persistKey}
                          />
                        )}
                        {section.tabs && (
                          <Tabs
                            tabs={section.tabs}
                            defaultTab={section.tabs.defaultTab || 0}
                          />
                        )}
                        {section.equations && section.equations.map((eq, idx) => (
                          <MathEquation
                            key={idx}
                            equation={eq.equation}
                            display={eq.display || "block"}
                            label={eq.label}
                          />
                        ))}
                        {section.image && (
                          <div className="w-full max-w-full">
                            <LazyImage
                              src={section.image.src}
                              alt={section.image.alt || section.title}
                              caption={section.image.caption}
                            />
                          </div>
                        )}
                        {section.table && (
                          <Table
                            headers={section.table.headers}
                            data={section.table.data}
                          />
                        )}
                        {section.code && !hideCode && (
                          <div className="mt-6 mb-6">
                            <CodeBlock code={section.code} language={section.codeLanguage || "python"} />
                          </div>
                        )}
                        {section.code && hideCode && (
                          <div className="mt-6 mb-6 p-4 rounded-xl border border-slate-700 bg-slate-800/50 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                              <Code size={16} />
                              <span>Code block hidden</span>
                              <button
                                onClick={() => setHideCode(false)}
                                className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium underline"
                              >
                                Show code
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Section Divider */}
                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Resources Section */}
                  <div id="resources" className="mb-16 scroll-mt-24 section-fade-in">
                    <div className="mt-2 mb-6 pb-4 border-b-2 border-slate-800/50 transition-colors hover:border-indigo-600/60">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-200 flex items-center gap-3 leading-tight tracking-tight group">
                        <div className="flex-shrink-0 relative transition-transform duration-500 group-hover:scale-110">
                          <div className="p-2.5 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/30 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:shadow-indigo-500/50">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all duration-500 blur-xl" />
                            <div className="relative"><Layers size={24} className="text-white" /></div>
                          </div>
                        </div>
                        <span className="transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400">Curated Resources</span>
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 text-contrast transition-colors hover:text-indigo-400">
                          Seminal Papers
                        </h4>
                        {topic.content.resources.papers && topic.content.resources.papers.length > 0 ? (
                          topic.content.resources.papers.map((paper, i) => (
                            <div key={i} className="stagger-item" style={{ animationDelay: `${i * 0.05}s` }}>
                              <ResourceCard
                                type="paper"
                                title={paper.title}
                                subtitle={`${paper.authors} • ${paper.year}`}
                                link={paper.url}
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 italic empty-state-enhanced">No papers available</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 text-contrast transition-colors hover:text-indigo-400">
                          Repositories
                        </h4>
                        {topic.content.resources.repos && topic.content.resources.repos.length > 0 ? (
                          topic.content.resources.repos.map((repo, i) => (
                            <div key={i} className="stagger-item" style={{ animationDelay: `${i * 0.05}s` }}>
                              <ResourceCard
                                type="repo"
                                title={repo.title}
                                subtitle={`⭐ ${repo.stars} • ${repo.description}`}
                                link={repo.url}
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 italic empty-state-enhanced">No repositories available</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 text-contrast transition-colors hover:text-indigo-400">
                          Blog Posts
                        </h4>
                        {topic.content.resources.blogs && topic.content.resources.blogs.length > 0 ? (
                          topic.content.resources.blogs.map((blog, i) => (
                            <div key={i} className="stagger-item" style={{ animationDelay: `${i * 0.05}s` }}>
                              <ResourceCard
                                type="blog"
                                title={blog.title}
                                subtitle={blog.author ? `${blog.author} • ${blog.date || ''}` : blog.source || ''}
                                link={blog.url}
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 italic empty-state-enhanced">No blog posts available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section Divider */}
                  <div className="my-16 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* What Next? Section */}
                  <div className="mb-10 section-fade-in" id="whats-next">
                    <div className="mt-2 mb-6 pb-4 border-b-2 border-slate-800/50 transition-colors hover:border-indigo-600/60">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-200 leading-tight tracking-tight transition-colors hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:to-violet-400">
                        What's Next?
                      </h2>
                      <p className="text-base text-slate-400 leading-relaxed mt-2">
                        Continue your learning journey with related topics and resources.
                      </p>
                    </div>

                    {/* Related Topics Grid */}
                    <div className="mb-6">
                      <RelatedTopics
                        currentTopic={topic}
                        currentCategory={category}
                        category={category}
                        onSelectTopic={(topic) => navigate(`/topic/${category.id}/${topic.id}`)}
                      />
                    </div>

                    {/* Additional Resources Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group relative h-full">
                        <div className="relative h-full overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm hover:border-transparent cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                          {/* Animated gradient border on hover */}
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-[length:200%_200%] animate-gradient-shift p-[1px] -z-10">
                            <div className="h-full w-full rounded-2xl bg-slate-900/95" />
                          </div>
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                          {/* Enhanced shadow on hover */}
                          <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-indigo-500/0 group-hover:shadow-indigo-500/20 transition-all duration-300 pointer-events-none" />

                          {/* Content */}
                          <div className="relative z-10">
                            <h3 className="text-xl sm:text-2xl font-semibold text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300 mt-2 mb-2 flex items-center gap-3 leading-tight tracking-tight">
                              <div className="flex-shrink-0 relative transition-transform duration-500 group-hover:scale-110">
                                <div className="p-2.5 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/30 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:shadow-indigo-500/50">
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all duration-500 blur-xl" />
                                  <div className="relative"><ArrowRight size={20} className="text-white" /></div>
                                </div>
                              </div>
                              Explore More Topics
                            </h3>
                            <p className="text-base text-slate-400 leading-relaxed mb-4">
                              Discover related topics in this category to deepen your understanding.
                            </p>
                            <button
                              onClick={handleBackToCategory}
                              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                            >
                              View all topics <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {user && (
                        <div className="group relative h-full">
                          <div className="relative h-full overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm hover:border-transparent cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                            {/* Animated gradient border on hover */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-[length:200%_200%] animate-gradient-shift p-[1px] -z-10">
                              <div className="h-full w-full rounded-2xl bg-slate-900/95" />
                            </div>
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                            {/* Enhanced shadow on hover */}
                            <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-green-500/0 group-hover:shadow-green-500/20 transition-all duration-300 pointer-events-none" />

                            {/* Content */}
                            <div className="relative z-10">
                              <h3 className="text-xl sm:text-2xl font-semibold text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300 mt-2 mb-2 flex items-center gap-3 leading-tight tracking-tight">
                                <div className="flex-shrink-0 relative transition-transform duration-500 group-hover:scale-110">
                                  <div className="p-2.5 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/30 group-hover:from-green-600 group-hover:to-emerald-600 group-hover:shadow-green-500/50">
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-500 blur-xl" />
                                    <div className="relative"><PlayCircle size={20} className="text-white" /></div>
                                  </div>
                                </div>
                                Test Your Knowledge
                              </h3>
                              <p className="text-base text-slate-400 leading-relaxed mb-4">
                                {topic.content?.quiz && topic.content.quiz.length > 0
                                  ? "Take the quiz to reinforce what you've learned."
                                  : "Quiz coming soon for this topic."}
                              </p>
                              {topic.content?.quiz && topic.content.quiz.length > 0 ? (
                                <button
                                  onClick={handleTakeQuiz}
                                  className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors flex items-center gap-1.5"
                                >
                                  Take quiz <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                              ) : (
                                <span className="text-sm text-slate-500">Coming soon</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div id="feedback-section" className="group relative mb-16">
                    <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm hover:border-transparent transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]">
                      {/* Animated gradient border on hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-[length:200%_200%] animate-gradient-shift p-[1px] -z-10">
                        <div className="h-full w-full rounded-2xl bg-slate-900/95" />
                      </div>
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-200 mt-2 mb-2 leading-tight tracking-tight">
                          Was this helpful?
                        </h3>
                        <p className="text-base text-slate-400 leading-relaxed mb-6">
                          Your feedback helps us improve the content and make it more useful for everyone.
                        </p>
                        {!feedbackSubmitted ? (
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleFeedback(true)}
                              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 text-slate-300 hover:bg-green-900/30 hover:text-green-400 border border-slate-700/50 hover:border-green-700 transition-all shadow-sm hover:shadow-lg hover:shadow-green-500/20 hover:scale-105"
                            >
                              <ThumbsUp size={18} />
                              <span className="font-medium">Yes</span>
                            </button>
                            <button
                              onClick={() => handleFeedback(false)}
                              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 text-slate-300 hover:bg-red-900/30 hover:text-red-400 border border-slate-700/50 hover:border-red-700 transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/20 hover:scale-105"
                            >
                              <ThumbsDown size={18} />
                              <span className="font-medium">No</span>
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-green-900/20 border border-green-800">
                            <p className="text-sm text-green-400 font-medium">
                              Thank you for your feedback! We appreciate you taking the time to help us improve.
                            </p>
                          </div>
                        )}
                        <div className="mt-6">
                          <button
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1.5"
                            onClick={() => {
                              // TODO: Open feedback form or modal
                            }}
                          >
                            Suggest an improvement <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <TopicTableOfContents
              tableOfContents={tableOfContents}
              activeSection={activeSection}
            />
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      {user && (
        <CompletionDialog
          isOpen={showCompletionDialog}
          onClose={() => setShowCompletionDialog(false)}
          categoryId={category.id}
          topicId={topic.id}
          topicTitle={topic.title}
          onComplete={() => {
            // Invalidate completion query to refresh status
            queryClient.invalidateQueries({ queryKey: ["topic-completion", user?.id, category?.id, topic?.id] });
          }}
        />
      )}
    </>
  );
};

export default TopicView;
