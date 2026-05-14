import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL =
  process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

export async function GET() {
  try {
    const res = await fetch(
      "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt&type=single"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch joke");
    }

    const joke = await res.text();

    return new NextResponse(joke, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });

  } catch (error) {
    console.error("Error fetching joke:", error);

    return new NextResponse("Failed to fetch joke", {
      status: 500,
    });
  }
}

function sanitizeInput(text = "") {
  return text
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const input = sanitizeInput(body?.input);

    if (!input) {
      return NextResponse.json(
        {
          error: "Missing input text",
        },
        {
          status: 400,
        }
      );
    }

    const response = await ai.models.generateContent({
      model: MODEL,

      config: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 20,

        systemInstruction: `
Generate a concise conversation title.

Rules:
- 2 to 4 words only
- lowercase only
- no punctuation
- no quotes
- no emojis
- no markdown
- summarize the topic naturally
- respond with only the title
`,
      },

      contents: [
        {
          role: "user",
          parts: [
            {
              text: "How do black holes work?",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "black hole physics",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "Write a quicksort in javascript",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "javascript quicksort",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: input,
            },
          ],
        },
      ],
    });

    let title = response.text
      ?.trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");

    if (!title || title.length === 0) {
      title = input
        .split(" ")
        .slice(0, 4)
        .join(" ")
        .toLowerCase();
    }

    return NextResponse.json({
      title,
    });

  } catch (error) {
    console.error("[summarize-title]", error);

    return NextResponse.json(
      {
        error: "Failed to generate title",
      },
      {
        status: 500,
      }
    );
  }
}
