import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../storage/jsonStorage';
import { randomUUID } from 'crypto';

interface Party {
  id: string;
  name: string;
  role: 'Customer' | 'Supplier' | 'Partner';
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_PATH = 'content/parties.json';

export const getParties = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Party>(STORAGE_PATH);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parties' });
  }
};

export const createParty = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Party>(STORAGE_PATH);
    const newItem: Party = {
      id: randomUUID(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    await writeJsonFile(STORAGE_PATH, items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create party' });
  }
};

export const updateParty = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Party>(STORAGE_PATH);
    const index = items.findIndex(item => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Party not found' });
    }

    items[index] = {
      ...items[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await writeJsonFile(STORAGE_PATH, items);
    res.json(items[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update party' });
  }
};

export const deleteParty = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Party>(STORAGE_PATH);
    const filteredItems = items.filter(item => item.id !== req.params.id);

    if (items.length === filteredItems.length) {
      return res.status(404).json({ error: 'Party not found' });
    }

    await writeJsonFile(STORAGE_PATH, filteredItems);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete party' });
  }
};
