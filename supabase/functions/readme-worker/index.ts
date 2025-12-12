// functions/readme-worker/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const HF_API_KEY = Deno.env.get("HF_API_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function claimNextJob() {
  const { data } = await supabase.from("task_queue").select("*").eq("status", "pending").order("scheduled_at", { ascending: true }).limit(1);
  if (!data || data.length === 0) return null;
  const job = data[0];
  const { error } = await supabase.from("task_queue").update({ status: "in_progress", attempts: job.attempts + 1, updated_at: new Date().toISOString() }).eq("id", job.id);
  if (error) { console.error("claim err", error); return null; }
  return job;
}

async function fetchReadmeFromHf(hfUrlOrSlug: string) {
  let slug = hfUrlOrSlug || "";
  try {
    if (slug.startsWith("https://") || slug.startsWith("http://")) {
      slug = new URL(slug).pathname.replace(/^\//, "");
    }
  } catch { }
  const url = `https://huggingface.co/${slug}/raw/main/README.md`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${HF_API_KEY}`, "User-Agent": "ReadmeWorker/1.0" } });
    if (!res.ok) {
      if (res.status === 404) return { status: 404, text: "" };
      throw new Error(`HTTP ${res.status}`);
    }
    const txt = await res.text();
    return { status: 200, text: txt };
  } catch (err) {
    return { status: 500, text: "", error: (err as any).message || `${err}` };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200 });

  try {
    const job = await claimNextJob();
    if (!job) return new Response(JSON.stringify({ ok: true, message: "no jobs" }), { status: 200, headers: { "Content-Type": "application/json" } });

    const payload = job.payload || {};
    const canonical_model_id = payload.canonical_model_id;
    const model_id = payload.model_id;
    const hfUrl = payload.huggingface_url || model_id;

    const res = await fetchReadmeFromHf(hfUrl);
    if (res.status === 200) {
      const snippet = res.text.slice(0, 800);
      const { error: upsertErr } = await supabase.from("model_readmes").upsert([{
        canonical_model_id,
        model_id,
        readme: res.text,
        snippet,
        readme_source: "huggingface",
        fetched_at: new Date().toISOString()
      }], { onConflict: ["canonical_model_id", "readme_source"] });

      if (upsertErr) {
        await supabase.from("task_queue").update({ status: "failed", last_error: upsertErr.message || upsertErr, updated_at: new Date().toISOString() }).eq("id", job.id);
        return new Response(JSON.stringify({ ok: false, error: upsertErr.message || upsertErr }), { status: 500 });
      }

      // mark source row (if exists)
      await supabase.from("model_sources").update({ source_meta: { readme_fetched: true, readme_snippet: snippet } }).eq("canonical_model_id", canonical_model_id).eq("source", "huggingface").catch(() => { });

      await supabase.from("task_queue").update({ status: "done", updated_at: new Date().toISOString() }).eq("id", job.id);
      return new Response(JSON.stringify({ ok: true, result: "readme saved" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      await supabase.from("task_queue").update({ status: "failed", last_error: res.error || `status ${res.status}`, updated_at: new Date().toISOString() }).eq("id", job.id);
      return new Response(JSON.stringify({ ok: false, status: res.status, error: res.error }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    console.error("worker fatal", err);
    return new Response(JSON.stringify({ error: (err as any).message || `${err}` }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
