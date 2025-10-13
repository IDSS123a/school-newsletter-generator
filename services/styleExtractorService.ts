// Fix: Implement the style extraction service using the Gemini API.
import { GoogleGenAI, Type } from "@google/genai";
import type { ExtractedStyles } from "../types";

// Get API key from environment variables (Vite requires VITE_ prefix for browser access)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set in environment variables. Please check your .env file.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        bodyTextColor: { type: Type.STRING, description: 'The primary text color for the body content (in hex format, e.g., #333333).' },
        h2Color: { type: Type.STRING, description: 'The color for main headings (H2) (in hex format).' },
        h3Color: { type: Type.STRING, description: 'The color for sub-headings (H3) (in hex format).' },
        linkColor: { type: Type.STRING, description: 'The color for hyperlink text (in hex format).' },
        buttonBackgroundColor: { type: Type.STRING, description: 'The background color for primary buttons (in hex format).' },
        buttonTextColor: { type: Type.STRING, description: 'The text color for primary buttons (in hex format).' },
        bodyFontFamily: { type: Type.STRING, description: 'The primary font family for body text (e.g., Arial, Verdana).' },
        h2FontFamily: { type: Type.STRING, description: 'The font family for main headings (H2).' },
        h3FontFamily: { type: Type.STRING, description: 'The font family for sub-headings (H3).' },
    },
    required: [
        'bodyTextColor', 'h2Color', 'h3Color', 'linkColor', 
        'buttonBackgroundColor', 'buttonTextColor', 
        'bodyFontFamily', 'h2FontFamily', 'h3FontFamily'
    ],
};

const generateStyleExtractionPrompt = (url: string): string => {
  return `
    Analyze the provided URL and extract the key design and style elements. 
    Focus on the main content area to determine the most representative styles.
    Ignore styles from headers, footers, or sidebars if they are distinct from the main content.
    Provide your response as a JSON object matching the required schema.

    - For colors, provide the hex code.
    - For fonts, provide the font-family name (e.g., 'Arial', 'Georgia'). Choose a web-safe font that is closest to the one used on the site.
    - If you cannot determine a specific style (e.g., there are no buttons), make a reasonable and complementary design choice. For example, if the primary color is blue, a white button text color is a good guess.

    URL to analyze: ${url}
  `;
};

export const extractStylesFromUrl = async (url: string): Promise<ExtractedStyles> => {
    // Basic URL validation
    if (!url || !url.startsWith('http')) {
        throw new Error('Please enter a valid URL (starting with http:// or https://).');
    }

    try {
        const prompt = generateStyleExtractionPrompt(url);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        if (!response.text) {
            throw new Error("AI did not return a valid response.");
        }
        
        const jsonText = response.text.trim();
        const parsedStyles: ExtractedStyles = JSON.parse(jsonText);
        
        return parsedStyles;
    } catch (error: any) {
        console.error("Style extraction failed:", error);
        
        let errorMessage = "Failed to extract styles from the URL.";
        if (error.message.includes("JSON")) {
            errorMessage = "The AI returned an invalid format. Please try again or enter styles manually.";
        } else if (error.message) {
            errorMessage = `An error occurred: ${error.message}`;
        }
        
        throw new Error(errorMessage);
    }
};
