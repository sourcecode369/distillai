/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ── Typography ─────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Minimum body 16px for WCAG AA readability
        xs:    ['0.75rem',  { lineHeight: '1rem' }],
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],
        base:  ['1rem',     { lineHeight: '1.5rem' }],   // ← 16px body minimum
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl': ['3rem',     { lineHeight: '1' }],
        '6xl': ['3.75rem',  { lineHeight: '1' }],
      },

      // ── Colors ──────────────────────────────────────────────────────────
      colors: {
        // CSS-variable backed — responds to .dark class via base.css
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT:    "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        card: {
          DEFAULT:    "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },

        // Semantic brand tokens — single source of truth for the palette
        // Usage:  bg-primary-600, text-primary-700, border-primary/30
        primary: {
          DEFAULT: '#6366f1',
          500:     '#6366f1',  // indigo-500
          600:     '#4f46e5',  // indigo-600  — main CTA background
          700:     '#4338ca',  // indigo-700  — hover state
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          500:     '#8b5cf6',  // violet-500
          600:     '#7c3aed',  // violet-600
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT:    '#ec4899',  // pink-500
          foreground: '#ffffff',
        },

        // Surface scale — maps to the gray-950 → gray-700 dark palette
        // Usage:  bg-surface-1, bg-surface-3
        surface: {
          1: '#030712',  // gray-950  — page canvas
          2: '#111827',  // gray-900  — card
          3: '#1f2937',  // gray-800  — elevated / hover
          4: '#374151',  // gray-700  — input / divider
        },
      },

      // ── Spacing — 8px base grid semantic aliases ────────────────────────
      spacing: {
        'touch-sm': '40px',  // small touch target
        'touch':    '44px',  // WCAG 2.5.5 minimum
        'touch-lg': '48px',  // comfortable mobile tap
      },

      // ── Border radius ───────────────────────────────────────────────────
      borderRadius: {
        'card-sm': '12px',
        'card':    '16px',
        'card-lg': '20px',
        'card-xl': '24px',
      },

      // ── Z-index scale ──────────────────────────────────────────────────
      zIndex: {
        base:     '0',
        raised:   '10',
        overlay:  '20',
        drawer:   '30',
        sticky:   '40',   // topbar
        dropdown: '50',
        modal:    '60',
        toast:    '70',
        tooltip:  '80',
      },

      // ── Shadows ────────────────────────────────────────────────────────
      boxShadow: {
        card:       '0 4px 20px rgba(0,0,0,0.08)',
        'card-dark':'0 4px 20px rgba(0,0,0,0.30)',
        'card-hover':'0 8px 30px rgba(0,0,0,0.12)',
        'glow-sm':  '0 0 0 1px rgba(99,102,241,0.20)',
        glow:       '0 0 0 1px rgba(99,102,241,0.30), 0 8px 32px rgba(99,102,241,0.08)',
        'glow-lg':  '0 0 0 1px rgba(99,102,241,0.40), 0 16px 48px rgba(99,102,241,0.12)',
      },

      // ── Transitions ────────────────────────────────────────────────────
      transitionDuration: {
        fast:   '150ms',
        base:   '200ms',
        slow:   '300ms',
        slower: '500ms',
      },
    },
  },
  plugins: [],
};
