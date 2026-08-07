import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../storage/jsonStorage';
import { randomUUID } from 'crypto';

interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  paymentMode: string;
  partyId?: string;
  notes: string;
  status: 'active' | 'voided';
  isRecurring: boolean;
  recurrenceRule?: string;
  tags: string[];
  attachmentRef?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_PATH = 'content/expenses.json';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Expense>(STORAGE_PATH);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Expense>(STORAGE_PATH);

    // Seed deduplication check
    if (req.body.id && items.some(i => i.id === req.body.id)) {
        return res.status(200).json(items.find(i => i.id === req.body.id));
    }

    const newItem: Expense = {
      id: req.body.id || randomUUID(),
      ...req.body,
      status: req.body.status || 'active',
      isRecurring: req.body.isRecurring || false,
      tags: req.body.tags || [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    await writeJsonFile(STORAGE_PATH, items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Expense>(STORAGE_PATH);
    const index = items.findIndex(item => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    items[index] = {
      ...items[index],
      ...req.body,
      version: (items[index].version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };

    await writeJsonFile(STORAGE_PATH, items);
    res.json(items[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

// Expenses are never hard-deleted; they are voided
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Expense>(STORAGE_PATH);
    const index = items.findIndex(item => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    items[index].status = 'voided';
    items[index].version = (items[index].version || 1) + 1;
    items[index].updatedAt = new Date().toISOString();

    await writeJsonFile(STORAGE_PATH, items);
    res.json(items[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to void expense' });
  }
};
