# Build Scripts

## Sitemap Generation

The sitemap generator creates a `sitemap.xml` file in the `public` folder for SEO purposes.

### Usage

1. **Generate sitemap manually:**
   ```bash
   npm run generate-sitemap
   ```

2. **Build with sitemap generation:**
   ```bash
   npm run build:with-sitemap
   ```

### Environment Variables

The script requires the following environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SITE_URL` (optional) - Your production site URL (defaults to "https://aihandbooks.com")

### Output

The generated `sitemap.xml` will be placed in the `public` folder and will be included in the build output.

### What's Included

The sitemap includes:
- Static pages (home, about, FAQ, etc.)
- All category pages
- All topic pages with their last modified dates

### Notes

- The sitemap is regenerated on each build
- Topic URLs follow the pattern: `/topic/{categoryId}/{topicId}`
- Category URLs follow the pattern: `/category/{categoryId}`
- Last modified dates are taken from the database `updated_at` field


