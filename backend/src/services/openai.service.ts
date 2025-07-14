import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLesson(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",  // או דגם אחר שמתאים לך
    messages: [
      { role: "user", content: prompt }
    ],
    max_tokens: 500,
  });
  const message = response.choices[0].message;

  if (message && message.content) {
    return message.content.trim();
  }

  return "";
}
