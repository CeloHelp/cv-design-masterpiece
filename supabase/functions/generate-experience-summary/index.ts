// supabase/functions/generate-experience-summary/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

/**
 * Função edge para gerar prompt STAR para experiências profissionais.
 * Espera receber um array de experiências no body (JSON).
 */
serve(async (req) => {
  try {
    const { experiences } = await req.json();
    if (!Array.isArray(experiences)) {
      return new Response(JSON.stringify({ error: 'Experiences array is required.' }), { status: 400 });
    }

    // Gera o prompt STAR
    const bullets = experiences.map((exp) => {
      const parts: string[] = [];
      if (exp.position && exp.company) {
        parts.push(`No cargo de ${exp.position} na ${exp.company},`);
      } else if (exp.position) {
        parts.push(`Como ${exp.position},`);
      } else if (exp.company) {
        parts.push(`Na ${exp.company},`);
      }
      if (exp.activitiesAndTechnologies) {
        parts.push(`${exp.activitiesAndTechnologies}`);
      }
      if (exp.impact) {
        parts.push(`Impacto/resultados: ${exp.impact}`);
      }
      return `🔹 ${parts.join(' ')}`;
    });

    const prompt = bullets.join('\n\n');
    return new Response(JSON.stringify({ prompt }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400 });
  }
});
