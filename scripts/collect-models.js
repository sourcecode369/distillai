// collector.js - ES Module version with README + metadata enrichment
// Run with: node collector.js --tier1

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import fs from 'fs';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HF_API_KEY = process.env.HF_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Concurrency / throttling tunables
const HF_ENRICH_CONCURRENCY = 6; // parallel per-model enrichment
const HF_PAGE_LIMIT = 100;       // page size when querying HF

// All organizations - Keep ORIGINAL casing from database
const ALL_ORGS = {
  tier_1: [
    'OpenAI', 'meta-llama', 'AI-at-Meta', 'google', 'Microsoft', 'Anthropic', 'NVIDIA', 'xAI', 'Apple', 'Amazon',
    'Tencent', 'Baidu', 'ByteDance', 'IBM-Granite', 'IBM-Research', 'AMD', 'mistralai', 'DeepSeek-AI', 'Qwen',
    'stabilityai', 'Black-Forest-Labs', 'Cohere', 'AI21Labs', 'Qualcomm', 'PaddlePaddle', 'SAP', 'ServiceNow',
    'InstaDeep', 'Roblox', 'Orange', 'AI-Singapore', 'Ministry-of-Digital-Affairs-Poland', 'Tenstorrent', 'PaloAltoNetworks',
    'Sony', 'Toyota-Research-Institute', 'Common-Crawl-Foundation', 'ibm-ai-platform', 'DoorDash'
  ],
  tier_2: [
    'Databricks', 'Snowflake', 'GretelAI', 'Nixtla', 'Deci', 'BRIAAI', 'Core42', 'H2O.ai', 'Upstage', 'ZhipuAI',
    'LiquidAI', 'JinaAI', 'Lightricks', 'LGAIResearch', 'MiniMax', 'Perplexity', 'StepFun', 'Z.ai', 'NariLabs',
    'ArceeAI', 'TogetherAI', 'HuggingFaceM4', 'ResembleAI', 'JetBrains', 'HyperCLOVA-X', 'Zyphra', 'NexaAI',
    'MenloResearch', 'ServiceNow-AI', 'WhiteRabbitNeo', 'Nanonets', 'ShopifyAI', 'CanopyLabs', 'JasperAI',
    'DeepCogito', 'PrimeIntellect', 'MayaResearch', 'Project-Numina', 'OpenDataLab', 'LLM360', 'fal',
    'CiscoFoundationAI', 'moondream', 'UltravoxAI', 'Kwaipilot', 'Writer', 'Neuphonic', 'Gradio', 'Nexusflow',
    'smolagents', 'NerdyFace', 'Latitude', 'Freepik', 'LanguageTechLab-BSC', 'Gensyn', 'KakaoCorp', 'Mixedbread',
    'PrunaAI', 'LightOnAI', 'EssentialAI', 'TNG-Consulting', 'TensorBlock', 'OpenHands', 'ELYZA', 'KittenML',
    'Nasjonalbiblioteket-AI-Lab', 'MiroMindAI', 'EvolutionaryScale', 'VIDraft', 'Finegrain', 'GoTo-Gojek-Tokopedia',
    'Elastic', 'IamCreateAI', 'InternRobotics', 'LlamaIndex', 'Pollen-Robotics', 'Manus-AI', 'Grammarly', 'K-Intelligence',
    'Supertone', 'Datalab', 'Argmax', 'Katanemo', 'Protect-AI', 'Mesolitica', 'Trelis', 'Bespoke-Labs', 'Trillion-Labs',
    'VAGO-Solutions', 'KREA', 'Chai-AI', 'DecartAI', 'Tahoe-Bio', 'Build-AI', 'Predibase', 'Snorkel-AI', 'VNGRS', 'FuriosaAI', 'Datadog'
  ],
  tier_3: [
    'EleutherAI', 'TIIUAE', 'BAAI', 'BigCode', 'OpenBMB', 'allenai', 'Ai2', 'OpenAssistant', 'SmolModelsResearch', 'LeRobot',
    'CohereLabs', 'InclusionAI', 'ShakkerLabs', 'HiDreamAI', 'KuaishouTech', 'VoyageAI', 'Timm', 'MIT', 'WangLab', 'MIMS-Harvard',
    'VanDijkLab', 'StanfordAIMI', 'AnswerDotAI', 'Idea-CCR', 'Nexusflow-Research', 'LeRobot-Worldwide-Hackathon',
    'Swiss-AI-Initiative', 'Docling', 'HuggingScience', 'LongCat', 'KAISAR', 'Agentica', 'Dolphin', 'Diffusers', 'AIDC-AI',
    'IBM-NASA-Prithvi', 'AgiBotWorld', 'H-company', 'Xiaomi-MiMo', 'LLM-jp', 'ArcInstitute', 'UTTER-XR', 'ai-sage', 'TheFinAI',
    'OpenMOSS', 'CommonPile', 'XetTeam', 'HuggingFace-Sheets', 'kernels-community', 'ESCP', 'FastVideo', 'OpenEnv', 'wut?',
    'tokyotech-llm', 'nltpt', 'gg-hf-gm', 'Institute-for-Computer-Science-AI-and-Tech', 'Institute-of-Smart-Systems-AI',
    'Future-House', 'IBM-ESA-Geospatial', 'Institutional-Data-Initiative', 'Athena-Research-Center', 'LlamaHack', 'gg-hf',
    'Apollo-LMMs', 'Jupyter-Agent', 'DICTA', 'NASA-IMPACT', 'LibreChat', 'University-of-Zurich'
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
          return null; // Not found
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

/* ---------- Concurrency limiter (small internal implementation) ---------- */
async function limitConcurrency(items, workerFn, concurrency = 6) {
  const out = new Array(items.length);
  let idx = 0;
  const runners = new Array(concurrency).fill(null).map(async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        out[i] = await workerFn(items[i], i);
      } catch (err) {
        out[i] = { error: String(err) };
      }
    }
  });
  await Promise.all(runners);
  return out;
}

