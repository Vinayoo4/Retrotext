export interface Note {
  id: string;
  title: string;
  content: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  tags?: string[];
  color?: string;
  versions?: NoteVersion[];
  lastSaved?: Date;
}

export interface NoteVersion {
  id: string;
  content: string;
  timestamp: Date;
  changes: string;
}

export interface Analytics {
  totalNotes: number;
  lastUpdated: Date;
  activityLog: {
    type: 'create' | 'edit' | 'delete' | 'pin' | 'tag' | 'version';
    noteId: string;
    timestamp: Date;
    versionId?: string;
  }[];
}

export interface Theme {
  name: string;
  bgColor: string;
  textColor: string;
}

export interface NoteStore {
  notes: Note[];
  analytics: Analytics;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  searchNotes: (query: string) => Note[];
  addVersion: (noteId: string, content: string, changes: string) => void;
  getVersion: (noteId: string, versionId: string) => NoteVersion | undefined;
  restoreVersion: (noteId: string, versionId: string) => void;
}