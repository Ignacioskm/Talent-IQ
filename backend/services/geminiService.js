const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarReporteIA(usuarioId, decisiones) {
    try {
        // Construir el contexto de las decisiones
        const contextoDecisiones = decisiones.map((decision, index) => {
            return `
Decisión ${index + 1}:
- NPC: ${decision.npcId}
- Opción elegida: ${decision.opcionElegida}
- Puntajes: ${JSON.stringify(decision.puntajesJson)}
- Fecha: ${decision.fecha}
`;
        }).join('\n');

        // Prompt de sistema para el Psicólogo Organizacional Senior
        const systemPrompt = `Eres un Psicólogo Organizacional Senior con más de 15 años de experiencia en evaluación de habilidades blandas en entornos corporativos. Tu especialidad es analizar patrones de comportamiento y generar reportes narrativos profundos y accionables.

A continuación te presento el historial de decisiones de un usuario en un simulador RPG de evaluación de habilidades blandas. Cada decisión representa una situación laboral y la respuesta elegida por el usuario, con puntajes asociados a diferentes competencias.

${contextoDecisiones}

Tu tarea es generar un reporte narrativo completo que incluya:

1. **Análisis de Fortalezas**: Identifica las habilidades blandas donde el usuario muestra mayor consistencia y puntajes altos. Proporciona ejemplos específicos de sus decisiones que demuestran estas fortalezas.

2. **Áreas de Desarrollo**: Señala las competencias que requieren mejora, basándote en patrones de decisiones con puntajes bajos o ausentes. Sé constructivo y ofrece perspectiva de crecimiento.

3. **Patrones de Comportamiento**: Analiza tendencias en el estilo de toma de decisiones del usuario. ¿Es más proactivo o reactivo? ¿Prefiere liderazgo o trabajo en equipo? ¿Tiende a la autonomía o busca orientación?

4. **Recomendaciones Específicas**: Proporciona 3-5 recomendaciones prácticas y accionables para el desarrollo profesional del usuario, basadas en su perfil actual.

5. **Potencial de Liderazgo**: Evalúa el potencial de liderazgo del usuario basándote en sus decisiones y proporciona una perspectiva honesta sobre su preparación para roles de mayor responsabilidad.

6. **Conclusión**: Un resumen ejecutivo de 2-3 párrafos que capture la esencia del perfil del usuario y su potencial en el entorno organizacional.

El reporte debe ser:
- Profesional y empático
- Basado en evidencia (citar decisiones específicas)
- Constructivo y orientado al crecimiento
- Escrito en un tono que inspire confianza y motivación
- De aproximadamente 800-1200 palabras

Genera el reporte narrativo completo en español.`;

        // Llamar a la API de Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const contenidoNarrativo = response.text();

        // Guardar el reporte en la base de datos
        const reporte = await prisma.reporteIA.create({
            data: {
                usuarioId,
                contenidoNarrativo
            }
        });

        return reporte;
    } catch (error) {
        console.error('Error al generar reporte con Gemini:', error);
        throw new Error('Error al generar reporte con IA');
    }
}

module.exports = { generarReporteIA };
