export type BlockType = 'paragraph' | 'heading' | 'todo' | 'image' | 'code' | 'divider';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  order: number;
  metadata?: Record<string, any>;
}

export interface NoteVersion {
  id: string;
  content: string;
  timestamp: Date;
  changes: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
  lastSaved?: Date;
  isPinned: boolean;
  tags: string[];
  versions: NoteVersion[];
}

export interface Analytics {
  totalNotes: number;
  lastUpdated: Date;
  activityLog: {
    type: 'create' | 'edit' | 'delete' | 'pin' | 'tag' | 'version';
    noteId: string;
    versionId?: string;
    timestamp: Date;
  }[];
}

export interface NoteStore {
  notes: Note[];
  analytics: Analytics;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addVersion: (noteId: string, content: string, changes: string) => void;
  getVersion: (noteId: string, versionId: string) => NoteVersion | undefined;
  restoreVersion: (noteId: string, versionId: string) => void;
} 