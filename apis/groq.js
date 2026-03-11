import Groq from "groq-sdk";
import {
  chaniModel,
} from '../chaniContext.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function sendMessageToGroq(messages) {
  return await groq.chat.completions.create({
    messages: messages,
    model: chaniModel
  });

  // return {"status": "success", resp};
}