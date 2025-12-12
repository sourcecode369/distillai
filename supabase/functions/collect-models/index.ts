// functions/collect-models/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- ENV (set in Supabase Functions -> Secrets) ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const HF_API_KEY = Deno.env.get("HF_API_KEY") || "";
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "";

// --- Clients ---
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Constants ---
const HUGGINGFACE_API = "https://huggingface.co/api";
const OPENROUTER_API = "https://openrouter.ai/api/v1/models";
const OLLAMA_LIBRARY_URL = "https://ollama.com/library";
const HF_MODELS_PER_PAGE = 100;
const HF_MAX_PAGES = 10;
const MAX_RETRIES = 3;

// ---------- Helpers ----------
function norm(s = "") {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[._\s\/\\]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function computeCanonicalId(m: any) {
  if (!m) return `unknown:${Math.random().toString(36).slice(2, 9)}`;
  if (m.huggingface_id) return `hf:${norm(m.huggingface_id)}`;
  if (m.openrouter_id) return `or:${norm(m.openrouter_id)}`;
  if (m.huggingface_url) {
    try {
      const path = new URL(m.huggingface_url).pathname.replace(/^\//, "");
      return `hf:${norm(path)}`;
    } catch { }
  }
  if (m.openrouter_url) {
    try {
      const path = new URL(m.openrouter_url).pathname.replace(/^\//, "");
      return `or:${norm(path)}`;
    } catch { }
  }
  if (m.ollama_url) {
    try {
      const path = new URL(m.ollama_url).pathname.replace(/^\//, "");
      return `ollama:${norm(path)}`;
    } catch { }
  }
  const pub = norm(m.publisher || m.source || "");
  const name = norm(m.name || m.model_id || "");
  if (pub && name) return `${pub}:${name}`;
  if (name) return `name:${name}`;
  return `unknown:${Math.random().toString(36).slice(2, 9)}`;
}

async function fetchWithRetry(url: string, opts: any = {}, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        if (res.status === 429 || res.status === 503) {
          await new Promise((r) => setTimeout(r, 500 * Math.pow(2, i)));
          continue;
        }
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw new Error("fetch failed");
}

async function saveModelSource(supabaseClient: any, m: any) {
  try {
    const canonical = computeCanonicalId(m);
    const sourceMeta = {
      name: m.name || null,
      publisher: m.publisher || null,
      short_description: m.short_description || null,
      tags: m.tags || [],
      downloads: m.downloads || 0,
      openrouter_id: m.openrouter_id || null,
      huggingface_id: m.huggingface_id || null,
      ollama_url: m.ollama_url || null,
    };

    const row = {
      canonical_model_id: canonical,
      model_id: m.model_id || m.huggingface_id || m.openrouter_id || null,
      source: m.source || "unknown",
      source_raw: m,
      source_meta: sourceMeta,
      fetched_at: new Date().toISOString(),
    };

    // await and inspect returned object instead of chaining .catch()
    const { data, error } = await supabaseClient
      .from("model_sources")
      .upsert(row, { onConflict: ["canonical_model_id", "source", "model_id"] });

    if (error) {
      console.error("model_sources upsert error", error.message || error);
    }
    return data;
  } catch (err) {
    console.error("saveModelSource err", (err as any).message || err);
    return null;
  }
}

function mapModelToRow(m: any) {
  return {
    name: m.name || m.model_id || null,
    model_id: m.model_id || m.canonical_model_id || null,
    canonical_model_id: m.canonical_model_id || null,
    publisher: m.publisher || null,
    category: m.category || "LLM",
    model_type: m.model_type || null,
    task: m.task || null,
    modality: m.modality || null,
    tags: m.tags || null,
    license: m.license || null,
    parameters: m.parameters ?? null,
    parameters_display: m.parameters_display || null,
    context_window: m.context_window ?? null,
    quantizations: m.quantizations || null,
    hardware_requirements: m.hardware_requirements ?? null,
    pricing: m.pricing ?? null,
    downloads: m.downloads ?? null,
    likes: m.likes ?? null,
    popularity_score: m.popularity_score ?? null,
    source: m.source || "unknown",
    is_api_only: m.is_api_only ?? false,
    is_open_source: m.is_open_source ?? true,
    available_on: m.available_on ?? null,
    sources_merged: m.sources_merged ?? 1,
    openrouter_id: m.openrouter_id ?? null,
    short_description: m.short_description ?? null,
    description: m.description ?? null,
    image_url: m.image_url ?? null,
    huggingface_url: m.huggingface_url ?? null,
    ollama_url: m.ollama_url ?? null,
    openrouter_url: m.openrouter_url ?? null,
    github_url: m.github_url ?? null,
    paper_url: m.paper_url ?? null,
    official_url: m.official_url ?? null,
    top_provider: m.top_provider ?? null,
    per_request_limits: m.per_request_limits ?? null,
    canonical_slug: m.canonical_slug ?? null,
    huggingface_id: m.huggingface_id ?? null,
    created_timestamp: m.created_timestamp ?? null,
    supported_parameters: m.supported_parameters ?? null,
    default_parameters: m.default_parameters ?? null,
    datasets: m.datasets ?? null,
    languages: m.languages ?? null,
    architecture: m.architecture ?? null,
    is_featured: m.is_featured ?? false,
    last_modified: m.last_modified ?? null,
    created_at: m.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ---------- Source Fetchers ----------

async function fetchHfModelsForOrg(org: string) {
  const models: any[] = [];
  for (let page = 0; page < HF_MAX_PAGES; page++) {
    const url = `${HUGGINGFACE_API}/models?author=${encodeURIComponent(org)}&limit=${HF_MODELS_PER_PAGE}&skip=${page * HF_MODELS_PER_PAGE}&expand[]=cardData&expand[]=tags`;
    try {
      const res = await fetchWithRetry(url, { headers: { Authorization: `Bearer ${HF_API_KEY}`, "User-Agent": "ModelCollector/1.0" } });
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      for (const m of data) {
        if (m.id && (m.id.includes("lora") || m.id.includes("adapter"))) continue;
        const card = m.cardData || {};
        const modelObj: any = {
          name: (m.id && m.id.split("/")[1]) || m.id,
          model_id: m.id,
          huggingface_id: m.id,
          publisher: org,
          category: "LLM",
          task: m.pipeline_tag ? [m.pipeline_tag] : [],
          tags: m.tags || [],
          downloads: m.downloads || 0,
          likes: m.likes || 0,
          short_description: card.short_description || (card.description && card.description.slice(0, 300)) || null,
          description: card.description || null,
          huggingface_url: `https://huggingface.co/${m.id}`,
          source: "huggingface",
          created_timestamp: m.createdAt || null,
          last_modified: m.lastModified || null,
        };
        modelObj.canonical_model_id = computeCanonicalId(modelObj);
        models.push(modelObj);
      }
      if (data.length < HF_MODELS_PER_PAGE) break;
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error("HF fetch error for", org, (err as any).message || err);
      break;
    }
  }
  return models;
}

async function fetchOpenRouterModels() {
  try {
    const res = await fetchWithRetry(OPENROUTER_API, { headers: OPENROUTER_API_KEY ? { Authorization: `Bearer ${OPENROUTER_API_KEY}` } : {} });
    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      console.log("OpenRouter returned unexpected format");
      return [];
    }
    const models: any[] = [];
    for (const m of data.data) {
      const parts = (m.id || "").split("/");
      const publisher = parts.length >= 2 ? parts[0] : "openrouter";
      const name = parts.length >= 2 ? parts.slice(1).join("/") : m.id;
      const modelObj: any = {
        name: name,
        model_id: m.id,
        openrouter_id: m.id,
        publisher: publisher,
        category: "LLM",
        task: m.architecture?.modality ? [m.architecture?.modality] : [],
        tags: m.tags || [],
        short_description: m.description || null,
        description: m.description || null,
        openrouter_url: `https://openrouter.ai/models/${m.id}`,
        pricing: m.pricing || null,
        top_provider: m.top_provider || null,
        per_request_limits: m.per_request_limits || null,
        source: "openrouter",
        created_timestamp: m.created || null,
      };
      modelObj.canonical_model_id = computeCanonicalId(modelObj);
      models.push(modelObj);
    }
    return models;
  } catch (err) {
    console.error("OpenRouter fetch error", (err as any).message || err);
    return [];
  }
}

async function fetchOllamaModels() {
  try {
    const res = await fetchWithRetry(OLLAMA_LIBRARY_URL);
    const html = await res.text();
    const models: any[] = [];
    const nameRegex = /<h2[^>]*>([^<]+)<\/h2>/g;
    let match;
    while ((match = nameRegex.exec(html)) !== null) {
      const name = match[1].trim();
      if (!name || name.length > 80) continue;
      const modelObj: any = {
        name,
        model_id: `ollama/${name.replace(/\s+/g, "-")}`,
        publisher: "ollama",
        short_description: "Local Ollama model",
        description: null,
        ollama_url: `https://ollama.com/library/${encodeURIComponent(name)}`,
        source: "ollama",
      };
      modelObj.canonical_model_id = computeCanonicalId(modelObj);
      models.push(modelObj);
    }
    return models;
  } catch (err) {
    console.error("Ollama fetch error", (err as any).message || err);
    return [];
  }
}

// ---------- serve handler ----------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200 });

  try {
    const { data: orgRows } = await supabase.from("hf_organizations").select("org_name").eq("active", true);
    const orgs = (orgRows || []).map((r: any) => r.org_name);
    if (!orgs || orgs.length === 0) {
      orgs.push("meta-llama", "mistralai", "google", "stabilityai");
    }

    // Fetch HF per org serially (promises) and other sources in parallel
    const hfPromises: Promise<any[]>[] = [];
    for (const org of orgs) hfPromises.push(fetchHfModelsForOrg(org));

    const [hfResults, openrouterModels, ollamaModels] = await Promise.all([
      Promise.all(hfPromises),
      fetchOpenRouterModels(),
      fetchOllamaModels(),
    ]);

    const hfModels = hfResults.flat();
    const allModels = [...hfModels, ...openrouterModels, ...ollamaModels];

    // Save each source raw
    for (const m of allModels) {
      if (!m.canonical_model_id) m.canonical_model_id = computeCanonicalId(m);
      await saveModelSource(supabase, m);
    }

    // Dedupe & merge by canonical_model_id
    const grouped: Record<string, any[]> = {};
    for (const m of allModels) {
      const key = (m.canonical_model_id || computeCanonicalId(m)).toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    }

    const mergedModels: any[] = [];
    for (const [key, models] of Object.entries(grouped)) {
      const hf = models.find((x) => x.source === "huggingface" || x.huggingface_id);
      const or = models.find((x) => x.source === "openrouter" || x.openrouter_id);
      const oll = models.find((x) => x.source === "ollama" || x.ollama_url);
      const primary = hf || or || oll || models[0];
      const merged = { ...primary };

      for (const m of models) {
        if (m.huggingface_url) merged.huggingface_url = merged.huggingface_url || m.huggingface_url;
        if (m.openrouter_url) merged.openrouter_url = merged.openrouter_url || m.openrouter_url;
        if (m.ollama_url) merged.ollama_url = merged.ollama_url || m.ollama_url;

        if (m.downloads && (!merged.downloads || m.downloads > merged.downloads)) merged.downloads = m.downloads;
        if (m.likes && (!merged.likes || m.likes > merged.likes)) merged.likes = m.likes;

        merged.tags = [...new Set([...(merged.tags || []), ...(m.tags || [])])];
        merged.task = [...new Set([...(merged.task || []), ...(m.task || [])])];
        merged.quantizations = [...new Set([...(merged.quantizations || []), ...(m.quantizations || [])])];

        if (m.pricing && !merged.pricing) merged.pricing = m.pricing;
        if (m.short_description && (!merged.short_description || m.short_description.length > merged.short_description.length)) merged.short_description = m.short_description;
        if (m.description && (!merged.description || m.description.length > (merged.description || "").length)) merged.description = m.description;

        if (m.parameters && (!merged.parameters || m.parameters > merged.parameters)) {
          merged.parameters = m.parameters;
          merged.parameters_display = m.parameters_display || merged.parameters_display;
        }

        if (m.context_window && (!merged.context_window || m.context_window > merged.context_window)) merged.context_window = m.context_window;
        if (m.hardware_requirements && !merged.hardware_requirements) merged.hardware_requirements = m.hardware_requirements;
      }

      merged.available_on = [...new Set(models.map((x) => x.source))];
      merged.sources_merged = models.length;
      merged.canonical_model_id = key;
      merged.model_id = merged.model_id || (merged.huggingface_id ? merged.huggingface_id : merged.openrouter_id ? merged.openrouter_id : `${key.replace(":", "/")}`);

      mergedModels.push(merged);
    }

    // Upsert canonical models
    const batchSize = 100;
    let upserted = 0;
    for (let i = 0; i < mergedModels.length; i += batchSize) {
      const chunk = mergedModels.slice(i, i + batchSize).map(mapModelToRow);
      const { error } = await supabase.from("ai_models").upsert(chunk, { onConflict: "canonical_model_id" });
      if (error) console.error("upsert error", error.message || error);
      else upserted += chunk.length;
    }

    // Enqueue readme tasks for HF models (simple enqueue; worker will dedupe)
    for (const m of mergedModels) {
      if (m.available_on && m.available_on.includes("huggingface")) {
        try {
          const { data, error } = await supabase.from("task_queue").insert([
            {
              task_type: "fetch_readme",
              payload: { canonical_model_id: m.canonical_model_id, huggingface_url: m.huggingface_url, model_id: m.model_id },
              scheduled_at: new Date().toISOString(),
            },
          ]);
          if (error) {
            // ignore duplicate / conflict style errors if needed, otherwise log
            console.error("task_queue insert error", error.message || error);
          }
        } catch (e) {
          console.error("task_queue insert exception", (e as any).message || e);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: `Collected and upserted ${upserted} models`, stats: { total_collected: allModels.length, canonical: mergedModels.length } }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("collector fatal", err);
    return new Response(JSON.stringify({ error: (err as any).message || `${err}` }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
