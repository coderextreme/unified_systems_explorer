
import { GoogleGenAI } from "@google/genai";
import type { SystemNode } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

export const generateNodeDetails = async (node: SystemNode): Promise<string> => {
  const prompt = `
    You are a world-class systems architect and knowledge management expert specializing in creating configurable, multi-dimensional information systems. 
    A user has selected the concept "${node.name}" which is described as: "${node.description}".

    Please provide a detailed breakdown of this concept in the context of building a unified, 6th-generation application platform. Your response should be structured, informative, and ready for a technical audience.

    Include the following sections:
    1.  **Core Definition:** A concise, expert-level definition of "${node.name}".
    2.  **Key Principles & Sub-components:** List and briefly explain the fundamental principles or the main parts that make up this concept.
    3.  **Conceptual Data Model:** Describe a potential data model for this concept. You can use JSON, YAML, or a clear textual description of entities and their relationships.
    4.  **High-Level Implementation Strategy:** Outline a strategy for implementing this concept. You can use pseudo-code, list key technologies, or describe architectural patterns.
    5.  **Synergies & Connections:** Explain how this concept connects to other related systems (e.g., how "Product Filtering" relates to "Inventory Management" or "3D Model Asset Management").

    Format your response in clear Markdown. Use headings, bullet points, and code blocks for readability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "### API Key Error\n\nPlease ensure your Gemini API key is correctly configured in the environment variables. This application requires a valid API key to generate content.";
    }
    return "### Error\n\nAn error occurred while generating content. Please check the console for more details.";
  }
};
