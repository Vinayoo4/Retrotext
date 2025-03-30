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
}

export interface Theme {
  name: string;
  bgColor: string;
  textColor: string;
}

export interface NoteStore {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
}