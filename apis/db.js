import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export async function writeMemoriesToStorage(newMemories) {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    await writeFile(join(__dirname, '../memory.json'), JSON.stringify(newMemories, null, 2));
  } catch (err) {
    console.error("had trouble writing new memories", err);
    throw new Error("something went wrong with writing", { cause: err });    
  }
}

