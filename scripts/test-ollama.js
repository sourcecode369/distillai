// collector.js - ES Module version with fixes
// Run with: node collector.js --tier1

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HF_API_KEY = process.env.HF_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// All organizations - CORRECTED TO LOWERCASE for HuggingFace
const ALL_ORGS = {
  tier_1: [
    'openai', 'meta-llama', 'facebook', 'google', 'microsoft', 'anthropic', 'nvidia', 'xai', 'apple', 'amazon',
    'tencent', 'baidu', 'bytedance', 'ibm', 'ibm-granite', 'amd', 'mistralai', 'deepseek-ai', 'qwen',
    'stabilityai', 'black-forest-labs', 'cohere', 'ai21labs', 'qualcomm', 'paddlepaddle', 'sap', 'servicenow',
    'instadeep', 'roblox', 'orange', 'aisingapore', 'tenstorrent',
    'sony', 'toyota', 'doordash'
  ],
  tier_2: [
    'databricks', 'snowflake', 'gretelai', 'nixtla', 'deci', 'briaai', 'core42', 'h2oai', 'upstage', 'zhipuai',
    'liquid', 'jinaai', 'lightricks', 'lgresearch', 'minimax-ai', 'perplexity-ai', 'stepfun', 'nari-labs',
    'arcee-ai', 'togettherai', 'huggingfacem4', 'resembleai', 'jetbrains', 'zyphra', 'nexaai',
    'whitrabbitneo', 'nanonets', 'shopify', 'jasper-ai',
    'deepcogito', 'primeintellect', 'project-numina', 'opendatalab', 'llm360', 'fal',
    'cisco', 'moondream', 'ultravox', 'writer', 'neuphonic', 'gradio', 'nexusflow',
    'smolagents', 'latitude', 'freepik', 'gensyn', 'kakao', 'mixedbread',
    'prunaai', 'lighton', 'essentialai', 'tensorblock', 'openhands', 'elyza',
    'miro', 'evolutionaryscale', 'finegrain', 'goto',
    'elastic', 'llamaindex', 'pollen-robotics', 'grammarly',
    'supertone', 'datalab', 'argmax', 'protect-ai', 'mesolitica', 'trelis', 'bespoke',
    'krea', 'decart', 'predibase', 'snorkel-ai', 'furiosa', 'datadog'
  ],
  tier_3: [
    'eleutherai', 'tiiuae', 'baai', 'bigcode', 'openbmb', 'allenai', 'openassistant', 'lerobot',
    'cohere', 'shakker-labs', 'kuaishou', 'voyageai', 'timm', 'mit', 
    'stanford', 'answerdotai',
    'docling', 'agentica', 'diffusers', 'aidc-ai',
    'agibotworld', 'xiaomi', 'llm-jp', 'arc-institute', 'ai-sage',
    'openmoss', 'huggingface', 'escp', 'fastvideo',
    'tokyotech-llm', 'future-house', 'llama-hack',
    'apollo', 'dicta', 'nasa-impact', 'librechat'
  ]
};

function norm(s = '') {
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[._\s\/\\]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function computeCanonicalId(m) {
  if (!m) return `unknown:${Math.random().toString(36).slice(2, 9)}`;
  if (m.huggingface_id) return `hf:${norm(m.huggingface_id)}`;
  if (m.openrouter_id) return `or:${norm(m.openrouter_id)}`;
  if (m.ollama_url) return `ollama:${norm(m.name || m.model_id)}`;
  const pub = norm(m.publisher || m.source || '');
  const name = norm(m.name || m.model_id || '');
  if (pub && name) return `${pub}:${name}`;
  if (name) return `name:${name}`;
  return `unknown:${Math.random().toString(36).slice(2, 9)}`;
}

async function fetchWithRetry(url, opts = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        if (res.status === 429 || res.status === 503) {
          const delay = 500 * Math.pow(2, i);
          console.log(`  ⏳ Rate limited, waiting ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        if (res.status === 404) {
          return null; // Org not found
        }
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw new Error('fetch failed');
}

async function fetchHfModelsForOrg(org, maxPages = 10) {
  console.log(`\n📦 Fetching ${org}...`);
  const models = [];
  
  // Try both lowercase and original case
  const orgsToTry = [org.toLowerCase(), org];
  let successfulOrg = null;
  
  for (const tryOrg of orgsToTry) {
    const testUrl = `https://huggingface.co/api/models?author=${encodeURIComponent(tryOrg)}&limit=1`;
    try {
      const testRes = await fetchWithRetry(testUrl, {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'User-Agent': 'ModelCollector/1.0'
        }
      });
      
      if (testRes) {
        const testData = await testRes.json();
        if (Array.isArray(testData) && testData.length > 0) {
          successfulOrg = tryOrg;
          console.log(`  ℹ️  Using: ${tryOrg}`);
          break;
        }
      }
    } catch (e) {
      continue;
    }
  }
  
  if (!successfulOrg) {
    console.log(`  ⚠️  Organization not found (tried: ${orgsToTry.join(', ')})`);
    return models;
  }
  
  for (let page = 0; page < maxPages; page++) {
    const url = `https://huggingface.co/api/models?author=${encodeURIComponent(successfulOrg)}&limit=100&skip=${page * 100}&expand[]=cardData&expand[]=tags`;
    
    try {
      const res = await fetchWithRetry(url, {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'User-Agent': 'ModelCollector/1.0'
        }
      });
      
      if (!res) break;
      
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      
      for (const m of data) {
        if (m.id && (m.id.includes('lora') || m.id.includes('adapter'))) continue;
        
        const card = m.cardData || {};
        const modelObj = {
          name: (m.id && m.id.split('/')[1]) || m.id,
          model_id: m.id,
          huggingface_id: m.id,
          publisher: successfulOrg,
          category: 'LLM',
          task: m.pipeline_tag ? [m.pipeline_tag] : [],
          tags: m.tags || [],
          downloads: m.downloads || 0,
          likes: m.likes || 0,
          short_description: card.short_description || null,
          description: card.description || null,
          huggingface_url: `https://huggingface.co/${m.id}`,
          source: 'huggingface',
          created_timestamp: m.createdAt || null,
          last_modified: m.lastModified || null,
        };
        
        modelObj.canonical_model_id = computeCanonicalId(modelObj);
        models.push(modelObj);
      }
      
      process.stdout.write(`\r  📄 Page ${page + 1}: ${models.length} models`);
      if (data.length < 100) break;
      
      await new Promise(r => setTimeout(r, 800)); // Rate limiting
    } catch (err) {
      console.error(`\n  ❌ Error: ${err.message}`);
      break;
    }
  }
  
  console.log(`\n  ✅ Total: ${models.length} models`);
  return models;
}

