import { GoogleGenAI } from "@google/genai";
import { ApiResponse, ExchangeData, GroundingSource } from '../types';

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const fetchExchangeRate = async (): Promise<ApiResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Perform a Google Search to find the latest live exchange rate for Japanese Yen (JPY) to Hong Kong Dollar (HKD).
      Also find the closing exchange rates for the past 7 days to show a trend.

      Based on the search results, return a STRICT valid JSON object (no markdown, no code blocks) with the following structure:
      {
        "currentRate": number, // The value of 1 JPY in HKD (e.g., 0.052)
        "lastUpdated": string, // E.g., "Oct 24, 10:00 AM"
        "history": [
           { "date": "MM-DD", "rate": number } // Array of last 7 days
        ],
        "analysis": "A very brief 1-sentence summary of the trend (e.g. Yen is strengthening against HKD)."
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType and responseSchema are NOT allowed with googleSearch
        // We rely on the prompt to format JSON.
      },
    });

    const text = response.text || '';
    
    // Extract JSON from potential Markdown code blocks or raw text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let data: ExchangeData | null = null;

    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
      }
    }

    // Extract Grounding Sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Source',
            uri: chunk.web.uri,
          });
        }
      });
    }

    // Deduplicate sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return { data, sources: uniqueSources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      data: null, 
      sources: [], 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
};
