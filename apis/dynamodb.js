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

export async function updateMemories(chanisChoiceMemories) {
    console.log(typeof JSON.parse(chanisChoiceMemories), 'typeof');
    console.log({...JSON.parse(chanisChoiceMemories)}, 'chanisChoiceMemories')
    const command = new PutCommand({
        TableName: "chani-memories",
        Item: { userId: "kirk", ...JSON.parse(chanisChoiceMemories) }
    });
    await documentClient.send(command);
}

