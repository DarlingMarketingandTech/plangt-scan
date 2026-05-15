import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { image, plantName } = await req.json();
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const prompt = `Diagnose the health of this ${plantName || 'plant'}. Provide the result in JSON format:
    {
      "isHealthy": boolean,
      "diagnosis": "string",
      "confidence": number (0-1),
      "treatment": "string",
      "urgency": "low" | "medium" | "high"
    }`;

    const imageData = image.split(',')[1];
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: prompt },
        { 
          inlineData: {
            data: imageData,
            mimeType: "image/jpeg"
          }
        }
      ]
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error("Diagnose API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
