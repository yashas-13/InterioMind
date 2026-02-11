
import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateFurnishedImage = async (
  imageFile: File,
  prompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const base64ImageData = await fileToBase64(imageFile);
  
  // Refined PRD-compliant high-end prompt
  const fullPrompt = `Transform this specific empty architectural space into a fully furnished, professionally designed interior.
  
  CORE DESIGN OBJECTIVE: ${prompt}
  
  VISUAL STANDARDS:
  - 8K resolution, photorealistic interior design photography.
  - Realistic indirect lighting, soft global illumination, and physically accurate shadows.
  - Materials: High-quality leather, brushed metals, natural wood grains, and woven textiles.
  - Architectural Integrity: Maintain exact wall, floor, ceiling, and window positions from the original image.
  - Composition: Balanced furniture layout following the golden ratio for interior design.
  - Tone: Sophisticated, clean, and high-end retail catalog quality.
  
  OUTPUT INSTRUCTIONS:
  Produce only the single finished furnished image. Do not include text, watermarks, or split screens.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: imageFile.type,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });
    
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("Design engine is currently busy. Please try again.");
    }

    const content = candidates[0].content;
    if (!content || !content.parts || content.parts.length === 0) {
      throw new Error("Generation failed to produce visual content.");
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        const base64ImageBytes = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("The design model returned text instead of a visual. Try a more specific room style.");
  } catch (error: any) {
    if (error.message?.includes('Requested entity was not found')) {
      throw new Error("Access Error: Please ensure your Gemini API Key is active.");
    }
    throw error;
  }
};
