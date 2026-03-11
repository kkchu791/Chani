import promptSync from 'prompt-sync';
const prompt = promptSync();
import {
  getChaniFinalContext,
  memoryExtractionContext,
  getExtractionRequest,
} from '../chaniContext.js';
import { sendMessageToGroq } from '../apis/groq.js';
import { writeMemoriesToStorage } from '../apis/db.js';

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

        if (userInput.toLowerCase() === "exit") {
            openConnection = false;
            break;
        }

        messages = [...messages, 
          {
            role: "user",
            content: userInput
          }
        ];

        const resp = await sendMessageToGroq(messages);
        const chaniResp = resp.choices[0]?.message?.content || "";
        
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
      content: memoryExtractionContext
    },
    {
      role: "user",
      content: finalExtractionRequest
    }
  ];
  

  const resp = await sendMessageToGroq(messages);
  const chaniResp = resp.choices[0]?.message?.content || "";

  // clean response

  // api call to write to the storage
  await writeMemoriesToStorage(chaniResp);
}

function goOffline() {
  console.log("Chani is offline");
}
