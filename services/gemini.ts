
import { GoogleGenAI, Type } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
export const getGeminiService = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export async function getProjectSummary(projectName: string, description: string, tasks: any[]) {
  const ai = getGeminiService();
  const prompt = `Act as a senior IT project manager. Provide a concise executive summary and 3 strategic recommendations for the story: "${projectName}". 
  Context: ${description}. 
  Current Tasks: ${JSON.stringify(tasks)}.
  Format your response as clean markdown with clear headers.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI summary. Please check your API key.";
  }
}

export async function chatWithAssistant(history: { role: string, parts: { text: string }[] }[], newMessage: string) {
  const ai = getGeminiService();
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "You are an expert Agile assistant for Iterion. Help users with story grooming, task management, project strategies, and technical roadblocks. Keep responses professional, helpful, and concise.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to my neural net. Can you try again?";
  }
}
