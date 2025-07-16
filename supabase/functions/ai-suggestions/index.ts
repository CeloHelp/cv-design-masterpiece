import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();

    let prompt = '';
    
    switch (type) {
      case 'description':
        prompt = `Gere uma descrição profissional para a experiência de trabalho com os seguintes dados:
Empresa: ${context.company}
Cargo: ${context.position}
Período: ${context.startDate} - ${context.endDate}

Crie uma descrição de 2-3 frases que destaque responsabilidades e contribuições relevantes para o cargo. Seja específico e profissional.`;
        break;
        
      case 'problems':
        prompt = `Sugira 2-3 problemas/desafios comuns que alguém no cargo de ${context.position} na empresa ${context.company} poderia enfrentar. Seja específico e relevante ao contexto profissional.`;
        break;
        
      case 'solutions':
        prompt = `Sugira 2-3 soluções práticas para os problemas: ${context.problems}. Foque em ações concretas e resultados mensuráveis.`;
        break;
        
      case 'technologies':
        prompt = `Sugira tecnologias e ferramentas relevantes para o cargo de ${context.position}. Liste apenas as principais tecnologias separadas por vírgula.`;
        break;
        
      case 'impact':
        prompt = `Sugira impactos e resultados quantificáveis para alguém no cargo de ${context.position} que implementou as soluções: ${context.solutions}. Inclua métricas quando possível.`;
        break;
        
      default:
        throw new Error('Tipo de sugestão não reconhecido');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em recursos humanos e desenvolvimento de carreira. Suas respostas devem ser profissionais, concisas e em português brasileiro.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

    return new Response(JSON.stringify({ suggestion }), {
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