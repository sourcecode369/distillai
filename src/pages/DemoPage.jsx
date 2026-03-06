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

const NetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = [
      [99, 102, 241],
      [139, 92, 246],
      [79, 70, 229],
      [167, 139, 250],
    ];

    const spawnParticle = (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 0.8 + Math.random() * 1.8,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: 0.3 + Math.random() * 0.5,
      // lifecycle: life goes 0→1→0, fadeSpeed varies per particle
      life: Math.random(),         // start at random phase
      lifeDir: Math.random() > 0.5 ? 1 : -1,
      fadeSpeed: 0.008 + Math.random() * 0.014,
    });

    const pts = Array.from({ length: 70 }, () =>
      spawnParticle(canvas.width, canvas.height)
    );

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach(p => {
        // update lifecycle
        p.life += p.lifeDir * p.fadeSpeed;
        if (p.life >= 1) { p.life = 1; p.lifeDir = -1; }
        if (p.life <= 0) {
          // respawn at new position
          Object.assign(p, spawnParticle(canvas.width, canvas.height));
          p.life = 0;
          p.lifeDir = 1;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 155) {
            const t = 1 - d / 155;
            // connection alpha factors in both endpoints' life
            const connAlpha = t * 0.2 * pts[i].life * pts[j].life;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${connAlpha})`;
            ctx.lineWidth = t * 0.7;
            ctx.stroke();
          }
        }
      }

      pts.forEach(p => {
        const alpha = p.a * p.life;
        if (alpha < 0.01) return;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grd.addColorStop(0, `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, ${alpha * 0.45})`);
        grd.addColorStop(1, `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, ${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

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
            entry.target.querySelectorAll(".hiw-card").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 160);
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
          {/* Network particles — hero only */}
          <NetworkCanvas />

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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/handbooks')}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute inset-0 -translate-x-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)', animation: 'btnShimmer 3.5s ease-in-out 1.5s infinite' }} />
                  <BookOpen size={18} className="relative" />
                  <span className="relative">Start Learning — It&apos;s Free</span>
                  <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gray-700/60 bg-gray-900/60 px-8 py-4 text-base font-semibold text-gray-300 backdrop-blur-sm hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-gray-900/80 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>

            </div>
          </div>

        </section>

        <style>{`
          @keyframes btnShimmer {
            0% { transform: translateX(-100%); }
            35%, 100% { transform: translateX(220%); }
          }
          @keyframes scrollBounce {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(6px); opacity: 1; }
          }
          @keyframes proBorderShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .reviews-scroll { animation: reviewsScroll 40s linear infinite; will-change: transform; }
          .reviews-marquee:hover .reviews-scroll { animation-play-state: paused; }
        `}</style>

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
              <div className="relative">
                {/* Background radial glow behind the marquee */}
                <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center" aria-hidden="true">
                  <div className="w-[600px] h-[200px] rounded-full bg-indigo-600/10 blur-[80px]" />
                </div>

                <div
                  className="relative overflow-hidden space-y-3 py-2"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                  }}
                >
                  {[
                    { fields: AI_FIELDS.slice(0, 7),   dir: 'left',  speed: '28s', depth: 0 },
                    { fields: AI_FIELDS.slice(7, 14),  dir: 'right', speed: '34s', depth: 1 },
                    { fields: AI_FIELDS.slice(13, 20), dir: 'left',  speed: '25s', depth: 2 },
                  ].map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="flex gap-3 w-max"
                      style={{
                        animation: `${row.dir === 'left' ? 'marquee' : 'marquee-reverse'} ${row.speed} linear infinite`,
                        willChange: 'transform',
                        opacity: 1 - row.depth * 0.22,
                        filter: row.depth > 0 ? `blur(${row.depth * 0.4}px)` : 'none',
                      }}
                    >
                      {[...row.fields, ...row.fields, ...row.fields].map(({ label, Icon }, i) => (
                        <button
                          key={i}
                          onClick={() => navigate('/handbooks')}
                          className="group flex-shrink-0 flex items-center gap-3 rounded-2xl border border-gray-700/40 bg-gray-900/70 px-5 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/70 hover:bg-indigo-950/60 hover:shadow-xl hover:shadow-indigo-500/15 hover:scale-[1.04] active:scale-[0.97] relative overflow-hidden"
                        >
                          {/* Shine sweep on hover */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                          {/* Icon with gradient bg */}
                          <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-indigo-400 border border-indigo-500/20 transition-all duration-300 group-hover:from-indigo-500/30 group-hover:to-violet-500/20 group-hover:text-indigo-300 group-hover:border-indigo-400/40 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                            <Icon size={15} strokeWidth={2} />
                          </div>

                          <span className="whitespace-nowrap text-sm font-semibold text-gray-400 group-hover:text-indigo-200 transition-colors duration-300">
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

        {/* ── HOW TO GET STARTED ── */}
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
                    How to Get Started
                  </span>
                </div>
                <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-extrabold tracking-tight text-3xl text-transparent md:text-4xl mt-2">
                  The endless stream of tutorials <em className="not-italic text-indigo-300">stops here.</em>
                </h2>
                <p className="mt-4 text-lg text-indigo-200/65 max-w-xl mx-auto">
                  Three steps to go from scattered learner to confident AI engineer.
                </p>
              </div>

              {/* Steps */}
              <div ref={hiwSectionRef} className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    num: "1",
                    title: "Find your path",
                    desc: "Browse 20 AI specializations — from Core ML and Deep Learning to MLOps and Trustworthy AI. Start wherever you are.",
                  },
                  {
                    num: "2",
                    title: "Start learning",
                    desc: "Skip the tutorials. Read expert-written handbooks with code-level explanations, structured from first principles to production.",
                  },
                  {
                    num: "3",
                    title: "Prove what you know",
                    desc: "Every handbook ends with a quiz. Track your progress, earn certificates, and know exactly where to go deeper.",
                  },
                ].map(({ num, title, desc }, i) => (
                  <div
                    key={i}
                    className="hiw-card group relative flex flex-col items-center text-center rounded-2xl border border-gray-800/60 bg-gray-900/50 p-8 backdrop-blur-sm hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-gray-900/70 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.1),0_16px_40px_rgba(99,102,241,0.08)] transition-all duration-300"
                  >
                    {/* Subtle top glow line */}
                    <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

                    {/* Number circle */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xl font-extrabold shadow-lg shadow-indigo-500/30 mb-6 group-hover:scale-105 group-hover:shadow-indigo-500/50 transition-all duration-300">
                      {num}
                    </div>

                    <h3 className="font-bold text-xl text-gray-100 mb-3 leading-snug">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors duration-300">{desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="relative">
          <div className="pointer-events-none absolute bottom-0 right-0 -z-10 opacity-25" aria-hidden="true">
            <img className="max-w-none" src="/images/blurred-shape.svg" width={760} height={668} alt="" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>

              {/* Header */}
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                  <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent text-sm font-medium">
                    Reviews
                  </span>
                </div>
                <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-extrabold tracking-tight text-3xl text-transparent md:text-4xl mt-2">
                  Join engineers already on the fast-track
                </h2>
                <p className="mt-4 text-lg text-indigo-200/65 max-w-xl mx-auto">
                  Don&apos;t take our word for it — here&apos;s what engineers building with AI have to say.
                </p>
              </div>

              {/* Marquee container */}
              <div
                className="reviews-marquee relative overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                }}
              >
                {(() => {
                  const reviews = [
                    {
                      initials: "SC",
                      name: "Sarah Chen",
                      role: "ML Engineer",
                      stars: 5,
                      text: "Finally a single resource that covers everything from core ML to MLOps. The handbooks are incredibly well structured and I landed my dream role within 2 months.",
                      color: "from-indigo-500 to-violet-600",
                    },
                    {
                      initials: "MR",
                      name: "Marcus Rodriguez",
                      role: "Data Scientist",
                      stars: 5,
                      text: "I've tried dozens of tutorials but nothing compares to the depth here. The structure is logical, the examples are real-world, and the quizzes keep you honest. Passed my ML interview in 3 weeks.",
                      color: "from-violet-500 to-purple-600",
                    },
                    {
                      initials: "PS",
                      name: "Priya Sharma",
                      role: "AI Research Intern",
                      stars: 5,
                      text: "If you're motivated and have a real goal in mind, go for it. You don't need to be an expert to start. For me, it's been one of the most valuable learning experiences I've had.",
                      color: "from-indigo-400 to-blue-600",
                    },
                    {
                      initials: "JK",
                      name: "James Kim",
                      role: "Software Engineer",
                      stars: 4,
                      text: "Instead of searching YouTube for hours, this provides all the necessary resources right here. If you're considering starting, it's completely worth it.",
                      color: "from-violet-500 to-indigo-600",
                    },
                    {
                      initials: "AL",
                      name: "Aisha Lawson",
                      role: "AI Product Manager",
                      stars: 5,
                      text: "The breadth is unreal — 20 specializations in one place. I use it to stay current with ML trends and prep for technical discussions with my engineering team.",
                      color: "from-indigo-500 to-blue-500",
                    },
                    {
                      initials: "TN",
                      name: "Tom Nguyen",
                      role: "Backend Engineer",
                      stars: 5,
                      text: "Transitioned into ML from backend in 4 months. The structured handbooks made it feel achievable instead of overwhelming. Quizzes are brutally effective.",
                      color: "from-purple-500 to-violet-600",
                    },
                  ];
                  const tripled = [...reviews, ...reviews, ...reviews];
                  return (
                    <div className="reviews-scroll flex gap-4 w-max">
                      {tripled.map(({ initials, name, role, stars, text, color }, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 w-72 flex flex-col rounded-2xl border border-gray-800/60 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-indigo-500/25 hover:bg-gray-900/70 transition-all duration-300"
                        >
                          {/* Avatar */}
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white text-sm font-bold mb-4 shadow-lg`}>
                            {initials}
                          </div>

                          {/* Stars */}
                          <div className="flex gap-0.5 mb-4">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <svg key={si} className={`w-4 h-4 ${si < stars ? 'text-amber-400' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>

                          {/* Review text */}
                          <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-6">{text}</p>

                          {/* Author */}
                          <div className="border-t border-gray-800/60 pt-4">
                            <div className="font-semibold text-sm text-gray-200">{name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                <style>{`
                  @keyframes reviewsScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                  }
                `}</style>
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
                <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-extrabold tracking-tight text-3xl text-transparent md:text-4xl mt-2 mb-3">
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
                    className="w-full rounded-full border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 mb-7"
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
                <div className="relative flex flex-col rounded-2xl shadow-2xl shadow-indigo-500/30 lg:-mt-4" style={{ padding: '1px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa, #6366f1)', backgroundSize: '300% 300%', animation: 'proBorderShift 4s ease infinite' }}>
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
                      className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mb-7"
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
                    className="w-full rounded-full border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 mb-7"
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

              <div className="mx-auto grid max-w-sm gap-5 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((b, i) => (
                  <article
                    key={i}
                    className="group relative flex flex-col rounded-2xl border border-gray-800/60 bg-gray-900/50 p-6 backdrop-blur-sm hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-gray-900/70 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.08),0_12px_32px_rgba(99,102,241,0.07)] transition-all duration-300 cursor-default"
                  >
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/20 text-indigo-400 mb-4 group-hover:from-indigo-500/30 group-hover:border-indigo-400/35 group-hover:text-indigo-300 group-hover:shadow-lg group-hover:shadow-indigo-500/15 transition-all duration-300">
                      {b.icon}
                    </div>
                    <h3 className="font-bold text-base text-gray-200 mb-2 group-hover:text-white transition-colors duration-300">{b.title}</h3>
                    <p className="text-sm text-indigo-200/60 leading-relaxed group-hover:text-indigo-200/75 transition-colors duration-300">{b.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>
              <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/70 via-gray-900/80 to-violet-950/50 p-12 md:p-16 text-center overflow-hidden backdrop-blur-sm shadow-2xl shadow-indigo-500/10">
                {/* Inner glow orbs */}
                <div className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 opacity-35" aria-hidden="true">
                  <div className="h-72 w-72 rounded-full bg-indigo-600 blur-[80px]" />
                </div>
                <div className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 opacity-25" aria-hidden="true">
                  <div className="h-72 w-72 rounded-full bg-violet-600 blur-[80px]" />
                </div>
                {/* Top glow line */}
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

                <div className="relative">
                  <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50 mb-2">
                    <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent text-sm font-medium">Get Started</span>
                  </div>
                  <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-extrabold tracking-tight text-3xl md:text-4xl text-transparent mb-4">
                    Ready to start your AI journey?
                  </h2>
                  <p className="text-lg text-indigo-200/65 max-w-xl mx-auto mb-8">
                    Join engineers mastering AI & ML with 150+ structured handbooks across 20 specializations.
                  </p>
                  <button
                    onClick={() => navigate('/handbooks')}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <BookOpen size={18} className="relative" />
                    <span className="relative">Browse All Handbooks</span>
                    <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DemoPage;
