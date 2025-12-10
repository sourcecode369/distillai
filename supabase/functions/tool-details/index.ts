import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { toolName } = await req.json()

    if (!toolName) {
      throw new Error('toolName is required')
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Check if tool details already exist in DB
    const { data: existingTool, error: dbError } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('name', toolName)
      .single()

    if (existingTool && existingTool.details) {
      console.log(`Cache hit for: ${toolName}`)
      // Return cached details merged with actual metadata from DB
      return new Response(
        JSON.stringify({
          ...existingTool.details,
          github_stars: existingTool.github_stars,
          official_docs_url: existingTool.official_docs_url,
          github_url: existingTool.github_url
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    console.log(`Cache miss for: ${toolName}. Generating with Gemini...`)

    // 2. Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // Prepare context from database metadata
    const toolContext = existingTool ? `
Tool: ${toolName}
Description: ${existingTool.short_description || 'N/A'}
GitHub: ${existingTool.github_url || 'N/A'}
Docs: ${existingTool.official_docs_url || 'N/A'}
Stars: ${existingTool.github_stars || 'N/A'}
Category: ${existingTool.category || 'N/A'}` : `Tool: ${toolName}`;

    const prompt = `
You are an expert AI engineer. Provide detailed technical insights for this AI tool:

${toolContext}

Return a JSON object with this structure:
{
  "overview": "Brief 2-3 sentence technical description",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "use_cases": ["Use Case 1", "Use Case 2", "Use Case 3", "Use Case 4"],
  "code_example": {
    "language": "python or javascript or bash or rust as appropriate",
    "code": "Short, realistic, copy-pasteable code snippet"
  },
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2"],
  "ecosystem": ["Related Tool 1", "Related Tool 2", "Related Tool 3"]
}

DO NOT include github_stars, official_docs_url, or github_url - these are provided separately.
No markdown formatting, just raw JSON.
    `

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API Error: ${geminiResponse.status} ${geminiResponse.statusText}`, errorText);
      throw new Error(`Gemini API failed: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error('Gemini returned no candidates:', geminiData);
      throw new Error('Gemini returned no content.');
    }

    let generatedText = geminiData.candidates[0].content.parts[0].text;

    // Robust JSON cleanup
    generatedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    // Sometimes Gemini adds "Here is the JSON..." or similar text, try to find the first { and last }
    const firstBrace = generatedText.indexOf('{');
    const lastBrace = generatedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      generatedText = generatedText.substring(firstBrace, lastBrace + 1);
    }

    let result;
    try {
      result = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Generated Text:', generatedText);
      throw new Error('Failed to parse Gemini response as JSON.');
    }

    // Add real metadata from database to the result
    const completeResult = {
      ...result,
      github_stars: existingTool?.github_stars || null,
      official_docs_url: existingTool?.official_docs_url || null,
      github_url: existingTool?.github_url || null
    };

    // 4. Cache in DB (store only Gemini-generated content)
    const { error: updateError } = await supabase
      .from('ai_tools')
      .update({
        details: result,
        last_updated: new Date().toISOString()
      })
      .eq('name', toolName);

    if (updateError) {
      console.error('Supabase Update Error:', updateError);
    }

    // Return complete result with metadata
    return new Response(
      JSON.stringify(completeResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Edge Function Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    )
  }
})
