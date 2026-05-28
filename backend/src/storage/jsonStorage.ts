import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../../../data');

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
