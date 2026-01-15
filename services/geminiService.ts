import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticData, AnalysisResult } from '../types';

// Initialize Gemini Client
// NOTE: process.env.API_KEY must be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAnalysis = async (data: DiagnosticData): Promise<AnalysisResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Supports multimodal input efficiently

    const promptText = `
      Actúa como un Consultor Senior de Automatización de Negocios.
      Analiza la siguiente información de un cliente y genera una propuesta de valor.
      
      Información del Cliente:
      - Empresa: ${data.clientName}
      - Industria: ${data.industry}
      - Stack Tecnológico Actual: ${data.tools.join(', ')}
      - Puntos de Dolor Identificados: ${data.painPoints.join(', ')}
      
      Instrucciones:
      1. Si se proporciona audio, utilízalo para entender el contexto profundo, matices y detalles específicos del problema que no estén en el texto.
      2. Genera un "Resumen del Problema" conciso pero perspicaz que combine los inputs de texto y lo escuchado en el audio.
      3. Identifica 3 oportunidades de automatización concretas usando herramientas como n8n, Make, GHL, Zapier, etc.
      4. Estima ahorros y ROI.
      5. Genera datos para una gráfica de proyección de 6 meses.
      
      Responde EXCLUSIVAMENTE en formato JSON siguiendo el esquema proporcionado.
    `;

    const parts: any[] = [{ text: promptText }];

    // If audio exists, append it to the parts
    if (data.audioBase64) {
      // Remove data URL prefix if present (e.g., "data:audio/webm;base64,")
      const base64Data = data.audioBase64.split(',')[1] || data.audioBase64;
      parts.push({
        inlineData: {
          mimeType: "audio/webm", // Assuming standard browser recording format
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemSummary: { type: Type.STRING, description: "Resumen profesional del problema detectado (max 40 palabras)." },
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  effort: { type: Type.STRING, enum: ["Bajo", "Medio", "Alto"] },
                  impact: { type: Type.STRING, enum: ["Bajo", "Medio", "Alto"] },
                  estimatedSavings: { type: Type.STRING, description: "e.g. $800/mes" }
                }
              }
            },
            totalSavingsMonth: { type: Type.NUMBER },
            totalSavingsYear: { type: Type.NUMBER },
            roiMultiplier: { type: Type.NUMBER },
            implementationCost: { type: Type.NUMBER },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  manual: { type: Type.NUMBER },
                  automated: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text generated");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo purposes if API Key is missing or error occurs
    // In a real app, you would handle the error UI
    return {
      problemSummary: "Error al conectar con Gemini (Falta API Key). Se muestran datos de demostración basados en la industria seleccionada.",
      opportunities: [
        { id: "1", title: "Lead Magnet Automatizado", description: "Conexión GHL con Whatsapp para respuesta inmediata.", effort: "Bajo", impact: "Alto", estimatedSavings: "$1,200/mes" },
        { id: "2", title: "Facturación Recurrente", description: "Automatización de facturas en Stripe/Quickbooks via Make.", effort: "Medio", impact: "Medio", estimatedSavings: "$600/mes" }
      ],
      totalSavingsMonth: 2500,
      totalSavingsYear: 30000,
      roiMultiplier: 4.5,
      implementationCost: 4000,
      chartData: [
        { month: 'Hoy', manual: 4000, automated: 4000 },
        { month: 'M1', manual: 4000, automated: 3500 },
        { month: 'M2', manual: 4000, automated: 2000 },
        { month: 'M3', manual: 4000, automated: 1000 },
        { month: 'M4', manual: 4000, automated: 1000 },
        { month: 'M5', manual: 4000, automated: 1000 },
      ]
    };
  }
};