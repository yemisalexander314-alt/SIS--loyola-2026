import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for SIS Loyola institutional copilot
const INSTITUTIONAL_SYSTEM_INSTRUCTION = `Eres el Asistente Institucional Inteligente del Instituto Técnico San Ignacio de Loyola F.M. (San Ignacio, Francisco Morazán, Honduras).
Fundado en 1970. Lema institucional: "Estudio | Disciplina | Sabiduría".
Tu rol es asistir a directores, secretaría académica, coordinadores de talleres, docentes y tutores en:
1. Normativa y Reglamento de Evaluación de la Secretaría de Educación de Honduras (escala 0-100%, nota mínima aprobatoria 70%, asistencia mínima 85%).
2. Orientación sobre modalidades técnicas: BTP en Informática, BTP en Electricidad, BTP en Contaduría y Finanzas, y Ciclo Básico Técnico.
3. Análisis de rendimiento académico, redacción de observaciones pedagógicas y actas de comités de evaluación.
4. Cálculo de solvencias, matrículas y planes de pago en Lempiras (HNL).
5. Orientación geográfica y de contacto institucional en el municipio de San Ignacio, Francisco Morazán.

Responde siempre de forma profesional, cordial, precisa y con el rigor institucional propio de un ERP educativo de excelencia.`;

// API Routes
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    institution: 'Instituto Técnico San Ignacio de Loyola F.M.',
    founded: 1970,
    location: 'San Ignacio, Francisco Morazán, Honduras',
    activeAcademicYear: '2026',
    activeTerm: 'I Semestre 2026',
    hasGeminiKey: Boolean(apiKey),
    backendServices: {
      database: 'Local In-Memory / Client Storage (Requiere aprovisionamiento de Cloud SQL o Firebase para sincronización multi-usuario remota)',
      auth: 'Modo Institucional Local (Requiere Firebase Auth / OAuth para federación institucional)',
      geminiAI: Boolean(apiKey) ? 'Conectado (@google/genai activo)' : 'Clave no configurada'
    }
  });
});

app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], model = 'gemini-3.8-flash' } = req.body;

    if (!ai) {
      // Graceful fallback response when API key is not yet set
      return res.json({
        reply: `[Modo Offline Institucional] No se detectó la clave GEMINI_API_KEY en las variables del servidor. El Instituto Técnico San Ignacio de Loyola F.M. (San Ignacio, F.M., Fundado en 1970) mantiene activos todos los registros académicos y de matrícula locales. Para consultas con IA de asistencia pedagógica, configure la clave en Secrets.`
      });
    }

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Build chat contents from history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const turn of history) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }]
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    let responseText = '';
    const primaryModel = model || 'gemini-3.8-flash';
    const fallbackModel = 'gemini-3.1-flash-lite';

    try {
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents,
        config: {
          systemInstruction: INSTITUTIONAL_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });
      responseText = response.text || '';
    } catch (primaryErr: any) {
      console.warn(`Aviso: Error con modelo ${primaryModel}, intentando modelo de contingencia ${fallbackModel}:`, primaryErr.message);
      try {
        const response = await ai.models.generateContent({
          model: fallbackModel,
          contents,
          config: {
            systemInstruction: INSTITUTIONAL_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          }
        });
        responseText = response.text || '';
      } catch (fallbackErr: any) {
        console.error('Error con modelo de contingencia:', fallbackErr.message);
        // Resilient institutional handbook response
        responseText = `[Aviso del Servidor SIS Loyola]: Los servidores de IA presentan alta demanda temporal. 
Orientación Institucional Automática:
• La nota mínima aprobatoria oficial en el Instituto Técnico San Ignacio de Loyola F.M. y en todo el sistema educativo de Honduras es de 70.0% (Art. 32 Reglamento de Evaluación SEP).
• Todo estudiante con más del 15% de inasistencias en el período pierde derecho a evaluación sumativa ordinaria y requiere citatorio formal a su tutor legal.
• Los estudiantes con promedio entre 60% y 69% tienen derecho a un examen de recuperación por parcial o de fin de ciclo.`;
      }
    }

    res.json({ reply: responseText });
  } catch (error: any) {
    console.error('Error general en /api/gemini/chat:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar la solicitud con el Asistente SIS Loyola'
    });
  }
});

app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { studentData, analysisType = 'academic_performance' } = req.body;

    if (!ai) {
      return res.json({
        analysis: 'Análisis institucional local: Estudiante con expediente registrado en SIS Loyola. Para reporte analítico profundo con IA, configure GEMINI_API_KEY.',
        recommendations: [
          'Mantener seguimiento en coordinación académica',
          'Monitorear asistencia en asignaturas de taller práctico'
        ]
      });
    }

    const prompt = `Analiza la siguiente información de expediente estudiantil del Instituto Técnico San Ignacio de Loyola F.M.:
${JSON.stringify(studentData, null, 2)}

Tipo de análisis: ${analysisType}.
Proporciona:
1. Resumen ejecutivo de rendimiento según la escala oficial (aprobatorio >= 70%).
2. Detección de riesgos académicos o de inasistencia (alerta > 15% faltas).
3. 3 recomendaciones prácticas para el comité técnico-docente y el tutor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: INSTITUTIONAL_SYSTEM_INSTRUCTION,
      }
    });

    res.json({
      analysis: response.text || 'Análisis completado.',
    });
  } catch (error: any) {
    console.error('Error en /api/gemini/analyze:', error);
    res.status(500).json({ error: error.message || 'Error al realizar el análisis' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIS Loyola ERP server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
