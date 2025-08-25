// Follow the Deno runtime API: https://deno.com/manual@v1.28.3/examples/http_server
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Received request for STAR text generation:', { prompt });
    const apiKey = Deno.env.get("GEMINI_API_KEY") as string;
    if (!apiKey) return new Response("Missing Gemini API key", { status: 500 });


    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2000
          }
        })
      }
    );
    const geminiData = await geminiRes.json();
    console.log('Gemini API response:', JSON.stringify(geminiData));
    const suggestion = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ suggestion, geminiRaw: geminiData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
