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
    const { type, context, fieldToRefine, currentText } = await req.json();
    console.log('Received request:', { type, context });
    
    const apiKey = Deno.env.get("GEMINI_API_KEY") as string;
    if (!apiKey) return new Response("Missing Gemini API key", { status: 500 });

    let prompt = "";
    
    // Prompts específicos para cada tipo de campo
    switch (type) {
      case "refine":
        prompt = `Você é um assistente especializado em redação de currículos profissionais.

Texto atual para refinar: "${currentText}"

Contexto da experiência profissional: ${JSON.stringify(context, null, 2)}

Refine e melhore o texto atual, tornando-o mais profissional, impactante e adequado para um currículo. 
Mantenha as informações essenciais, mas melhore a estrutura, gramática e impacto.
Seja conciso e objetivo.
Responda apenas com o texto refinado, sem explicações ou comentários adicionais.`;
        break;
      case "context":
        prompt = `Você é um assistente especializado em redação de currículos profissionais.
        
Contexto da experiência profissional:\n${JSON.stringify(context, null, 2)}\n
Crie uma descrição concisa e impactante (máximo 2 frases) do CONTEXTO do projeto ou da sua função na experiência profissional. 
Considere o cargo, a empresa e o contexto fornecido.
Responda apenas com o texto sugerido, sem explicações ou comentários adicionais.`;
        break;
      case "problems":
        prompt = `Você é um assistente especializado em redação de currículos profissionais.
        
Contexto da experiência profissional:\n${JSON.stringify(context, null, 2)}\n
Crie uma descrição concisa e impactante (máximo 2 frases) do PROBLEMA ou NECESSIDADE que existia na empresa/projeto antes da atuação da pessoa. 
Considere o cargo, a empresa e o contexto fornecido.
Se for um projeto pessoal, foque na necessidade que motivou o projeto.
Responda apenas com o texto sugerido, sem explicações ou comentários adicionais.`;
        break;
      case "solutions":
        prompt = `Você é um assistente especializado em redação de currículos profissionais.
        
Contexto da experiência profissional:\n${JSON.stringify(context, null, 2)}\n
Crie uma descrição concisa e impactante (máximo 3 frases) da SOLUÇÃO implementada pela pessoa para resolver o problema mencionado.
Utilize verbos de ação no passado e seja específico sobre as ações tomadas.
Se possível, mencione tecnologias relevantes utilizadas.
Responda apenas com o texto sugerido, sem explicações ou comentários adicionais.`;
        break;
      case "technologies":
        prompt = `Você é um assistente especializado em redação de currículos profissionais.
        
Contexto da experiência profissional:\n${JSON.stringify(context, null, 2)}\n
Liste as tecnologias, ferramentas, metodologias e frameworks que provavelmente foram utilizados nesta experiência profissional, considerando o cargo, empresa, problema e solução descritos.
Formate como uma lista separada por vírgulas, sem bullets ou numeração.
Responda apenas com o texto sugerido, sem explicações ou comentários adicionais.`;
        break;
      case "impact":
        prompt = `Você é um assistente especializado em redação de currículos profissionais.
        
Contexto da experiência profissional:\n${JSON.stringify(context, null, 2)}\n
Crie uma descrição concisa e impactante (máximo 2 frases) dos RESULTADOS e IMPACTOS obtidos com a solução implementada.
Se possível, inclua métricas quantitativas (percentuais, valores, tempo economizado, etc).
Responda apenas com o texto sugerido, sem explicações ou comentários adicionais.`;
        break;
      default:
        prompt = `Dado o seguinte contexto de experiência profissional:\n${JSON.stringify(context, null, 2)}\nSugira um texto para a etapa: ${type}. Responda apenas com o texto sugerido, sem explicações ou comentários.`;
    }

    console.log('Final prompt to Gemini:', prompt);
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
    console.error('Error in field-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});