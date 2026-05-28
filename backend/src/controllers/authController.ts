import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../storage/jsonStorage';
import { hashPassword, comparePassword } from '../auth/auth';
import { User } from '../../../shared/types';
import crypto from 'crypto';

const USERS_FILE = 'users/users.json';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const users = await readJsonFile<User>(USERS_FILE);
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);

    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const users = await readJsonFile<User>(USERS_FILE);
    const user = users.find(u => u.username === username);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.status(200).json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
