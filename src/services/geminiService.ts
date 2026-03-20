import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getMarketInsight = async (category: string, itemTitle?: string) => {
  try {
    const prompt = itemTitle 
      ? `Provide a brief market intelligence report for a ${itemTitle}. Include current demand trends, typical price range for various conditions, and what buyers should look for. Keep it professional and concise (under 100 words).`
      : `Provide a brief market overview for the ${category} auction market in North America. Include current demand trends and price volatility. Keep it professional and concise (under 100 words).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching market insight:", error);
    return "Market insights are currently unavailable. Please try again later.";
  }
};
