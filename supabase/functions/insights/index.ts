import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { sourceUrl } = await req.json()

    if (!sourceUrl) {
      throw new Error('sourceUrl is required')
    }

    console.log(`Fetching content from: ${sourceUrl}`)

    // 1. Fetch the page content
    const response = await fetch(sourceUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`)
    }
    const html = await response.text()

    // 2. Extract text content (simple HTML stripping)
    // Remove scripts and styles first
    let text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ')
    // Decode entities (basic)
    text = text.replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim()

    // Truncate if too long (Gemini has a large context, but let's be safe and efficient)
    const maxLength = 50000
    if (text.length > maxLength) {
      text = text.substring(0, maxLength)
    }

    console.log(`Extracted ${text.length} characters of text`)

    // 3. Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const prompt = `
      You are an expert AI researcher and technical analyst. Analyze the following text from a research article/webpage:
      
      "${text}"
      
      Please provide a comprehensive analysis with the following sections:
      1. **Executive Summary**: A high-level overview of the main contribution (max 3 sentences).
      2. **Key Innovations**: Bullet points highlighting the specific technical or methodological advancements.
      3. **Technical Deep Dive**: A brief explanation of the core mechanism, architecture, or algorithm used.
      4. **Future Implications**: How this work impacts the field of AI or potential real-world applications.
      
      Format the output as a JSON object with the following keys: 
      - "summary" (string)
      - "innovations" (array of strings)
      - "technical_details" (string)
      - "implications" (string)
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
      const errorData = await geminiResponse.text()
      console.error('Gemini API Error:', errorData)
      throw new Error(`Gemini API failed: ${geminiResponse.statusText}`)
    }

    const geminiData = await geminiResponse.json()
    let generatedText = geminiData.candidates[0].content.parts[0].text

    // Clean up the response if it contains markdown code blocks
    generatedText = generatedText.replace(/```json\n?|\n?```/g, '').trim()

    // Parse the JSON response from Gemini
    let result
    try {
      result = JSON.parse(generatedText)
    } catch (e) {
      // Fallback if JSON parsing fails (though responseMimeType should prevent this)
      console.error("Failed to parse Gemini JSON response", e)
      result = { summary: generatedText, innovations: [], technical_details: "", implications: "" }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
