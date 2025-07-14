import OpenAI from "openai";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLesson(prompt: string): Promise<string> {
  try {
    logger.info(`Calling OpenAI to generate lesson for prompt: "${prompt.substring(0, 30)}..."`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    const message = response.choices[0].message;

    if (message && message.content) {
      logger.info(`OpenAI returned response successfully.`);
      return message.content.trim();
    } else {
      logger.warn(`OpenAI response had no content.`);
      return "";
    }
  } catch (error) {
    logger.error(`OpenAI API call failed: ${error}`);
    throw error; 
  }
}
