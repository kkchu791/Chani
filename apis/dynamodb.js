//import and set up the aws sdk
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";


// DynamoDBClient
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(client);
// DynamoDBDocumentClient


export async function getMemories() {
    const command = new GetCommand({
        TableName: "chani-memories",
        Key: { userId: "kirk"}
    });

    const response = await documentClient.send(command);
    return response.Item;
}

// export async function updateMemories(chanisChoiceMemories) {
//     // console.log(typeof JSON.parse(chanisChoiceMemories), 'typeof');
//     // console.log({...JSON.parse(chanisChoiceMemories)}, 'chanisChoiceMemories')
//     const command = new PutCommand({
//         TableName: "chani-memories",
//         Item: { userId: "kirk", ...JSON.parse(chanisChoiceMemories) }
//     });
//     await documentClient.send(command);
// }

export async function updateMemories(chanisChoiceMemories) {
    let parsed;
    
    try {
        // Strip markdown code fences if present
        const cleaned = chanisChoiceMemories
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();
        
        parsed = JSON.parse(cleaned);
    } catch (e) {
        console.error('Failed to parse memories JSON:', e.message);
        console.error('Raw input:', chanisChoiceMemories.slice(0, 200)); // log first 200 chars for debugging
        return; // bail out instead of crashing
    }

    const command = new PutCommand({
        TableName: "chani-memories",
        Item: { userId: "kirk", ...parsed }
    });
    
    await documentClient.send(command);
}

