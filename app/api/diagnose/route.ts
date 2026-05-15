import { ai, MODEL_NAME } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { image, plantName } = await req.json();
    if (!image) return NextResponse.json({ error: "Image data is required" }, { status: 400 });

    const base64Data = image.split(",")[1] || image;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          { text: `Analyze the health of this ${plantName || 'plant'}. Look for diseases, pests, or deficiencies. Provide status (healthy, warning, critical), diagnosis description, specific pest alerts, and recommendations. Return solely as a JSON object.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            diagnosis: { type: Type.STRING },
            pestAlert: { type: Type.STRING },
            recommendations: { type: Type.STRING }
          },
          required: ["status", "diagnosis", "recommendations"]
        }
      }
    });

    return NextResponse.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Diagnose API Error:", error);
    return NextResponse.json({ error: "Failed to diagnose" }, { status: 500 });
  }
}
