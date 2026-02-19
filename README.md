# Distill AI

An AI & ML learning platform with 150+ expert-curated handbooks across 20 specializations — from core machine learning to production MLOps.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **State:** React Context + TanStack Query

## Getting Started

```bash
npm install
npm run dev
```

Set up `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Apply migrations in `supabase/migrations/` to your Supabase project.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run generate-sitemap` | Regenerate sitemap.xml |

## License

[Add license]
