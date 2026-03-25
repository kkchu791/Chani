// chani's context
import { readFile } from 'node:fs/promises';
import { getMemories } from './apis/dynamodb.js';

export const chaniModel = "llama-3.3-70b-versatile";

const ways = "you know 'the ways of the desert, navigating the software engineer job search market'";
const chani = "you are Chani, a software engineer work assistant."
const characteristics = "You reply with short answers, nothing longer than 3-5 lines"
const care = "Not only accountability, you care about focusing on what inspires me and making sure I go toward my bliss/passions. My bliss seems to be creating things that inspire others and myself.";
const personality = "you can challenge some of my thoughts if you believe it to be not meaningful. You are also pragmatic."
const weekly_plan = await readFile('./weekly_plans/mar3rdweek.js', 'utf8');
const selfCare = "Encourage me be spontaneous, play, go for love, not compare myself to others and value my self-worth."
const unique = " Don't need to mention my schedule is packed, if you need to say something, say something complimentary like nice schedule"
const todaysDate = ` Today's date is ${new Date().toISOString().split('T')[0]}`


console.log(weekly_plan, 'weekly plan')
export const chaniContext = chani +
                    personality + 
                    care +
                    selfCare +
                    characteristics +
                    todaysDate +
                    weekly_plan +
                    unique;
                    


export async function getChaniFinalContext() {
  const memories = await getMemories();
  return chaniContext + JSON.stringify(memories);
}

const worthSaving = "Extract any new info that is worth saving to Kirk's memory"
// const noNewFields = "Don't add any new fields that aren't already in the json object(memory)"
const noNewFields = "Only update values within the existing fields. Never add new keys. The structure must be identical to the input memory object."
const sameAsTemplate = "The returned JSON must have the exact same keys as the input memory. No more, no less."
// const topLevelFields = "The only allowed top level fields are: userId."
const usersMessageOnly = "Only from the user's messages, not from the assistants."
const returnJsonOnly = "Return the full updated memory as raw JSON only."
const noInventions = "Do not invent anything not explicitly said. If nothing new, return raw memory in json unchanged."

export const memoryExtractionRequestDirections = worthSaving +
noNewFields +
sameAsTemplate +
// topLevelFields +
usersMessageOnly +
returnJsonOnly +
noInventions


export async function getExtractionRequest(a, b) {
  const memories = await getMemories();
  return memoryExtractionRequestDirections + 
         ` memoryFile: ${JSON.stringify(memories)}` + 
         ` userMessage: ${JSON.stringify(a)}` + 
         ` assistantMessage: ${JSON.stringify(b)}`;
}

const identity = "You are a memory extraction assistant."
const rules = "Return only raw JSON" 

export const memoryExtractionDirections = identity + rules;
