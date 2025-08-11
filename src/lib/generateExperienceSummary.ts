// src/lib/generateExperienceSummary.ts
import { Experience } from '@/types/Experience';

/**
 * Gera um texto resumido para o CV no formato STAR, baseado nos campos preenchidos da experiência profissional.
 * O texto é ideal para ser enviado como prompt para IA (ex: Gemini) gerar um parágrafo final para o CV.
 */
export function generateExperienceSummary(experiences: Experience[]): string {
  if (!experiences || experiences.length === 0) return '';

  return experiences.map(exp => {
    // Monta um bullet STAR para cada experiência
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
  }).join('\n\n');
}
