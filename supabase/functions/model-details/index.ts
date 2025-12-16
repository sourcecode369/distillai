import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to extract benchmarks from markdown tables
function extractBenchmarksFromTables(content: string): Array<{name: string, score: number | string, unit: string}> {
  const benchmarks: Array<{name: string, score: number | string, unit: string}> = []

  // Common benchmark names to look for (case-insensitive)
  const benchmarkPatterns = [
    // General AI benchmarks
    /(?:^|\s)(MMLU|Massive Multitask Language Understanding)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(HumanEval|Human\s*Eval)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(GSM8K|GSM-8K|Grade School Math)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(HellaSwag|Hella\s*Swag)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(ARC|AI2 Reasoning Challenge)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(TruthfulQA|Truthful\s*QA)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(WinoGrande|Wino\s*Grande)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(DROP)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(BBH|Big Bench Hard)[\s:]+([0-9.]+)\s*(%|points?)?/im,

    // Vision benchmarks
    /(?:^|\s)(ImageNet|Image\s*Net)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(top[-\s]?1|top1|accuracy)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(top[-\s]?5|top5)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(COCO)[\s:]+([0-9.]+)\s*(%|points?|mAP)?/im,

    // Code benchmarks
    /(?:^|\s)(MBPP)[\s:]+([0-9.]+)\s*(%|points?)?/im,
    /(?:^|\s)(CodeXGLUE)[\s:]+([0-9.]+)\s*(%|points?)?/im,
  ]

  // Try to extract from benchmark patterns
  for (const pattern of benchmarkPatterns) {
    const match = content.match(pattern)
    if (match) {
      const name = match[1].trim()
      const score = parseFloat(match[2])
      const unit = match[3] || '%'

      // Avoid duplicates
      if (!benchmarks.some(b => b.name.toLowerCase() === name.toLowerCase())) {
        benchmarks.push({ name, score, unit })
      }
    }
  }

  // Try to extract from markdown tables
  // Look for tables with benchmark-like headers
  const tableRegex = /\|[^\n]+\|\n\|[-:\s|]+\|\n((?:\|[^\n]+\|\n?)+)/g
  let tableMatch: RegExpExecArray | null

  while ((tableMatch = tableRegex.exec(content)) !== null) {
    const headerRow = content.slice(Math.max(0, tableMatch.index - 200), tableMatch.index).split('\n').pop() || ''
    const tableContent = tableMatch[0]

    // Check if this table looks like a benchmark table
    const isBenchmarkTable = /top[-\s]?[15]|accuracy|score|mmlu|humaneval|imagenet/i.test(headerRow + tableContent)

    if (isBenchmarkTable) {
      // Parse header to find column indices
      const headers = headerRow.split('|').map(h => h.trim().toLowerCase())
      const rows = tableContent.split('\n').filter((line: string) => line.includes('|') && !line.includes('---'))

      // Find score columns (top1, top5, accuracy, etc.)
      const scoreColumns = headers.map((h, i) => {
        if (/top[-\s]?1|accuracy/i.test(h)) return { index: i, name: 'Top-1 Accuracy' }
        if (/top[-\s]?5/i.test(h)) return { index: i, name: 'Top-5 Accuracy' }
        if (/mmlu/i.test(h)) return { index: i, name: 'MMLU' }
        return null
      }).filter((col): col is { index: number, name: string } => col !== null)

      // Extract first row's scores (usually the current model)
      if (rows.length > 0 && scoreColumns.length > 0) {
        const firstRow = rows[0].split('|').map((c: string) => c.trim())

        for (const col of scoreColumns) {
          const value = firstRow[col.index]
          if (value) {
            const scoreMatch = value.match(/([0-9.]+)/)
            if (scoreMatch) {
              const score = parseFloat(scoreMatch[1])
              if (!benchmarks.some(b => b.name.toLowerCase() === col.name.toLowerCase())) {
                benchmarks.push({ name: col.name, score, unit: '%' })
              }
            }
          }
        }
      }
    }
  }

  // Limit to top 5 most relevant benchmarks
  return benchmarks.slice(0, 5)
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { modelId } = await req.json()

    if (!modelId) {
      throw new Error('modelId is required')
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Check if model details already exist in DB
    // Use limit(1) instead of single() to handle potential duplicates gracefully
    const { data: models, error: dbError } = await supabase
      .from('models_catalog')
      .select('*')
      .eq('model_id', modelId)
      .limit(1)

    if (dbError) {
      console.error('Database Error:', dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }

    const existingModel = models && models.length > 0 ? models[0] : null

    if (!existingModel) {
      console.error('Model not found in database:', modelId)
      throw new Error(`Model not found: ${modelId}`)
    }

    // Check for cached AI insights
    if (existingModel.ai_insights) {
      console.log(`Cache hit for model: ${modelId}`)
      return new Response(
        JSON.stringify(existingModel.ai_insights),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    console.log(`Cache miss for model: ${modelId}. Generating with Gemini...`)
    console.log('Model data:', JSON.stringify({
      access_type: existingModel.access_type,
      links: existingModel.links,
      model_id: existingModel.model_id
    }))

    // 2. Determine model type, URL, and fetch enriched data from APIs
    let modelUrl = ''
    let modelType = ''
    let enrichedData: any = {}

    // Check which platform links are available
    // (access_type is now an array in DB but we determine platform by checking links)

    // Check for HuggingFace
    if (existingModel.links?.huggingface !== undefined) {
      // Construct URL from model_id if links.huggingface is empty
      modelUrl = existingModel.links.huggingface || `https://huggingface.co/${existingModel.model_id}`
      modelType = 'huggingface'

      // Fetch enriched data from HuggingFace API
      try {
        const hfModelId = existingModel.model_id
        const hfApiUrl = `https://huggingface.co/api/models/${hfModelId}`
        console.log(`Fetching HuggingFace API data: ${hfApiUrl}`)

        const hfResponse = await fetch(hfApiUrl)
        if (hfResponse.ok) {
          const hfData = await hfResponse.json()
          enrichedData = {
            parameters: hfData.safetensors?.total || null,
            context_window: hfData.config?.max_position_embeddings || hfData.config?.n_positions || null,
            architecture: hfData.config?.architectures?.[0] || null,
            library: hfData.library_name || null,
          }
          console.log('Enriched data from HF API:', enrichedData)

          // Update database with enriched data
          await supabase.from('models_catalog').update({
            parameters: enrichedData.parameters,
            context_window: enrichedData.context_window,
          }).eq('model_id', modelId)
        }
      } catch (hfError) {
        console.error('Failed to fetch HF API data:', hfError)
      }
    }
    // Check for Ollama
    else if (existingModel.links?.ollama !== undefined) {
      // Construct URL from model_id if links.ollama is empty
      modelUrl = existingModel.links.ollama || `https://ollama.com/library/${existingModel.model_id}`
      modelType = 'ollama'
    }
    // Check for OpenRouter
    else if (existingModel.links?.openrouter !== undefined) {
      // Construct URL from model_id if links.openrouter is empty
      modelUrl = existingModel.links.openrouter || `https://openrouter.ai/models/${existingModel.openrouter_id || existingModel.model_id}`
      modelType = 'openrouter'

      // Fetch enriched data from OpenRouter API
      try {
        const orModelId = existingModel.openrouter_id || existingModel.model_id
        const orApiUrl = `https://openrouter.ai/api/v1/models/${orModelId}`
        console.log(`Fetching OpenRouter API data: ${orApiUrl}`)

        const orResponse = await fetch(orApiUrl)
        if (orResponse.ok) {
          const orData = await orResponse.json()
          const modelData = orData.data

          // Extract max output tokens from top_provider
          const maxOutputTokens = modelData.top_provider?.max_completion_tokens || null

          enrichedData = {
            context_window: modelData.context_length || null,
            max_output_tokens: maxOutputTokens,
            pricing: modelData.pricing ? {
              prompt: parseFloat(modelData.pricing.prompt) * 1000000,  // Convert to per 1M tokens
              completion: parseFloat(modelData.pricing.completion) * 1000000
            } : null,
          }
          console.log('Enriched data from OpenRouter API:', enrichedData)

          // Update database with enriched data
          await supabase.from('models_catalog').update({
            context_window: enrichedData.context_window,
            pricing: enrichedData.pricing,
            max_output_tokens: enrichedData.max_output_tokens,
          }).eq('model_id', modelId)
        }
      } catch (orError) {
        console.error('Failed to fetch OpenRouter API data:', orError)
      }
    }

    if (!modelUrl) {
      console.error('No URL found. Model data:', {
        access_type: existingModel.access_type,
        links: existingModel.links,
        available_on: existingModel.available_on
      })
      throw new Error(`No valid URL found for model. Access type: ${existingModel.access_type}, Links: ${JSON.stringify(existingModel.links)}`)
    }

    // 3. Fetch content based on model type
    let contentForGemini = ''
    let extractedMetadata: any = {}

    if (modelType === 'huggingface') {
      // For HuggingFace, fetch raw README.md instead of HTML page
      const readmeUrl = `https://huggingface.co/${existingModel.model_id}/raw/main/README.md`
      console.log(`Fetching HuggingFace README from: ${readmeUrl}`)

      try {
        const readmeResponse = await fetch(readmeUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; xbuildsai/1.0;)'
          }
        })

        if (readmeResponse.ok) {
          contentForGemini = await readmeResponse.text()
          console.log(`Successfully fetched README (${contentForGemini.length} chars)`)

          // Parse YAML frontmatter for license and language
          const yamlMatch = contentForGemini.match(/^---\n([\s\S]*?)\n---/)
          if (yamlMatch) {
            const yamlContent = yamlMatch[1]

            // Extract license
            const licenseMatch = yamlContent.match(/license:\s*(.+)/)
            if (licenseMatch) {
              extractedMetadata.license = licenseMatch[1].trim()
            }

            // Extract language (can be array or single value)
            const languageMatch = yamlContent.match(/language:\s*\n((?:- .+\n)+)/)
            if (languageMatch) {
              const languages = languageMatch[1].match(/- (.+)/g)?.map(l => l.replace('- ', '').trim())
              extractedMetadata.language = languages?.join(', ')
            } else {
              const singleLangMatch = yamlContent.match(/language:\s*(.+)/)
              if (singleLangMatch) {
                extractedMetadata.language = singleLangMatch[1].trim()
              }
            }
          }

          // Extract paper and blog links from markdown content
          // Try inline markdown format first: [paper](url)
          let paperMatch = contentForGemini.match(/\[paper\]\(([^)]+)\)/i)
          if (paperMatch) {
            extractedMetadata.paper_url = paperMatch[1]
          } else {
            // Try bulleted list format in Papers section: - **Papers:** or ## Papers:
            const papersSection = contentForGemini.match(/(?:##?\s*Papers?:?|[\*\-]\s*\*\*Papers?:?\*\*)\s*\n([\s\S]*?)(?=\n##|\n-\s*\*\*|$)/i)
            if (papersSection) {
              // Extract first arxiv or similar URL
              const urlMatch = papersSection[1].match(/https?:\/\/(?:arxiv\.org|openreview\.net|aclanthology\.org|proceedings\.mlr\.press)[^\s)]+/i)
              if (urlMatch) {
                extractedMetadata.paper_url = urlMatch[0]
              }
            }
          }

          // Try inline markdown format first: [blog](url)
          let blogMatch = contentForGemini.match(/\[(?:blog|release blog post|blog post)\]\(([^)]+)\)/i)
          if (blogMatch) {
            extractedMetadata.blog_url = blogMatch[1]
          } else {
            // Look for blog/announcement URLs in common patterns
            const blogUrlMatch = contentForGemini.match(/(?:blog|announcement|release).*?(https?:\/\/[^\s)]+(?:blog|news|announcement)[^\s)]*)/i)
            if (blogUrlMatch) {
              extractedMetadata.blog_url = blogUrlMatch[1]
            }
          }

          // Extract benchmarks from tables in README
          const benchmarks = extractBenchmarksFromTables(contentForGemini)
          if (benchmarks.length > 0) {
            extractedMetadata.benchmarks = benchmarks
            console.log(`Extracted ${benchmarks.length} benchmarks from tables:`)
            console.log(JSON.stringify(benchmarks, null, 2))
          } else {
            console.log('No benchmarks extracted from README tables')
          }

          console.log('Extracted metadata:', JSON.stringify(extractedMetadata, null, 2))
        } else {
          // Fallback: try README without extension
          console.log('README.md not found, trying README...')
          const readmeAltUrl = `https://huggingface.co/${existingModel.model_id}/raw/main/README`
          const readmeAltResponse = await fetch(readmeAltUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; xbuildsai/1.0;)'
            }
          })

          if (readmeAltResponse.ok) {
            contentForGemini = await readmeAltResponse.text()
            console.log(`Successfully fetched README alt (${contentForGemini.length} chars)`)
          } else {
            // Last resort: fetch HTML page
            console.log('README not found, falling back to HTML page...')
            const htmlResponse = await fetch(modelUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; xbuildsai/1.0;)'
              }
            })
            if (htmlResponse.ok) {
              contentForGemini = await htmlResponse.text()
            } else {
              throw new Error(`Failed to fetch model content: ${htmlResponse.statusText}`)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching HuggingFace README:', error)
        throw new Error(`Failed to fetch HuggingFace content: ${error.message}`)
      }
    } else {
      // For other types (OpenRouter, Ollama), fetch HTML page
      console.log(`Fetching content from: ${modelUrl}`)
      const urlResponse = await fetch(modelUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; xbuildsai/1.0;)'
        }
      })

      if (!urlResponse.ok) {
        console.error(`Failed to fetch URL: ${urlResponse.status}`)
        throw new Error(`Failed to fetch model page: ${urlResponse.statusText}`)
      }

      contentForGemini = await urlResponse.text()
    }

    // 4. Call Gemini API with URL content
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // Prepare context with enriched data
    let pricingInfo = '';
    if (enrichedData.pricing) {
      pricingInfo = `
Pricing (per 1M tokens):
- Input: $${enrichedData.pricing.prompt.toFixed(2)}
- Output: $${enrichedData.pricing.completion.toFixed(2)}`;
    }

    let technicalInfo = '';
    if (enrichedData.context_window) {
      technicalInfo += `\nContext Window: ${enrichedData.context_window} tokens`;
    }
    if (enrichedData.max_output_tokens) {
      technicalInfo += `\nMax Output Tokens: ${enrichedData.max_output_tokens} tokens`;
    }
    if (enrichedData.parameters) {
      technicalInfo += `\nParameters: ${enrichedData.parameters}`;
    }
    if (enrichedData.architecture) {
      technicalInfo += `\nArchitecture: ${enrichedData.architecture}`;
    }

    // Add benchmark info if extracted
    let benchmarkInfo = '';
    const hasBenchmarks = extractedMetadata.benchmarks && extractedMetadata.benchmarks.length > 0;
    if (hasBenchmarks) {
      benchmarkInfo = `\nBenchmarks (extracted from README):\n${extractedMetadata.benchmarks.map((b: any) => `- ${b.name}: ${b.score}${b.unit}`).join('\n')}`;
    }

    const modelContext = `
Model Name: ${existingModel.name}
Publisher: ${existingModel.publisher}
Model Type: ${modelType}
Access: ${existingModel.access_type}
Category: ${existingModel.category}
Parameters: ${existingModel.parameters_display || 'Unknown'}
URL: ${modelUrl}${pricingInfo}${technicalInfo}${benchmarkInfo}
`

    // Create type-specific prompt
    let prompt = `
You are an expert AI engineer analyzing this AI model. Based on the following model information and the ${modelType === 'huggingface' ? 'README' : 'webpage'} content provided, generate comprehensive technical insights.

${modelContext}

${modelType === 'huggingface' ? 'README CONTENT' : 'WEBPAGE CONTENT'}:
${contentForGemini.slice(0, 50000)}

Generate a JSON response with the following structure:`

    if (modelType === 'huggingface') {
      prompt += `
{
  "summary": "2-3 sentence plain-language explanation of what this model does and who it's for",
  "key_strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "best_use_cases": ["Use case 1", "Use case 2", "Use case 3", "Use case 4", "Use case 5"],
  "considerations": ["Limitation or consideration 1", "Limitation 2", "Limitation 3"],`

      // Add benchmark instructions based on whether we extracted them
      if (hasBenchmarks) {
        prompt += `
  "benchmarks": ${JSON.stringify(extractedMetadata.benchmarks)},`
      } else {
        prompt += `
  "benchmarks": [
    {"name": "Benchmark Name", "score": 85.5, "unit": "%"}
  ], // IMPORTANT: Only include if benchmarks are found in the README. Extract actual scores, do NOT generate or estimate. Return empty array [] if no benchmarks found.`
      }

      prompt += `
  "getting_started": {
    "installation": "Brief installation instructions",
    "code_snippet": "Python code example using transformers library"
  },
  "hardware_requirements": {
    "minimum_ram": "e.g., 16GB",
    "gpu_recommendation": "e.g., RTX 3090 or better",
    "quantization_options": "Brief explanation of available quantizations"
  },
  "architecture_details": {
    "base_architecture": "e.g., Llama 2, Mistral, GPT",
    "training_approach": "Brief description of how it was trained"
  },
  "performance_notes": "2-3 sentences about speed/quality trade-offs"
}`
    } else if (modelType === 'openrouter') {
      prompt += `
{
  "summary": "2-3 sentence plain-language explanation of what this model does and who it's for",
  "key_strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "best_use_cases": ["Use case 1", "Use case 2", "Use case 3", "Use case 4", "Use case 5"],
  "considerations": ["Limitation or consideration 1", "Limitation 2", "Limitation 3"],`

      // Add benchmark instructions
      if (hasBenchmarks) {
        prompt += `
  "benchmarks": ${JSON.stringify(extractedMetadata.benchmarks)},`
      } else {
        prompt += `
  "benchmarks": [], // IMPORTANT: Extract ONLY if found in content. Do NOT generate or estimate.`
      }

      prompt += `
  "api_integration": {
    "quick_start": "Brief explanation of how to use the API",
    "code_snippet": "Python or JavaScript code example"
  },
  "pricing_insights": {
    "cost_analysis": "Brief analysis of pricing compared to alternatives",
    "cost_optimization": "Tips for optimizing costs"
  },
  "limits_and_performance": {
    "rate_limits": "Information about rate limits",
    "response_time": "Expected response time",
    "reliability": "Uptime and reliability notes"
  },
  "context_and_features": {
    "context_details": "Explanation of context window",
    "special_capabilities": ["Feature 1", "Feature 2"]
  }
}`
    } else if (modelType === 'ollama') {
      prompt += `
{
  "summary": "2-3 sentence plain-language explanation of what this model does and who it's for",
  "key_strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "best_use_cases": ["Use case 1", "Use case 2", "Use case 3", "Use case 4", "Use case 5"],
  "considerations": ["Limitation or consideration 1", "Limitation 2", "Limitation 3"],`

      // Add benchmark instructions
      if (hasBenchmarks) {
        prompt += `
  "benchmarks": ${JSON.stringify(extractedMetadata.benchmarks)},`
      } else {
        prompt += `
  "benchmarks": [], // IMPORTANT: Extract ONLY if found in content. Do NOT generate or estimate.`
      }

      prompt += `
  ],
  "installation": {
    "command": "ollama pull command",
    "setup_instructions": "Brief setup instructions"
  },
  "system_requirements": {
    "ram_per_quant": "RAM needed for different quantizations",
    "cpu_vs_gpu": "Recommendations for CPU vs GPU usage",
    "storage_space": "Required storage space"
  },
  "quantization_guide": {
    "available_quants": ["Q4_K_M", "Q5_K_M", "Q8_0", "etc"],
    "quality_vs_speed": "Explanation of trade-offs",
    "recommendations": "Which quantization to choose based on hardware"
  },
  "performance_expectations": {
    "tokens_per_second": "Typical speed estimates",
    "quality_comparison": "Quality differences between quantizations"
  }
}`
    }

    prompt += `

Return ONLY valid JSON with no markdown formatting or additional text. Be specific and technical while remaining accessible.`

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
    const firstBrace = generatedText.indexOf('{');
    const lastBrace = generatedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      generatedText = generatedText.substring(firstBrace, lastBrace + 1);
    }

    let result;
    try {
      result = JSON.parse(generatedText);
      console.log('=== GEMINI GENERATED RESPONSE ===')
      console.log(JSON.stringify(result, null, 2))
      console.log('=================================')
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Generated Text:', generatedText);
      throw new Error('Failed to parse Gemini response as JSON.');
    }

    // Add model type and extracted metadata to result
    const completeResult = {
      ...result,
      model_type: modelType,
      generated_at: new Date().toISOString(),
      // Add extracted metadata (license, language, links)
      ...(extractedMetadata.license && { license: extractedMetadata.license }),
      ...(extractedMetadata.language && { language: extractedMetadata.language }),
      ...(extractedMetadata.paper_url && { paper_url: extractedMetadata.paper_url }),
      ...(extractedMetadata.blog_url && { blog_url: extractedMetadata.blog_url }),
    };

    // 5. Cache in DB
    const { error: updateError } = await supabase
      .from('models_catalog')
      .update({
        ai_insights: completeResult,
        last_updated: new Date().toISOString()
      })
      .eq('model_id', modelId);

    if (updateError) {
      console.error('Supabase Update Error:', updateError);
    }

    // Return complete result
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