async function fetchOpenRouterModels() {
  console.log('\n🌐 Fetching OpenRouter models...');
  try {
    const res = await fetchWithRetry('https://openrouter.ai/api/v1/models', {
      headers: OPENROUTER_API_KEY ? { Authorization: `Bearer ${OPENROUTER_API_KEY}` } : {}
    });
    
    if (!res) return [];
    
    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      console.log('  ⚠️  Unexpected format');
      return [];
    }
    
    const models = data.data.map(m => {
      const parts = (m.id || '').split('/');
      const publisher = parts.length >= 2 ? parts[0] : 'openrouter';
      const name = parts.length >= 2 ? parts.slice(1).join('/') : m.id;
      
      const modelObj = {
        name,
        model_id: m.id,
        openrouter_id: m.id,
        publisher,
        category: 'LLM',
        task: m.architecture?.modality ? [m.architecture.modality] : [],
        tags: m.tags || [],
        short_description: m.description || null,
        openrouter_url: `https://openrouter.ai/models/${m.id}`,
        pricing: m.pricing || null,
        source: 'openrouter',
      };
      
      modelObj.canonical_model_id = computeCanonicalId(modelObj);
      return modelObj;
    });
    
    console.log(`  ✅ Fetched ${models.length} models`);
    return models;
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    return [];
  }
}

async function fetchOllamaModels() {
  console.log('\n🦙 Fetching Ollama models...');
  
  const models = [];
  
  try {
    const res = await fetchWithRetry('https://ollama.com/library');
    if (!res) {
      console.log('  ⚠️  Failed to fetch Ollama library page');
      return models;
    }
    
    const html = await res.text();
    
    // Multiple regex patterns to catch different HTML structures
    const patterns = [
      /href="\/library\/([a-z0-9][a-z0-9-]*[a-z0-9])"/gi,
      /"slug":"([^"]+)"/gi,
      /data-model="([^"]+)"/gi
    ];
    
    const modelNames = new Set();
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const name = match[1].trim();
        if (name && 
            name.length < 80 && 
            !name.includes('http') && 
            !name.includes('//') &&
            /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(name)) {
          modelNames.add(name);
        }
      }
    }
    
    for (const name of modelNames) {
      const modelObj = {
        name,
        model_id: `ollama/${name}`,
        publisher: 'ollama',
        category: 'LLM',
        short_description: 'Local Ollama model',
        description: null,
        ollama_url: `https://ollama.com/library/${name}`,
        source: 'ollama',
      };
      modelObj.canonical_model_id = computeCanonicalId(modelObj);
      models.push(modelObj);
    }
    
    console.log(`  ✅ Fetched ${models.length} models`);
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
  }
  
  return models;
}

async function createReadmeTasks(models) {
  console.log('\n📝 Creating README fetch tasks...');
  let taskCount = 0;
  
  for (const m of models) {
    if (m.source === 'huggingface' && m.huggingface_id) {
      try {
        const { error } = await supabase.from('task_queue').insert({
          task_type: 'fetch_readme',
          payload: {
            canonical_model_id: m.canonical_model_id,
            huggingface_url: m.huggingface_url,
            model_id: m.model_id
          },
          status: 'pending',
          scheduled_at: new Date().toISOString()
        });
        
        if (!error) {
          taskCount++;
        } else if (!error.message.includes('duplicate')) {
          console.error(`  ⚠️  Task error for ${m.model_id}: ${error.message}`);
        }
      } catch (e) {
        // Ignore duplicates
      }
    }
  }
  
  console.log(`  ✅ Created ${taskCount} README tasks`);
}

