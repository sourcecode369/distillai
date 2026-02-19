import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Home } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* 404 number */}
        <div className="text-[9rem] md:text-[12rem] font-extrabold leading-none tracking-tight bg-gradient-to-br from-indigo-500/20 to-violet-500/10 bg-clip-text text-transparent select-none mb-2">
          404
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">
          Page not found
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed">
          This page doesn't exist or was moved. Head back to the handbooks and keep learning.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/handbooks")}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <BookOpen size={16} />
            Browse Handbooks
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700/60 bg-gray-900/60 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-indigo-500/40 hover:text-indigo-300 transition-all duration-200"
          >
            <Home size={16} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
