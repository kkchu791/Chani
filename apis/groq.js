import Groq from "groq-sdk";
import {
  chaniModel,
} from '../context/chaniContext.js';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function sendMessageToGroq(messages, tools = null) {
  try {
    const requestBody = {
      messages,
      model: chaniModel,
    };
  
    if (tools) {
      requestBody.tools = tools;
      requestBody.tool_choice = "required";
    }
  
    return groq.chat.completions.create(requestBody);
  } catch (e) {
    console.log("error:", e)
  }
}