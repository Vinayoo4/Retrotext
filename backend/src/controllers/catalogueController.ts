import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../storage/jsonStorage';
import { randomUUID } from 'crypto';

interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_PATH = 'content/catalogue.json';

export const getCatalogue = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<CatalogueItem>(STORAGE_PATH);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch catalogue items' });
  }
};

export const createCatalogueItem = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<CatalogueItem>(STORAGE_PATH);
    const newItem: CatalogueItem = {
      id: randomUUID(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    await writeJsonFile(STORAGE_PATH, items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create catalogue item' });
  }
};

export const updateCatalogueItem = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<CatalogueItem>(STORAGE_PATH);
    const index = items.findIndex(item => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items[index] = {
      ...items[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await writeJsonFile(STORAGE_PATH, items);
    res.json(items[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update catalogue item' });
  }
};

export const deleteCatalogueItem = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<CatalogueItem>(STORAGE_PATH);
    const filteredItems = items.filter(item => item.id !== req.params.id);

    if (items.length === filteredItems.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await writeJsonFile(STORAGE_PATH, filteredItems);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete catalogue item' });
  }
};
