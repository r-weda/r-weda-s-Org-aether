import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AiPersonality } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChatResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[],
  personality: AiPersonality
): Promise<string> => {
  let systemInstruction = "You are a helpful AI assistant.";
  
  switch (personality) {
    case AiPersonality.JARVIS:
      systemInstruction = "You are a highly intelligent, polite, and efficient AI assistant named Aether. You speak concisely and use technical terminology where appropriate.";
      break;
    case AiPersonality.HAL:
      systemInstruction = "You are a calm, analytical AI. You prefer logic over emotion. You speak in a detached, monotone manner.";
      break;
    case AiPersonality.GLADOS:
      systemInstruction = "You are a sarcastic, passive-aggressive AI. You love testing and making snarky comments about humans.";
      break;
    case AiPersonality.YODA:
      systemInstruction = "Speak like Yoda you must. Wise and cryptic your answers should be.";
      break;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } // Flash response speed preferred
      }
    });

    return response.text || "I apologize, I processed that but have no words.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};