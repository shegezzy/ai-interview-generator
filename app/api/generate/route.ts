import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { jobTitle } = await req.json();

    if (!jobTitle || typeof jobTitle !== "string") {
      return NextResponse.json(
        { error: "Job title is required." },
        { status: 400 }
      );
    }

      const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
    });

    const prompt = `
      You are an experienced hiring manager.

      Generate 3 thoughtful and professional interview questions for the role: "${jobTitle}"

      Requirements:
      - Questions should assess communication, problem-solving, and role-specific thinking
      - Keep the questions concise and practical
      - Return ONLY the questions as a numbered list
    `;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    const questions = text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

    return NextResponse.json({ questions });
  } catch (error: any) {
  console.error("Gemini Error:", error);

  return NextResponse.json(
    {
      error: error?.message || "Unknown error",
    },
    { status: 500 }
  );
}
}