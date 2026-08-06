import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../storage/jsonStorage';
import { randomUUID } from 'crypto';

export interface Workstream {
  id: string;
  missionId: string;
  type: 'build' | 'content' | 'research' | 'organize' | 'automate';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  output?: any;
  verification?: string;
}

export interface Mission {
  id: string;
  command: string;
  goal: string;
  workstreams: Workstream[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'awaiting_approval';
  approvals: string[]; // IDs of items requiring Tier 3 approval
  createdAt: string;
  updatedAt: string;
  report?: string;
}

const STORAGE_PATH = 'content/missions.json';

export const getMissions = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Mission>(STORAGE_PATH);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
};

export const startMission = async (req: Request, res: Response) => {
  try {
    const items = await readJsonFile<Mission>(STORAGE_PATH);
    const { command, goal } = req.body;

    const missionId = randomUUID();

    // Decompose into dummy workstreams based on intent parsing
    const workstreams: Workstream[] = [];
    if(command.toLowerCase().includes('build')) {
        workstreams.push({ id: randomUUID(), missionId, type: 'build', status: 'pending', progress: 0 });
    }
    if(command.toLowerCase().includes('post') || command.toLowerCase().includes('plan')) {
        workstreams.push({ id: randomUUID(), missionId, type: 'content', status: 'pending', progress: 0 });
    }
    // Always add a research/organize phase
    workstreams.push({ id: randomUUID(), missionId, type: 'research', status: 'pending', progress: 0 });

    const newMission: Mission = {
      id: missionId,
      command,
      goal: goal || 'Execute user intent',
      workstreams,
      status: 'pending',
      approvals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newMission);
    await writeJsonFile(STORAGE_PATH, items);

    // Simulate parallel execution dispatch here
    // e.g., dispatchMission(newMission.id);

    res.status(201).json(newMission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start mission' });
  }
};

export const getMissionStatus = async (req: Request, res: Response) => {
    try {
        const items = await readJsonFile<Mission>(STORAGE_PATH);
        const mission = items.find(m => m.id === req.params.id);
        if(!mission) return res.status(404).json({error: 'Mission not found'});
        res.json(mission);
    } catch(error) {
        res.status(500).json({ error: 'Failed to fetch mission status' });
    }
}