/* ---------- Enrichment: fetch per-model metadata + README ---------- */
async function enrichHfModel(m) {
  try {
    const modelId = m.model_id || m.huggingface_id || m.name;
    if (!modelId) return m;

    // Encode path segments (owner and repo) but preserve '/'
    const encodedPath = modelId.split('/').map(encodeURIComponent).join('/');

    // Full model info endpoint (use encodedPath)
    const infoUrl = `https://huggingface.co/api/models/${encodedPath}`;
    const infoRes = await fetchWithRetry(infoUrl, {
      headers: {
        Authorization: HF_API_KEY ? `Bearer ${HF_API_KEY}` : undefined,
        'User-Agent': 'ModelCollector/1.0'
      }
    }, 3);

    if (infoRes) {
      // If non-ok (e.g., 4xx), fetchWithRetry might return null for 404; here infoRes is Response
      if (!infoRes.ok) {
        const txt = await infoRes.text().catch(() => '<no-body>');
        console.error(`  ❌ HF info for ${modelId} returned ${infoRes.status}: ${txt}`);
      } else {
        const info = await infoRes.json();
        m.downloads = info.downloads ?? m.downloads ?? 0;
        m.likes = info.likes ?? m.likes ?? 0;
        if (info.pipeline_tag) m.task = m.task && m.task.length ? m.task : [info.pipeline_tag];
        if (info.tags && (!m.tags || m.tags.length === 0)) m.tags = info.tags;
        if (info.cardData) {
          m.short_description = m.short_description || info.cardData.short_description || null;
          m.description = m.description || info.cardData.description || null;
        }
        m.huggingface_id = m.huggingface_id || info.id || modelId;
        m.last_modified = m.last_modified || info.lastModified || info.updated_at || m.last_modified;
        m.created_timestamp = m.created_timestamp || info.createdAt || info.created_at || m.created_timestamp;
      }
    }

    // Try to fetch raw README - prefer main branch README.md
    const rawReadmeCandidates = [
      `https://huggingface.co/${encodedPath}/raw/main/README.md`,
      `https://huggingface.co/${encodedPath}/raw/main/README`,
      `https://huggingface.co/${encodedPath}/raw/main/modelcard.md`,
      `https://huggingface.co/${encodedPath}/raw/main/README.MD`
    ];

    for (const url of rawReadmeCandidates) {
      try {
        const r = await fetchWithRetry(url, { headers: { 'User-Agent': 'ModelCollector/1.0' } }, 2);
        if (r && r.ok) {
          const text = await r.text();
          if (text && text.trim().length > 0) {
            m.readme = text;
            break;
          }
        } else if (r && !r.ok) {
          // helpful debug logging only (don't spam too much)
          const body = await r.text().catch(() => '');
          // 404 is common; log only other statuses at debug level
          if (r.status !== 404) {
            console.debug(`  ℹ️  README fetch ${url} returned ${r.status}: ${body.slice(0,200)}`);
          }
        }
      } catch (e) {
        // try next candidate
      }
    }
  } catch (err) {
    console.error(`  ⚠️  Enrich failed for ${m.model_id || m.name}: ${err.message}`);
  } finally {
    // Ensure canonical id reflects newly set huggingface_id if present
    m.canonical_model_id = computeCanonicalId(m);
    return m;
  }
}

