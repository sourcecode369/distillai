import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Rocket,
  Target,
  Code2,
  Brain,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  User,
  GraduationCap,
  Cpu,
  Database,
  BarChart2,
  Terminal,
  Cloud,
  Activity,
  Zap,
  Bot,
  GitBranch,
  MonitorCheck,
  Layers,
  Shield,
  Wrench,
  FlaskConical,
} from "lucide-react";
import SEO from "../components/SEO";

const AI_FIELDS = [
  { label: "Core AI & ML",          Icon: Brain        },
  { label: "Deep Learning",          Icon: Cpu          },
  { label: "ML Libraries",           Icon: Layers       },
  { label: "Data Processing",        Icon: Database     },
  { label: "Data Visualization",     Icon: BarChart2    },
  { label: "Programming Languages",  Icon: Terminal     },
  { label: "Cloud ML Platforms",     Icon: Cloud        },
  { label: "MLOps & Deployment",     Icon: GitBranch    },
  { label: "Model Monitoring",       Icon: Activity     },
  { label: "Optimization",           Icon: Zap          },
  { label: "AutoML Platforms",       Icon: Bot          },
  { label: "Autonomous Systems",     Icon: Rocket       },
  { label: "Distributed Training",   Icon: MonitorCheck },
  { label: "Dev Environments",       Icon: Code2        },
  { label: "Domain-Specific AI",     Icon: Target       },
  { label: "Data Types",             Icon: Database     },
  { label: "Advanced Algorithms",    Icon: TrendingUp   },
  { label: "Tools & Technologies",   Icon: Wrench       },
  { label: "Trustworthy AI",         Icon: Shield       },
  { label: "Advanced Frameworks",    Icon: FlaskConical },
];

