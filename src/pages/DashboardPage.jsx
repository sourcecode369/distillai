import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, ArrowRight, Bookmark, Search, TrendingUp,
  Brain, Cpu, Database, GitBranch, Cloud, Layers,
  User, ChevronRight, Bell, History, Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import SEO from "../components/SEO";

// Color palette for category cards — cycles by index
const CAT_COLORS = [
  { gradient: "from-indigo-500/20 to-violet-500/10", border: "border-indigo-500/30", icon: "text-indigo-400", badge: "bg-indigo-500/10 text-indigo-400", accent: "bg-indigo-500" },
  { gradient: "from-violet-500/20 to-purple-500/10", border: "border-violet-500/30", icon: "text-violet-400", badge: "bg-violet-500/10 text-violet-400", accent: "bg-violet-500" },
  { gradient: "from-cyan-500/15 to-blue-500/10",    border: "border-cyan-500/25",   icon: "text-cyan-400",   badge: "bg-cyan-500/10 text-cyan-400",   accent: "bg-cyan-500"   },
  { gradient: "from-emerald-500/15 to-green-500/10",border: "border-emerald-500/25",icon: "text-emerald-400",badge: "bg-emerald-500/10 text-emerald-400", accent: "bg-emerald-500" },
  { gradient: "from-orange-500/15 to-amber-500/10", border: "border-orange-500/25", icon: "text-orange-400", badge: "bg-orange-500/10 text-orange-400", accent: "bg-orange-500" },
];

// Default field icons for category cards
const FIELD_ICONS = { Brain, Cpu, Database, GitBranch, Cloud, Layers };
const FIELD_ICON_KEYS = Object.keys(FIELD_ICONS);

