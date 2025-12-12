# Model Data Collection Script

Standalone script to collect AI model data from multiple sources for testing before integration.

## Features

- ✅ Fetches from **Ollama Library** (local models)
- ✅ Scrapes **Azure AI Model Catalog** (no API key needed!)
- ✅ Fetches from **HuggingFace** (verified organizations only)
- ✅ Includes **API-only models** (GPT-4, Claude, Gemini)
- ✅ **Automatic deduplication** and data merging
- ✅ **Statistics report** (sources, categories, counts)

## Installation

```bash
cd scripts
npm install
```

## Usage

```bash
npm run collect-models
```

## Output

Creates `collected-models.json` with model data and statistics.

## Verification

```bash
# Check statistics
cat collected-models.json | jq '.stats'

# View top models
cat collected-models.json | jq '.models[:10]'

# Check for duplicates (should be empty)
cat collected-models.json | jq '[.models[] | .model_id] | group_by(.) | map(select(length > 1))'
```

## Customization

- **Add API models:** Edit `API_ONLY_MODELS` array
- **Add HF orgs:** Edit `VERIFIED_ORGS` array  
- **Adjust scraping:** Update selectors in fetch functions

## Next Steps

After testing:
1. Review `collected-models.json` for data quality
2. Adjust deduplication logic if needed
3. Ready to integrate into main application!

---

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

