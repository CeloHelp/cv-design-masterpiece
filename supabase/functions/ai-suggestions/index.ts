// Follow the Deno runtime API: https://deno.com/manual@v1.28.3/examples/http_server
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context, text } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return new Response("Missing Gemini API key", { status: 500 });

    let prompt = "";
    if (type === "improve" && text) {
      prompt = `Melhore o seguinte texto para deixá-lo mais profissional e claro:\n\n"${text}"`;
    } else {
      prompt = `Dado o seguinte contexto de experiência profissional:\n${JSON.stringify(context, null, 2)}\nSugira um texto para a etapa: ${type}.`;
    }

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
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