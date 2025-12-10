import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION, MODEL_NAME } from '../constants';
import { Message } from '../types';

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API_KEY is missing.");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const streamChatResponse = async (
  history: Message[],
  newMessage: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const ai = getClient();
  
  // Transform app history to Gemini Chat history format
  // We exclude the last message which is the 'newMessage' we are sending
  // We also filter out any empty messages to prevent API errors
  const previousHistory = history
    .slice(0, -1)
    .filter(msg => msg.content && msg.content.trim() !== '')
    .map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

  const chat = ai.chats.create({
    model: MODEL_NAME,
    history: previousHistory,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  let fullResponse = "";

  try {
    const resultStream = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      const text = c.text;
      if (text) {
        fullResponse += text;
        onChunk(fullResponse);
      }
    }
  } catch (error) {
    console.error("Error streaming chat response:", error);
    onChunk(fullResponse + "\n\n[System Error: Unable to complete response. Please check your connection or API key.]");
  }

  return fullResponse;
};