const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Diccionario de información de NPCs
const npcInfo = {
    Valentina: { departamento: "Recursos Humanos", personalidad: "Empática y organizada" },
    Camila: { departamento: "Finanzas", personalidad: "Analítica y precisa" },
    Fernanda: { departamento: "Operaciones", personalidad: "Directa y eficiente" },
    Daniela: { departamento: "Ventas", personalidad: "Persuasiva y carismática" }
};

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

async function generarEscenarioDinamico(nombreNPC) {
    try {
        const info = npcInfo[nombreNPC];
        
        if (!info) {
            throw new Error(`NPC ${nombreNPC} no encontrado en el diccionario`);
        }

        const systemPrompt = `Eres un diseñador de pruebas psicométricas especializado en evaluación de habilidades blandas en entornos corporativos.

Genera un caso de conflicto laboral para el siguiente NPC:
- Nombre: ${nombreNPC}
- Departamento: ${info.departamento}
- Personalidad: ${info.personalidad}

El escenario debe ser un problema realista que alguien de ese departamento podría enfrentar en el trabajo.

Debes responder ESTRICTAMENTE en formato JSON con la siguiente estructura:
{
  "texto": "Descripción del problema o conflicto laboral que expone el NPC...",
  "opciones": [
    { "texto": "Opción de respuesta 1...", "puntaje": { "empatia": 3, "trabajoEquipo": 1 } },
    { "texto": "Opción de respuesta 2...", "puntaje": { "liderazgo": 3 } },
    { "texto": "Opción de respuesta 3...", "puntaje": { "responsabilidad": 3 } },
    { "texto": "Opción de respuesta 4...", "puntaje": { "comunicacion": 3 } },
    { "texto": "Opción de respuesta 5...", "puntaje": { "resolucionConflictos": 3 } }
  ]
}

Requisitos:
- El escenario debe mantener siempre 1 problema y exactamente 5 opciones
- Cada opción debe otorgar puntajes a diferentes habilidades blandas de forma coherente
- Las habilidades blandas posibles son: empatia, trabajoEquipo, liderazgo, responsabilidad, comunicacion, resolucionConflictos
- Los puntajes deben ser números enteros entre 1 y 3
- El texto debe estar en español
- Responde SOLO con el JSON, sin texto adicional

RESTRICCIÓN DE LONGITUD DE TEXTO:
- El campo "texto" (la situación o conflicto) debe ser conciso, directo al grano y tener un MÁXIMO de 200 a 250 caracteres (aproximadamente 2 o 3 líneas cortas).
- Cada opción dentro del arreglo "opciones" debe ser una acción directa, clara y tener un MÁXIMO de 80 a 100 caracteres (máximo 1 línea o línea y media en la interfaz). Evita rodeos o explicaciones innecesarias en las respuestas.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const textoRespuesta = response.text();

        // Limpiar el texto para extraer solo el JSON
        const jsonMatch = textoRespuesta.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No se pudo extraer JSON de la respuesta de Gemini');
        }

        const escenario = JSON.parse(jsonMatch[0]);
        return escenario;
    } catch (error) {
        console.error('Error al generar escenario dinámico:', error);
        throw new Error('Error al generar escenario con IA');
    }
}

module.exports = { generarReporteIA, generarEscenarioDinamico };
