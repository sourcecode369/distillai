
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase config
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Missing Supabase credentials in .env file.');
  console.error('   Ensure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BATCH_SIZE = 100;

async function populateModels() {
  console.log('🚀 Starting database population...');
  
  try {
    // Read collected data
    const jsonPath = path.join(__dirname, 'collected-models.json');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const { models } = JSON.parse(rawData);
    
    if (!models || models.length === 0) {
      console.error('❌ No models found in collected-models.json');
      return;
    }

    console.log(`📦 Found ${models.length} models to process.`);

    // Process in batches
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < models.length; i += BATCH_SIZE) {
      const batch = models.slice(i, i + BATCH_SIZE);
      console.log(`  🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(models.length / BATCH_SIZE)}...`);

      // Prepare data for upsert
      const formattedBatch = batch.map(m => ({
        // Map fields to match DB schema exactly
        name: m.name,
        model_id: m.model_id,
        publisher: m.publisher,
        category: m.category,
        model_type: m.model_type || null,
        
        task: m.task || [],
        modality: m.architecture?.modality ? [m.architecture.modality] : [], // Infer from architecture if available
        tags: m.tags || [],
        license: m.license,
        
        parameters: m.parameters || null,
        parameters_display: m.parameters_display || null,
        context_window: m.context_window || null,
        quantizations: m.quantizations || [],
        
        hardware_requirements: m.hardware_requirements || null,
        pricing: m.pricing || null,
        
        downloads: m.downloads || 0,
        likes: m.likes || 0,
        popularity_score: m.popularity_score || 0,
        
        source: m.source,
        is_api_only: m.is_api_only || false,
        is_open_source: m.is_open_source || false,
        available_on: m.available_on || [],
        sources_merged: m.sources_merged || 1,
        
        short_description: m.short_description ? m.short_description.substring(0, 500) : null,
        description: m.description || null,
        image_url: m.image_url || null,
        
        huggingface_url: m.huggingface_url || null,
        ollama_url: m.ollama_url || null,
        openrouter_url: m.openrouter_url || null,
        
        // Extended Metadata
        top_provider: m.top_provider || null,
        per_request_limits: m.per_request_limits || null,
        canonical_slug: m.canonical_slug || null,
        huggingface_id: m.huggingface_id || null, // from OpenRouter
        created_timestamp: m.created_timestamp || null,
        supported_parameters: m.supported_parameters || [],
        default_parameters: m.default_parameters || null,
        
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('ai_models')
        .upsert(formattedBatch, { 
          onConflict: 'model_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('  ❌ Batch insert failed:', error.message);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
      }
    }

    console.log('\n✨ Population complete!');
    console.log(`✅ Successfully upserted: ${successCount}`);
    if (errorCount > 0) console.log(`❌ Failed: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  }
}

populateModels();