function saveToCSV(models, filename) {
  const headers = [
    'name', 'model_id', 'canonical_model_id', 'publisher', 'category',
    'source', 'huggingface_id', 'openrouter_id', 'downloads', 'likes',
    'short_description', 'huggingface_url', 'openrouter_url', 'ollama_url', 'tags'
  ];
  
  let csv = headers.join(',') + '\n';
  
  for (const m of models) {
    const row = headers.map(h => {
      let val = m[h];
      if (Array.isArray(val)) val = val.join(';');
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });
    csv += row.join(',') + '\n';
  }
  
  fs.writeFileSync(filename, csv);
  console.log(`\n💾 Saved ${models.length} models to ${filename}`);
}

async function uploadToSupabase(models) {
  console.log('\n📤 Uploading to Supabase...');
  
  const records = models.map(m => ({
    name: m.name || null,
    model_id: m.model_id || null,
    canonical_model_id: m.canonical_model_id || null,
    publisher: m.publisher || null,
    category: m.category || 'LLM',
    source: m.source || 'unknown',
    huggingface_id: m.huggingface_id || null,
    openrouter_id: m.openrouter_id || null,
    downloads: m.downloads || null,
    likes: m.likes || null,
    short_description: m.short_description || null,
    huggingface_url: m.huggingface_url || null,
    openrouter_url: m.openrouter_url || null,
    ollama_url: m.ollama_url || null,
    tags: m.tags || [],
    available_on: [m.source],
    is_open_source: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  
  const batchSize = 100;
  let uploaded = 0;
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase
      .from('ai_models')
      .upsert(batch, { onConflict: 'canonical_model_id' });
    
    if (error) {
      console.error(`  ❌ Batch ${i / batchSize + 1}: ${error.message}`);
    } else {
      uploaded += batch.length;
      process.stdout.write(`\r  ⬆️  Progress: ${uploaded}/${records.length}`);
    }
  }
  
  console.log(`\n  ✅ Uploaded ${uploaded} models`);
}

async function processOrgs(orgList, sessionName, includeOllama = true) {
  console.log(`\n🚀 Processing ${orgList.length} organizations...`);
  console.log(`📊 Session: ${sessionName}\n`);
  
  const allModels = [];
  const startTime = Date.now();
  
  // Process HuggingFace orgs
  for (let i = 0; i < orgList.length; i++) {
    console.log(`[${i + 1}/${orgList.length}]`);
    const models = await fetchHfModelsForOrg(orgList[i]);
    allModels.push(...models);
  }
  
  // Fetch OpenRouter once
  const orModels = await fetchOpenRouterModels();
  allModels.push(...orModels);
  
  // Fetch Ollama (only once per session)
  if (includeOllama && sessionName === 'tier1') {
    const ollamaModels = await fetchOllamaModels();
    allModels.push(...ollamaModels);
  }
  
  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n⏱️  Completed in ${duration} minutes`);
  console.log(`📊 Total models: ${allModels.length}\n`);
  
  const filename = `models_${sessionName}_${Date.now()}.csv`;
  saveToCSV(allModels, filename);
  await uploadToSupabase(allModels);
  
  // Create README fetch tasks for HuggingFace models
  await createReadmeTasks(allModels);
  
  return { models: allModels, filename };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
📚 AI Model Collector

Usage:
  node collector.js --all              # All organizations (takes ~2-3 hours)
  node collector.js --tier1            # Tier 1 only (35 orgs) + OpenRouter + Ollama
  node collector.js --tier2            # Tier 2 only (62 orgs) + OpenRouter
  node collector.js --tier3            # Tier 3 only (37 orgs) + OpenRouter
  node collector.js org1,org2,org3     # Specific organizations
  
Examples:
  node collector.js --tier1
  node collector.js meta-llama,google,mistralai
  node collector.js --all
    `);
    return;
  }
  
  let orgsToProcess = [];
  let sessionName = 'custom';
  
  if (args[0] === '--all') {
    orgsToProcess = [...ALL_ORGS.tier_1, ...ALL_ORGS.tier_2, ...ALL_ORGS.tier_3];
    sessionName = 'all';
  } else if (args[0] === '--tier1') {
    orgsToProcess = ALL_ORGS.tier_1;
    sessionName = 'tier1';
  } else if (args[0] === '--tier2') {
    orgsToProcess = ALL_ORGS.tier_2;
    sessionName = 'tier2';
  } else if (args[0] === '--tier3') {
    orgsToProcess = ALL_ORGS.tier_3;
    sessionName = 'tier3';
  } else {
    orgsToProcess = args[0].split(',').map(s => s.trim());
    sessionName = 'custom';
  }
  
  console.log('═'.repeat(50));
  console.log('  🤖 AI Model Collector v2.0');
  console.log('═'.repeat(50));
  
  await processOrgs(orgsToProcess, sessionName);
  
  console.log('\n✨ Done! Check your CSV file and Supabase database.\n');
}

main().catch(console.error);