import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../storage/jsonStorage';
import { randomUUID } from 'crypto';

export interface KnowledgeItem {
  id: string;
  title: string;
  sourceType: 'text' | 'markdown' | 'pdf' | 'code' | 'audio' | 'video' | 'web';
  sourceRef?: string;
  summary: string;
  concepts: string[];
  rules: string[];
  frameworks: string[];
  examples: string[];
  tags: string[];
  category: string;
  ingestedAt: string;
  version: number;
}

const STORAGE_PATH = 'content/knowledge.json';

// In a full implementation, this would trigger chunking and vector indexing (FAISS/SQLite)
// For the MVP foundation, we just store the parsed metadata struct.
export const ingestKnowledge = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<KnowledgeItem>(STORAGE_PATH);
    const { title, sourceType, sourceRef, rawContent, category, tags } = req.body;

    // Simulate basic extraction logic that an LLM would do
    const newItem: KnowledgeItem = {
      id: randomUUID(),
      title: title || 'Untitled Ingestion',
      sourceType: sourceType || 'text',
      sourceRef,
      summary: `Auto-generated summary for ${title || 'content'}`,
      concepts: ['Parsed Concept A', 'Parsed Concept B'],
      rules: [],
      frameworks: [],
      examples: [],
      tags: tags || [],
      category: category || 'Uncategorized',
      ingestedAt: new Date().toISOString(),
      version: 1,
    };

    items.push(newItem);
    await writeJsonFile(STORAGE_PATH, items);

    // Simulate async indexing job queue here
    // e.g., queueIndexingJob(newItem.id, rawContent);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest knowledge' });
  }
};

export const getKnowledgeBase = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<KnowledgeItem>(STORAGE_PATH);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
};

export const searchKnowledge = async (req: Request, res: Response) => {
    try {
        const query = (req.query.q as string || '').toLowerCase();
        const items = await readJsonFile<KnowledgeItem>(STORAGE_PATH);

        // Basic keyword scoring MVP
        const scored = items.map(item => {
            let score = 0;
            if (item.title.toLowerCase().includes(query)) score += 10;
            if (item.summary.toLowerCase().includes(query)) score += 5;
            item.concepts.forEach(c => { if(c.toLowerCase().includes(query)) score += 2; });
            item.tags.forEach(t => { if(t.toLowerCase().includes(query)) score += 3; });
            return { item, score };
        }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

        res.json(scored.map(s => s.item));
    } catch (error) {
        res.status(500).json({ error: 'Failed to search knowledge base' });
    }
}
