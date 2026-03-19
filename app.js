import {startChat} from "./services/chat.js";
import 'dotenv/config';

export async function main() {
    await startChat();
}

main();