/* ---------- Hugging Face listing (now enriches each page of results) ---------- */
async function fetchHfModelsForOrg(org, maxPages = 20) {
  console.log(`\n📦 Fetching ${org}...`);
  const models = [];

  // Smart case variations that preserve internal capitals AND handle special chars
  const generateCaseVariations = (str) => {
    const variations = [
      str,
      str.toLowerCase(),
      str.toUpperCase(),
    ];
    const withoutSpecialChars = str.replace(/[.-]/g, '');
    if (withoutSpecialChars !== str) {
      variations.push(withoutSpecialChars, withoutSpecialChars.toLowerCase(), withoutSpecialChars.toUpperCase());
    }
    const hasInternalCaps = /[a-z][A-Z]/.test(str);
    if (!hasInternalCaps) {
      variations.push(str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
      if (withoutSpecialChars !== str) {
        variations.push(withoutSpecialChars.charAt(0).toUpperCase() + withoutSpecialChars.slice(1).toLowerCase());
      }
    }
    return [...new Set(variations)];
  };

  const orgsToTry = generateCaseVariations(org);
  let successfulOrg = null;

  for (const tryOrg of orgsToTry) {
    const testUrl = `https://huggingface.co/api/models?author=${encodeURIComponent(tryOrg)}&limit=1`;
    try {
      const testRes = await fetchWithRetry(testUrl, {
        headers: {
          Authorization: HF_API_KEY ? `Bearer ${HF_API_KEY}` : undefined,
          'User-Agent': 'ModelCollector/1.0'
        }
      });
      if (testRes) {
        const testData = await testRes.json();
        if (Array.isArray(testData) && testData.length > 0) {
          successfulOrg = tryOrg;
          if (tryOrg !== org) {
            console.log(`  ℹ️  Using: ${tryOrg} (instead of ${org})`);
          }
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
    const url = `https://huggingface.co/api/models?author=${encodeURIComponent(successfulOrg)}&limit=${HF_PAGE_LIMIT}&skip=${page * HF_PAGE_LIMIT}&expand[]=cardData&expand[]=tags`;
    try {
      const res = await fetchWithRetry(url, {
        headers: {
          Authorization: HF_API_KEY ? `Bearer ${HF_API_KEY}` : undefined,
          'User-Agent': 'ModelCollector/1.0'
        }
      });

      if (!res) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;

      // Build pageModels then enrich them concurrently but limited
      const pageModels = [];
      for (const m of data) {
        if (m.id && (m.id.includes('lora') || m.id.includes('adapter'))) continue;

        const card = m.cardData || {};
        const modelObj = {
          name: (m.id && m.id.split('/')[1]) || m.id,
          model_id: m.id,
          huggingface_id: m.id,
          publisher: successfulOrg,
          category: 'LLM', // default, enrichment may add pipeline_tag
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
        pageModels.push(modelObj);
      }

      // Enrich page's models (metadata + readme) with limited concurrency
      if (pageModels.length > 0) {
        process.stdout.write(`\r  🧩 Enriching page ${page + 1} models...`);
        const enriched = await limitConcurrency(pageModels, enrichHfModel, HF_ENRICH_CONCURRENCY);
        for (const em of enriched) {
          if (em && !em.error) models.push(em);
        }
        process.stdout.write(`\r  📄 Page ${page + 1}: ${models.length} models`);
      }

      if (data.length < HF_PAGE_LIMIT) break;
      await new Promise(r => setTimeout(r, 800)); // polite delay between pages
    } catch (err) {
      console.error(`\n  ❌ Error: ${err.message}`);
      break;
    }
  }

  console.log(`\n  ✅ Total: ${models.length} models`);
  return models;
}

/* ---------- OpenRouter ---------- */
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

/* ---------- Ollama (scrape) ---------- */
async function fetchOllamaModels() {
  console.log('\n🦙 Fetching Ollama models...');

  try {
    const res = await fetchWithRetry('https://ollama.com/library');
    if (!res) {
      console.log('  ⚠️  Failed to fetch Ollama library page');
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const models = [];

    $('li').each((i, elem) => {
      const $elem = $(elem);
      const name = $elem.find('h2, .font-medium').first().text().trim();
      const description = $elem.find('p').first().text().trim();
      const href = $elem.find('a').attr('href');

      if (name && name.length < 50 && name.length > 0) {
        const nameLower = name.toLowerCase();

        let publisher = 'ollama';
        if (nameLower.includes('llama') || nameLower.includes('codellama')) publisher = 'meta-llama';
        else if (nameLower.includes('mistral') || nameLower.includes('mixtral')) publisher = 'mistralai';
        else if (nameLower.includes('gemma')) publisher = 'google';
        else if (nameLower.includes('phi')) publisher = 'microsoft';
        else if (nameLower.includes('deepseek')) publisher = 'deepseek-ai';
        else if (nameLower.includes('qwen')) publisher = 'qwen';
        else if (nameLower.includes('vicuna')) publisher = 'lmsys';
        else if (nameLower.includes('starcoder')) publisher = 'bigcode';
        else if (nameLower.includes('falcon')) publisher = 'tiiuae';
        else if (nameLower.includes('stable')) publisher = 'stabilityai';
        else if (nameLower.includes('command')) publisher = 'cohere';
        else if (nameLower.includes('yi')) publisher = '01-ai';

        const modelObj = {
          name,
          model_id: `${publisher}/${name.replace(/\s+/g, '-').toLowerCase()}`,
          publisher,
          category: 'LLM',
          short_description: description || 'Local Ollama model',
          description: description || null,
          ollama_url: href ? `https://ollama.com${href}` : `https://ollama.com/library/${name}`,
          source: 'ollama',
        };

        modelObj.canonical_model_id = computeCanonicalId(modelObj);
        models.push(modelObj);
      }
    });

    console.log(`  ✅ Fetched ${models.length} models`);
    return models;
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    return [];
  }
}

/* ---------- README task creation: only for models that still lack README ---------- */
async function createReadmeTasks(models) {
  console.log('\n📝 Creating README fetch tasks (only for missing READMEs)...');
  let taskCount = 0;

  for (const m of models) {
    if (m.source === 'huggingface' && m.huggingface_id && (!m.readme || m.readme.length === 0)) {
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
        // Ignore duplicates / insert errors
      }
    }
  }

  console.log(`  ✅ Created ${taskCount} README tasks`);
}

/* ---------- CSV saver: includes readme column ---------- */
function saveToCSV(models, filename) {
  const headers = [
    'name', 'model_id', 'canonical_model_id', 'publisher', 'category',
    'source', 'huggingface_id', 'openrouter_id', 'downloads', 'likes',
    'short_description', 'huggingface_url', 'openrouter_url', 'ollama_url', 'tags', 'readme'
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

/* ---------- Supabase upload (unchanged fields) ---------- */
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
    downloads: m.downloads ?? null,
    likes: m.likes ?? null,
    short_description: m.short_description || null,
    huggingface_url: m.huggingface_url || null,
    openrouter_url: m.openrouter_url || null,
    ollama_url: m.ollama_url || null,
    tags: m.tags || [],
    available_on: [m.source],
    is_open_source: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // NOTE: intentionally not including readme here to avoid DB schema mismatch.
    // If your table has a `readme` column, add: readme: m.readme || null
  }));

  const batchSize = 100;
  let uploaded = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    // Use model_id as conflict key since it has UNIQUE constraint
    const { error } = await supabase
      .from('ai_models')
      .upsert(batch, { onConflict: 'model_id' });

    if (error) {
      console.error(`  ❌ Batch ${i / batchSize + 1}: ${error.message}`);
    } else {
      uploaded += batch.length;
      process.stdout.write(`\r  ⬆️  Progress: ${uploaded}/${records.length}`);
    }
  }

  console.log(`\n  ✅ Uploaded ${uploaded} models`);
}

/* ---------- Main processing flow ---------- */
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

  // Fetch Ollama (only once per session, keep previous logic)
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

  // Create README fetch tasks for HuggingFace models that still lack readme
  await createReadmeTasks(allModels);

  return { models: allModels, filename };
}

/* ---------- CLI / main ---------- */
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
  console.log('  🤖 AI Model Collector v2.0 (README + metadata enrichment)');
  console.log('═'.repeat(50));

  await processOrgs(orgsToProcess, sessionName);

  console.log('\n✨ Done! Check your CSV file and Supabase database.\n');
}

main().catch(console.error);
