import { ai, MODEL_NAME } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: "Image data is required" }, { status: 400 });

    const base64Data = image.split(",")[1] || image;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          { text: "Identify this plant. Provide its common name, scientific name, native status (e.g. Native, Invasive, Introduced), a brief description, and basic care tips. Also suggest a watering interval in days (integer). Return solely as a JSON object." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonName: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            nativeStatus: { type: Type.STRING },
            description: { type: Type.STRING },
            careTips: { type: Type.STRING },
            wateringIntervalDays: { type: Type.INTEGER }
          },
          required: ["commonName", "scientificName", "description", "careTips", "wateringIntervalDays"]
        }
      }
    });

    return NextResponse.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Identify API Error:", error);
    return NextResponse.json({ error: "Failed to identify plant" }, { status: 500 });
  }
}
