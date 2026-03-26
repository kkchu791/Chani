import { exec } from 'child_process'

// tool definition (json schema that tells groq what exists)
export const ourTracksTools = [
  {
    "type": "function",
    "function": {
      "name": "create_block",
      "description": "Create a time block in Our Tracks calendar",
      "parameters": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "description": `The date for the block in YYYY-MM-DD format. Today is ${new Date().toISOString().split('T')[0]}`
          },
          "time_block_id": {
            "type": "number",
            "description": "The time block ID using 15 minute increments. Formula: (hours * 4) + (minutes / 15) using 24hr time. E.g. 9am = 36, 3pm = 60. Valid range is between 0 and 96"
          },
          "task": {
            "type": "string",
            "description": "Some activity/task you do in the time block"
          },
          "goal_id": {
            "type": "number",
            "description": "It's either going to be Software Engineer/Entreneur which is id 4 or Athletic which is id 25. You make the call based on the conversation"
          }
        },
        "required": ["date", "time_block_id", "task", "goal_id"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "play_music",
      "description": "Play a Spotify playlist based on the user's mood",
      "parameters": {
        "type": "object",
        "properties": {
          "mood": {
            "type": "string",
            "enum": ["sexy", "uplifting"],
            "description": "The mood or vibe for the music"
          }
        },
        "required": ["mood"]
      }
    }
  }
];

// tool implementation (the actual functions that run when groq calls them)

const playlists = {
  sexy: "spotify:playlist:1A0xX0LG7GjeRAQCejzQ2m",
  uplifting: "spotify:playlist:3v0Gktg81CesgszFuvsqMZ"
}
async function playMusic({ mood }) {
  const uri = playlists[mood];
  if (!uri) return;
  exec(`osascript -e 'tell application "Spotify" to play track "${uri}"'`);
}

async function createBlock({
  date,
  time_block_id,
  task,
  goal_id,
}) {
  const body = {
    date,
    time_block_id,
    task,
    creator_id: 27,
    goal_id,
  }

  console.log(body, 'body')
  const url = "http://localhost:4100/api/blocks"
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      'User-Agent': 'chani-in-js',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  return data;
}

const availableFunctions = {
  create_block: createBlock,
  play_music: playMusic
};

export function executeAction(toolCall) {
  const functionName = toolCall.function.name.trim(); //create_block
  const functionToCall = availableFunctions[functionName]; // availableFunctions[create_block]
  const functionArgs = JSON.parse(toolCall.function.arguments); //need to see what these are, but its the request body (userid time task)
  const resp =  functionToCall(functionArgs);



  return resp;
}

