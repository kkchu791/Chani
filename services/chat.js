import psp from "prompt-sync-plus";
// import promptSync from 'prompt-sync';
// const prompt = promptSync();
const prompt = psp();

import {
  getChaniFinalContext,
  memoryExtractionDirections,
  getExtractionRequest,
} from '../context/chaniContext.js';
import { sendMessageToGroq } from '../apis/groq.js';
import { updateMemories } from "../apis/dynamodb.js";
import { writeMemoriesToStorage } from "../apis/db.js";
import {
  executeAction,
  ourTracksTools,
 } from "../tools.js";

export async function startChat() {
    let openConnection = true;
    const finalChaniContext = await getChaniFinalContext();

    let messages = [
        {
            role: "system",
            content: finalChaniContext,
        }
    ];

    while (openConnection) {
      const userInput = prompt("You: ");

        if (userInput.toLowerCase() === "exit" || userInput.toLowerCase() === "exit game") {
            openConnection = false;
            break;
        }

        messages = [...messages, 
          {
            role: "user",
            content: userInput
          }
        ];

        const isScheduling = userInput.includes("block");
        const isMoody = userInput.includes("play") || 
                        userInput.toLowerCase().includes("jarvis")

        const resp = (isScheduling || isMoody) ? 
          await sendMessageToGroq(messages, ourTracksTools) : 
          await sendMessageToGroq(messages);

        const chaniResp = resp.choices[0]?.message?.content || "";
        const chaniAction = resp.choices[0]?.message?.tool_calls?.[0];

        console.log(chaniAction, 'chaniAction')
        if (chaniAction) {
          console.log("chani executing action...")
          await executeAction(chaniAction);
        }

        console.log(`Chani: ${chaniResp}`);

        messages = [...messages,
          {
            role: "assistant",
            content: chaniResp
          }
        ];

        const chanisMessage = messages[messages.length - 1];
        const usersMessage = messages[messages.length - 2];

        await updateMemory(usersMessage, chanisMessage);
    }

    goOffline();
}

async function updateMemory(usersMessage, chanisMessage) {
  const finalExtractionRequest = await getExtractionRequest(usersMessage, chanisMessage);

  let messages = [
    {
      role: "system",
      content: memoryExtractionDirections
    },
    {
      role: "user",
      content: finalExtractionRequest
    }
  ];
  

  const resp = await sendMessageToGroq(messages);
  const chanisChoiceMemories = resp.choices[0]?.message?.content || "";
  
  //api call to write to in-memory storage
  await writeMemoriesToStorage(chanisChoiceMemories)

  // api call to write to AWS DynamoDB cloud storage
  await updateMemories(chanisChoiceMemories);
}

function goOffline() {
  console.log("Chani is offline");
}
