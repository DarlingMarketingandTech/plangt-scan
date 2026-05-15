import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const prompt = `Identify this plant. Provide the result in JSON format:
    {
      "commonName": "string",
      "scientificName": "string",
      "nativeStatus": "Native" | "Invasive" | "Naturalized",
      "description": "string",
      "careTips": "string",
      "wateringIntervalDays": number (e.g. 7)
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
    console.error("Identify API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