// Popular fields for new users with no history
const SUGGESTED_FIELDS = [
  { title: "Core AI & ML",        desc: "Foundations of machine learning and AI systems",       iconKey: "Brain"   },
  { title: "Deep Learning",       desc: "Neural networks, transformers, and modern architectures", iconKey: "Cpu"    },
  { title: "MLOps & Deployment",  desc: "Take models from notebook to production reliably",     iconKey: "GitBranch" },
  { title: "Data Processing",     desc: "Pipelines, feature engineering, and data quality",     iconKey: "Database" },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const getSubtext = (hasHistory, count) => {
  if (!hasHistory) return "Your AI learning journey starts here.";
  if (count >= 20) return "You're on a roll. Keep pushing forward.";
  if (count >= 10) return "Great progress. Keep the momentum going.";
  if (count >= 5)  return "You're getting started. Pick up where you left off.";
  return "Keep the momentum going.";
};

const formatRelativeTime = (ts) => {
  if (!ts) return "";
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Card accent colors for Continue Reading (cycles by index)
const CARD_ACCENTS = [
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-green-500",
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { readingHistory, bookmarks } = useApp();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0]
    || user?.email?.split("@")[0]
    || "there";

  // Deduplicated recent history (max 3 for Continue Reading)
  const recentHistory = useMemo(() => {
    const seen = new Map();
    (readingHistory || []).forEach((item) => {
      if (item?.id && !seen.has(item.id)) seen.set(item.id, item);
    });
    return Array.from(seen.values()).slice(0, 3);
  }, [readingHistory]);

  // Derive interest categories from reading history
  const interestCategories = useMemo(() => {
    const cats = new Map();
    (readingHistory || []).forEach((item) => {
      if (!item?.categoryTitle) return;
      if (cats.has(item.categoryTitle)) {
        cats.get(item.categoryTitle).count++;
      } else {
        cats.set(item.categoryTitle, {
          title: item.categoryTitle,
          categoryId: item.categoryId,
          count: 1,
        });
      }
    });
    return Array.from(cats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [readingHistory]);

  const recentBookmarks = useMemo(() =>
    [...(bookmarks || [])]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 5),
    [bookmarks]
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const hasHistory = recentHistory.length > 0;

  return (
    <>
      <SEO title="Dashboard" description="Your Distill AI learning dashboard" url="/" />

      <div className="min-h-screen bg-slate-950 pb-20">

        {/* ── HEADER ── */}
        <div className="relative overflow-hidden border-b border-gray-800/50">
          {/* Ambient */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-20 -top-10 w-96 h-64 rounded-full bg-indigo-600/10 blur-[100px]" />
            <div className="absolute right-0 top-0 w-64 h-48 rounded-full bg-violet-600/8 blur-[80px]" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-7">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: greeting */}
              <div>
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-1">{today}</p>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  <span className="text-gray-100">{getGreeting()}, </span>
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{firstName}.</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {getSubtext(hasHistory, readingHistory?.length || 0)}
                </p>
              </div>

              {/* Right: stat pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center divide-x divide-gray-800 rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden backdrop-blur-sm">
                  {[
                    { value: readingHistory?.length || 0, label: "Read",  icon: History,  path: "/search-history" },
                    { value: bookmarks?.length || 0,     label: "Saved", icon: Bookmark, path: "/bookmarks"       },
                  ].map(({ value, label, icon: Icon, path }) => (
                    <button
                      key={label}
                      onClick={() => navigate(path)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-800/60 transition-colors"
                    >
                      <Icon size={13} className="text-indigo-400/70" />
                      <div>
                        <span className="text-base font-extrabold text-gray-100 leading-none">{value}</span>
                        <span className="text-[10px] text-gray-500 ml-1.5 font-medium">{label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT MAIN (2/3) ── */}
            <div className="lg:col-span-2 space-y-7">

              {/* Continue Reading / Start Learning */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                    {hasHistory ? "Continue Reading" : "Start Here"}
                  </h2>
                  <button
                    onClick={() => navigate("/handbooks")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    All handbooks <ChevronRight size={11} />
                  </button>
                </div>

                {hasHistory ? (
                  <div className="space-y-3">
                    {recentHistory.map((item, i) => {
                      const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigate(`/topic/${item.categoryId}/${item.topicId}`)}
                          className="group w-full flex items-center gap-4 rounded-2xl border border-gray-800/60 bg-gray-900/50 p-4 text-left hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 active:scale-[0.99] overflow-hidden relative"
                        >
                          {/* Animated shine */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                          {/* Color accent bar */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accent} opacity-70 group-hover:opacity-100 transition-opacity`} />
                          {/* Icon */}
                          <div className={`flex-shrink-0 ml-2 h-10 w-10 rounded-xl bg-gradient-to-br ${accent} bg-opacity-10 flex items-center justify-center shadow-lg`}>
                            <BookOpen size={16} className="text-white" strokeWidth={2.5} />
                          </div>
                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors line-clamp-1">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.categoryTitle}</p>
                          </div>
                          {/* Right */}
                          <div className="flex-shrink-0 flex items-center gap-3">
                            <span className="text-[10px] text-gray-600 hidden sm:block">{formatRelativeTime(item.timestamp)}</span>
                            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                              Resume <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-800 bg-gradient-to-br from-gray-900/60 to-gray-950/40 p-10 text-center">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 flex items-center justify-center">
                      <BookOpen size={24} className="text-indigo-400" />
                    </div>
                    <p className="font-bold text-gray-200 mb-1">No reading history yet</p>
                    <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">Pick any handbook below and dive straight in. Your progress is saved automatically.</p>
                    <button
                      onClick={() => navigate("/handbooks")}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Browse Handbooks <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </section>

              {/* Based on Your Interests — only when history exists */}
              {hasHistory && interestCategories.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} className="text-violet-400" /> Based on Your Interests
                    </h2>
                    <button
                      onClick={() => navigate("/handbooks")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      All 20 fields <ChevronRight size={11} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {interestCategories.map((item, i) => {
                      const c = CAT_COLORS[i % CAT_COLORS.length];
                      const IconKey = FIELD_ICON_KEYS[i % FIELD_ICON_KEYS.length];
                      const Icon = FIELD_ICONS[IconKey];
                      return (
                        <button
                          key={item.title}
                          onClick={() => navigate("/handbooks")}
                          className={`group relative flex flex-col gap-3 rounded-2xl border bg-gradient-to-br ${c.gradient} ${c.border} p-5 text-left hover:brightness-110 transition-all duration-200 active:scale-[0.98] overflow-hidden`}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                          <div className="flex items-start justify-between gap-2">
                            <div className={`h-10 w-10 rounded-xl ${c.badge} flex items-center justify-center flex-shrink-0`}>
                              <Icon size={18} strokeWidth={2} />
                            </div>
                            {item.count > 1 && (
                              <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${c.badge}`}>{item.count} read</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-100 text-sm mb-1">{item.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">You&apos;ve been exploring this field. Dive deeper.</p>
                          </div>
                          <div className={`flex items-center gap-1 text-xs font-semibold ${c.icon} group-hover:gap-1.5 transition-all`}>
                            Explore more <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Popular Fields — always visible */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                    <Brain size={12} className="text-violet-400" /> Popular Fields
                  </h2>
                  <button
                    onClick={() => navigate("/handbooks")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    All 20 fields <ChevronRight size={11} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTED_FIELDS.map((item, i) => {
                    const c = CAT_COLORS[i % CAT_COLORS.length];
                    const IconKey = FIELD_ICON_KEYS[i % FIELD_ICON_KEYS.length];
                    const Icon = FIELD_ICONS[IconKey];

                    return (
                      <button
                        key={item.title}
                        onClick={() => navigate("/handbooks")}
                        className={`group relative flex flex-col gap-3 rounded-2xl border bg-gradient-to-br ${c.gradient} ${c.border} p-5 text-left hover:brightness-110 transition-all duration-200 active:scale-[0.98] overflow-hidden`}
                      >
                        {/* Subtle pattern */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                        <div className="flex items-start justify-between gap-2">
                          <div className={`h-10 w-10 rounded-xl ${c.badge} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={18} strokeWidth={2} />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-100 text-sm mb-1">{item.title}</p>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-semibold ${c.icon} group-hover:gap-1.5 transition-all`}>
                          Start reading <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* ── RIGHT SIDEBAR (1/3) ── */}
            <div className="space-y-5">

              {/* Profile + quick nav */}
              <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 overflow-hidden">
                {/* Profile header */}
                <div className="p-5 border-b border-gray-800/60 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-100 text-sm truncate">
                      {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                {/* Quick nav links */}
                <div className="p-2">
                  {[
                    { icon: TrendingUp, label: "My Progress",     path: "/progress",      color: "text-green-400"  },
                    { icon: Bell,       label: "Notifications",   path: "/notifications", color: "text-violet-400" },
                    { icon: Bookmark,   label: "My Bookmarks",    path: "/bookmarks",     color: "text-pink-400"   },
                    { icon: History,    label: "Search History",  path: "/search-history",color: "text-cyan-400"   },
                    { icon: User,       label: "Profile Settings",path: "/profile",       color: "text-indigo-400" },
                  ].map(({ icon: Icon, label, path, color }) => (
                    <button
                      key={path}
                      onClick={() => navigate(path)}
                      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-800/60 transition-colors"
                    >
                      <Icon size={14} className={`flex-shrink-0 ${color}`} />
                      <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors flex-1">{label}</span>
                      <ChevronRight size={11} className="text-gray-700 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Topics */}
              <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Bookmark size={11} className="text-indigo-400" /> Saved Topics
                  </h3>
                  {recentBookmarks.length > 0 && (
                    <button
                      onClick={() => navigate("/bookmarks")}
                      className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      See all →
                    </button>
                  )}
                </div>

                {recentBookmarks.length > 0 ? (
                  <div className="space-y-1">
                    {recentBookmarks.map((bm, i) => (
                      <button
                        key={bm.id}
                        onClick={() => navigate(`/topic/${bm.categoryId}/${bm.topicId}`)}
                        className="group w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-gray-800/60 transition-colors"
                      >
                        <div className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gradient-to-br" style={{
                          background: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f97316'][i % 5]
                        }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-300 group-hover:text-indigo-300 transition-colors truncate">{bm.title}</p>
                          <p className="text-[10px] text-gray-600 truncate">{bm.categoryTitle}</p>
                        </div>
                        <ChevronRight size={10} className="flex-shrink-0 text-gray-700 group-hover:text-indigo-500" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-5 text-center">
                    <Bookmark size={16} className="text-gray-700 mx-auto mb-2" />
                    <p className="text-[11px] text-gray-600 mb-2">No saved topics yet</p>
                    <button
                      onClick={() => navigate("/handbooks")}
                      className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                      Start reading →
                    </button>
                  </div>
                )}
              </div>

              {/* "What to learn next" prompt */}
              <div className="rounded-2xl p-px bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-indigo-500/10">
                <div className="rounded-[15px] bg-gray-950 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={13} className="text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300">Find your next topic</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                    Search 150+ handbooks by keyword, field, or concept.
                  </p>
                  <button
                    onClick={() => navigate("/search")}
                    className="w-full rounded-xl bg-indigo-600/20 border border-indigo-500/30 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Search size={11} /> Search
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
