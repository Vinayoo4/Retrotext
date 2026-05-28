import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../storage/jsonStorage';
import { Session } from '../../../shared/types';
import crypto from 'crypto';

const SESSIONS_FILE = 'content/sessions.json';

export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await readJsonFile<Session>(SESSIONS_FILE);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read sessions' });
  }
};

export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, content, themeId } = req.body;
    const sessions = await readJsonFile<Session>(SESSIONS_FILE);

    const newSession: Session = {
      id: crypto.randomUUID(),
      name: name || 'New Session',
      content: content || '',
      themeId: themeId || 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessions.push(newSession);
    await writeJsonFile(SESSIONS_FILE, sessions);

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
};
