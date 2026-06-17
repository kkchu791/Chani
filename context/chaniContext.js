// chani's context
import { readFile } from 'node:fs/promises';
import { getMemories } from '../apis/dynamodb.js';
import { fitness } from './fitness.js'
import { chaniBackground } from './chaniBackground.js';
import { weeklyPlan } from './weeklyPlans/june/3rdweek.js'

export const chaniModel = "llama-3.3-70b-versatile";

export const chaniContext = chaniBackground +
                    fitness +
                    weeklyPlan;
                    

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
const returnJsonOnly = 'Return the full updated memory as raw JSON only. Respond with ONLY a valid JSON object. No explanation, no markdown, no backticks. Example format: {"key": "value"}'
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
