import { GoogleGenAI } from "@google/genai";

export const getAiSuggestions = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "Eres un experto agrónomo y veterinario. Proporciona consejos prácticos y concisos en español para agricultores y ganaderos. Formatea tu respuesta en Markdown.",
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error al contactar con la API de Gemini:", error);
        return "No se pudieron obtener sugerencias en este momento. Por favor, inténtalo de nuevo más tarde.";
    }
};
