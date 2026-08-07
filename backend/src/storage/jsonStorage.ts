import fs from 'fs/promises';
import path from 'path';

// Fix path resolution robustly by finding the project root
const getProjectRoot = () => {
    // If run via ts-node, __dirname is backend/src/storage
    // If run via built JS, __dirname is backend/dist/backend/src/storage
    // So we resolve to the 'data' directory directly off process.cwd() assuming we are in the monorepo root or backend dir
    return process.cwd().endsWith('backend') ? path.join(process.cwd(), '../data') : path.join(process.cwd(), 'data');
};
const DATA_DIR = getProjectRoot();

export async function readJsonFile<T>(relativePath: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, relativePath);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function writeJsonFile<T>(relativePath: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_DIR, relativePath);
  const dirPath = path.dirname(filePath);

  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}