const DemoPage = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const hiwSectionRef = useRef(null);

  useEffect(() => {
    const section = hiwSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".hiw-line, .hiw-dot").forEach((el) => el.classList.add("visible"));
            entry.target.querySelectorAll(".hiw-card").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 180);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      text: "Finally a single resource that covers everything from core ML to MLOps. The handbooks are incredibly well structured.",
      name: "Sarah Chen",
      role: "Machine Learning Engineer",
    },
    {
      text: "I've tried dozens of tutorials but nothing compares to the depth here. Passed my ML interview in 3 weeks.",
      name: "Marcus Rodriguez",
      role: "Data Scientist",
    },
    {
      text: "The multi-language support is incredible. I can switch between English and Spanish mid-learning.",
      name: "Priya Sharma",
      role: "AI Research Intern",
    },
  ];

  const benefits = [
    {
      icon: <Target size={24} strokeWidth={2} />,
      title: "Structured Learning",
      description: "Every handbook follows a clear progression — from concept to application, no fluff.",
    },
    {
      icon: <Code2 size={24} strokeWidth={2} />,
      title: "Practical & Applied",
      description: "Real-world examples and code-level explanations for every concept.",
    },
    {
      icon: <Brain size={24} strokeWidth={2} />,
      title: "Full AI Landscape",
      description: "20 specializations covering every corner of modern AI & ML.",
    },
    {
      icon: <TrendingUp size={24} strokeWidth={2} />,
      title: "Always Up to Date",
      description: "Content is continuously updated to reflect the latest models, tools, and research.",
    },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Master AI & ML without the overwhelm. 150+ expert-curated handbooks across 20 AI specializations — from core ML to MLOps, in 6 languages. Free to start."
        url="/"
      />

      <div className="relative min-h-screen overflow-hidden bg-gray-950">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute left-1/4 top-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
          <div className="absolute right-1/4 top-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/8 blur-[100px]" />
        </div>

        {/* Background illustration */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/4 opacity-60" aria-hidden="true">
          <img className="max-w-none" src="/images/page-illustration.svg" width={846} height={594} alt="" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[440px] -z-10 -translate-x-1/3 opacity-40" aria-hidden="true">
          <img className="max-w-none" src="/images/blurred-shape.svg" width={760} height={668} alt="" />
        </div>

        {/* ── HERO ── */}
        <section className="relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="pt-16 pb-12 md:pt-24 md:pb-16 text-center">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm mb-8 shadow-lg shadow-indigo-500/10">
                <Sparkles size={13} className="text-indigo-400" />
                <span>150+ Expert-Curated AI Handbooks</span>
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              </div>

              {/* Headline */}
              <h1 className="mx-auto max-w-4xl font-extrabold tracking-tight mb-6">
                <span className="block text-5xl md:text-7xl text-gray-100 leading-[1.05]">
                  The AI learning hub
                </span>
                <span className="block text-5xl md:text-7xl leading-[1.15] pb-2 animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.indigo.400),theme(colors.violet.400),theme(colors.indigo.300),theme(colors.violet.300),theme(colors.indigo.400))] bg-[length:200%_auto] bg-clip-text text-transparent">
                  built for engineers.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                Stop piecing together scattered tutorials. Go from ML fundamentals to production MLOps
                with structured handbooks across every major AI specialization.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                  onClick={() => navigate('/handbooks')}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <BookOpen size={18} />
                  <span className="relative">Start Learning — It&apos;s Free</span>
                  <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700/60 bg-gray-900/60 px-8 py-4 text-base font-semibold text-gray-300 backdrop-blur-sm hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-gray-900/80 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>

              {/* Stat bar */}
              <div className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-gray-800/60 bg-gray-900/40 backdrop-blur-sm px-8 py-4 text-sm">
                {[
                  { value: "150+", label: "Handbooks" },
                  { value: "20",   label: "AI Fields"  },
                  { value: "150+", label: "Quizzes"    },
                  { value: "Free", label: "Forever"    },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <span className="hidden sm:block h-4 w-px bg-gray-700" />}
                    <span className="font-extrabold text-xl text-gray-100">{s.value}</span>
                    <span className="text-gray-500 font-medium">{s.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── WHAT'S COVERED ── */}
        <section className="relative">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2" aria-hidden="true">
            <img className="max-w-none" src="/images/blurred-shape-gray.svg" width={760} height={668} alt="" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>
              {/* Header */}
              <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
                <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                  <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                    20 Specializations
                  </span>
                </div>
                <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-extrabold text-3xl text-transparent md:text-4xl">
                  The full AI & ML landscape, covered
                </h2>
                <p className="text-lg text-indigo-200/65">
                  Every major field in artificial intelligence and machine learning — from first principles to production-ready deployment.
                </p>
              </div>

              {/* Marquee rows */}
              <div
                className="relative overflow-hidden space-y-3 py-1"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                }}
              >
                {[
                  { fields: AI_FIELDS.slice(0, 7),   dir: 'left',  speed: '28s' },
                  { fields: AI_FIELDS.slice(7, 14),  dir: 'right', speed: '34s' },
                  { fields: AI_FIELDS.slice(13, 20), dir: 'left',  speed: '25s' },
                ].map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex gap-3 w-max"
                    style={{
                      animation: `${row.dir === 'left' ? 'marquee' : 'marquee-reverse'} ${row.speed} linear infinite`,
                    }}
                  >
                    {[...row.fields, ...row.fields, ...row.fields].map(({ label, Icon }, i) => (
                      <button
                        key={i}
                        onClick={() => navigate('/handbooks')}
                        className="group flex-shrink-0 flex items-center gap-3 rounded-2xl border border-gray-700/50 bg-gray-900/60 px-5 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/60 hover:bg-indigo-950/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.03] active:scale-[0.97]"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
                          <Icon size={15} strokeWidth={2} />
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium text-gray-300 group-hover:text-indigo-200 transition-colors duration-300">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}

                <style>{`
                  @keyframes marquee         { 0%{transform:translateX(0)}    100%{transform:translateX(-33.33%)} }
                  @keyframes marquee-reverse { 0%{transform:translateX(-33.33%)} 100%{transform:translateX(0)} }
                `}</style>
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => navigate('/handbooks')}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Browse all 150+ handbooks
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="relative">
          <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 -translate-x-[40%] -z-10 opacity-30" aria-hidden="true">
            <img className="max-w-none" src="/images/blurred-shape.svg" width={760} height={668} alt="" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>

              {/* Header */}
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                  <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent text-sm font-medium">
                    How It Works
                  </span>
                </div>
                <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-extrabold text-3xl text-transparent md:text-4xl mt-2">
                  From zero to production-ready
                </h2>
                <p className="mt-4 text-lg text-indigo-200/65 max-w-xl mx-auto">
                  Three simple steps. No scattered tutorials, no guesswork.
                </p>
              </div>

              {/* Steps */}
              <div ref={hiwSectionRef} className="relative grid gap-6 md:grid-cols-3 mb-16">

                {/* Connector: dim base + bright glow overlay + traveling dot */}
                <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)]" style={{ height: "1px" }}>
                  <div className="hiw-line absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-violet-500/15 to-indigo-500/15 origin-left" />
                  <div className="hiw-line absolute inset-0 bg-gradient-to-r from-indigo-500/50 via-violet-400/70 to-indigo-500/50 origin-left blur-[1px]" style={{ transitionDelay: "0.05s" }} />
                  <div className="hiw-dot absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-indigo-400 shadow-[0_0_10px_3px_rgba(99,102,241,0.7),0_0_20px_6px_rgba(139,92,246,0.4)]" />
                </div>

                {[
                  { step: "01", Icon: Brain,        title: "Pick your specialization", desc: "Browse 20 AI fields — from Core ML and Deep Learning to MLOps and Trustworthy AI. Start wherever you are.", tag: "20 fields covered" },
                  { step: "02", Icon: BookOpen,      title: "Read the handbook",         desc: "Expert-written, code-level guides. Each handbook breaks a complex topic down into clear, structured sections.", tag: "150+ handbooks" },
                  { step: "03", Icon: GraduationCap, title: "Test what you know",         desc: "Every topic ends with a quiz to reinforce your understanding and flag gaps before you move on.",              tag: "Per-topic quizzes" },
                ].map(({ step, Icon, title, desc, tag }, i) => (
                  <div key={i} className="hiw-card group relative flex flex-col rounded-2xl border border-gray-800/60 bg-gray-900/50 p-8 overflow-hidden hover:border-indigo-500/30 cursor-default">

                    {/* Ambient radial glow — fades in on .visible */}
                    <div className="hiw-ambient pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-indigo-600/12 blur-2xl" />

                    {/* Top accent line — scaleX reveal */}
                    <div className="hiw-accent absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent origin-left" />

                    {/* Decorative step number */}
                    <div className="hiw-step-num mb-6 text-6xl font-black leading-none select-none tabular-nums bg-gradient-to-br from-indigo-400/50 to-violet-500/30 bg-clip-text text-transparent">
                      {step}
                    </div>

                    {/* Icon */}
                    <div className="hiw-icon mb-5 flex h-13 w-13 items-center justify-center rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-600/20 to-violet-600/10 text-indigo-400 group-hover:text-indigo-300 group-hover:border-indigo-400/40 transition-colors duration-300" style={{ width: 52, height: 52 }}>
                      <Icon size={22} strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="hiw-content flex flex-col flex-1">
                      <h3 className="font-bold text-[17px] text-gray-100 mb-2 leading-snug">{title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1">{desc}</p>
                      <div className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1 text-xs font-semibold text-indigo-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        {tag}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="grid gap-5 md:grid-cols-3">
                {testimonials.map((t, i) => (
                  <div key={i} className="rounded-2xl border border-gray-800/60 bg-gray-900/40 p-6 backdrop-blur-sm">
                    <p className="text-sm text-gray-400 leading-relaxed italic mb-5">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
                        <User size={14} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-200">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="relative">
          <div className="pointer-events-none absolute top-0 right-1/2 translate-x-[120%] -z-10 opacity-40" aria-hidden="true">
            <img className="max-w-none" src="/images/blurred-shape.svg" width={760} height={668} alt="" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>

              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                  <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent text-sm font-medium">Pricing</span>
                </div>
                <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-extrabold text-3xl text-transparent md:text-4xl mt-2 mb-3">
                  Start free. Go deeper when you&apos;re ready.
                </h2>
                <p className="text-gray-500 text-sm mb-8">No credit card required · Cancel anytime · Downgrade anytime</p>

                {/* Billing toggle */}
                <div className="inline-flex items-center gap-3 rounded-full border border-gray-800 bg-gray-900/60 p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${!isAnnual ? 'bg-gray-800 text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isAnnual ? 'bg-gray-800 text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Annual
                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-1.5 py-0.5">-20%</span>
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="grid gap-5 lg:grid-cols-3 lg:items-start">

                {/* Free */}
                <div className="flex flex-col rounded-2xl border border-gray-800/70 bg-gray-900/50 p-7 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Free</span>
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-5xl font-extrabold text-gray-100 tracking-tight">$0</span>
                      <span className="text-gray-500 mb-1.5 text-sm">/month</span>
                    </div>
                    <p className="text-sm text-gray-500">Perfect for exploring</p>
                  </div>

                  <button
                    onClick={() => navigate('/handbooks')}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 mb-7"
                  >
                    Get Started Free
                  </button>

                  <div className="space-y-3 flex-1">
                    {[
                      { text: "60% content access", sub: "90 topics" },
                      { text: "5 quizzes per month",  sub: null },
                      { text: "50 bookmarks",          sub: null },
                      { text: "Basic analytics",       sub: null },
                      { text: "Community support",     sub: null },
                    ].map(({ text, sub }) => (
                      <div key={text} className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-400">{text}{sub && <span className="text-gray-600 ml-1">— {sub}</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro — featured */}
                <div className="relative flex flex-col rounded-2xl p-px bg-gradient-to-b from-indigo-500/60 via-violet-500/40 to-indigo-500/20 shadow-2xl shadow-indigo-500/20 lg:-mt-4">
                  <div className="flex flex-col h-full rounded-[15px] bg-gray-950 p-7">
                    {/* Badge */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/40">
                        <Sparkles size={11} /> Most Popular
                      </span>
                    </div>

                    <div className="mb-6 mt-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">Pro</span>
                      <div className="flex items-end gap-1.5 mb-1">
                        <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                          ${isAnnual ? '23' : '29'}
                        </span>
                        <span className="text-gray-500 mb-1.5 text-sm">/month</span>
                      </div>
                      {isAnnual
                        ? <p className="text-xs text-green-400 font-medium">$276 billed annually — save $72</p>
                        : <p className="text-xs text-gray-500">$348 billed annually</p>
                      }
                    </div>

                    <button
                      onClick={() => navigate('/handbooks')}
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mb-7"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      Start Free Trial
                    </button>

                    <div className="space-y-3 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400/70 mb-4">Everything in Free, plus:</p>
                      {[
                        { text: "Full content access", sub: "150+ topics" },
                        { text: "Unlimited quizzes",   sub: null },
                        { text: "PDF certificates",    sub: "LinkedIn ready" },
                        { text: "Unlimited bookmarks", sub: null },
                        { text: "Advanced analytics",  sub: null },
                        { text: "Priority support",    sub: null },
                      ].map(({ text, sub }) => (
                        <div key={text} className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                          </div>
                          <span className="text-sm text-gray-300">{text}{sub && <span className="text-gray-500 ml-1">— {sub}</span>}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enterprise */}
                <div className="flex flex-col rounded-2xl border border-gray-800/70 bg-gray-900/50 p-7 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Enterprise</span>
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-5xl font-extrabold text-gray-100 tracking-tight">Custom</span>
                    </div>
                    <p className="text-sm text-gray-500">For teams & organizations</p>
                  </div>

                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 mb-7"
                  >
                    Contact Sales
                  </button>

                  <div className="space-y-3 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-4">Everything in Pro, plus:</p>
                    {[
                      { text: "Custom content",          sub: "your curriculum" },
                      { text: "Branded certificates",    sub: null },
                      { text: "Team bookmarks",          sub: null },
                      { text: "API access",              sub: null },
                      { text: "Team dashboard",          sub: null },
                      { text: "SSO / SAML",              sub: null },
                      { text: "Dedicated manager",       sub: "99.9% SLA" },
                    ].map(({ text, sub }) => (
                      <div key={text} className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-400">{text}{sub && <span className="text-gray-600 ml-1">— {sub}</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="relative">
          <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50" aria-hidden="true">
            <img className="max-w-none" src="/images/blurred-shape.svg" width={760} height={668} alt="" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>
              <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
                <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                  <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">Why Distill AI</span>
                </div>
                <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-extrabold text-3xl text-transparent md:text-4xl">
                  Built for how engineers actually learn
                </h2>
              </div>

              <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:grid-cols-4">
                {benefits.map((b, i) => (
                  <article key={i} className="group cursor-default">
                    <div className="mb-3 text-indigo-500 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-400">{b.icon}</div>
                    <h3 className="mb-1 font-semibold text-base text-gray-200 group-hover:text-white transition-colors duration-300">{b.title}</h3>
                    <p className="text-sm text-indigo-200/65 group-hover:text-indigo-200/80 transition-colors duration-300">{b.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden bg-slate-900 py-8 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-48 top-1/2 -translate-y-1/2 opacity-60" aria-hidden="true">
            <div className="h-96 w-96 rounded-full bg-indigo-500 blur-[120px]" />
          </div>
          <div className="pointer-events-none absolute -right-48 top-1/2 -translate-y-1/2 opacity-60" aria-hidden="true">
            <div className="h-96 w-96 rounded-full bg-violet-500 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-4 font-extrabold text-3xl text-gray-200 md:text-4xl">
              Ready to start your AI journey?
            </h2>
            <p className="mb-8 text-lg text-indigo-200/65">
              Join learners mastering AI & ML with 150+ structured handbooks across 20 specializations.
            </p>
            <button
              onClick={() => navigate('/handbooks')}
              className="group bg-gradient-to-t from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16)] inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all px-6 py-3"
            >
              <span className="relative inline-flex items-center">
                Browse All Handbooks
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default DemoPage;
