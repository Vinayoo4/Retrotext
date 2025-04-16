import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note, NoteVersion } from '../types';
import { useDBStore } from './dbStore';

// Types

export type ActivityType = 'create' | 'edit' | 'delete' | 'version';

export interface ActivityLogEntry {
  type: ActivityType;
  noteId: string;
  versionId?: string;
  timestamp: Date;
}

export interface NoteStore {
  analytics: {
    totalNotes: number;
    lastUpdated: Date | null;
    activityLog: ActivityLogEntry[];
    notes: Note[];
  };
}

interface StoreState extends NoteStore {
  notes: Note[];
  activityLog: ActivityLogEntry[];

  addNote: (note: Partial<Note>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  searchNotes: (query: string) => Note[];
  addVersion: (noteId: string, content: string, changes: string) => void;
  getVersion: (noteId: string, versionId: string) => NoteVersion | undefined;
  restoreVersion: (noteId: string, versionId: string) => void;
  fetchAnalytics: () => void;
}

const now = () => new Date();
const logActivity = (type: ActivityType, noteId: string, versionId?: string): ActivityLogEntry => ({
  type,
  noteId,
  versionId,
  timestamp: now(),
});

export const useNoteStore = create<StoreState>((set, get) => ({
  notes: [],
  activityLog: [],
  analytics: {
    totalNotes: 0,
    lastUpdated: null,
    activityLog: [],
    notes: [],
  },

  addNote: (note) => {
    const newNote: Note = {
      ...note,
      id: uuidv4(),
      createdAt: now(),
      updatedAt: now(),
      isPinned: false,
      tags: [],
      versions: [],
    } as Note;

    set((state) => {
      const updatedNotes = [...state.notes, newNote];
      const updatedLog = [...state.analytics.activityLog, logActivity('create', newNote.id)];
      useDBStore.getState().saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          totalNotes: state.analytics.totalNotes + 1,
          lastUpdated: now(),
          activityLog: updatedLog,
          notes: updatedNotes,
        },
      };
    });
  },

  updateNote: (id, updates) => {
    set((state) => {
      const index = state.notes.findIndex((n) => n.id === id);
      if (index === -1) return state;

      const originalNote = state.notes[index];
      const updatedNote: Note = {
        ...originalNote,
        ...updates,
        updatedAt: now(),
      };

      const activityLog = [...state.analytics.activityLog];

      if (updates.content && updates.content !== originalNote.content) {
        const version: NoteVersion = {
          id: uuidv4(),
          content: originalNote.content,
          timestamp: now(),
          changes: 'Content updated',
        };
        updatedNote.versions = [...(originalNote.versions || []), version];
        activityLog.push(logActivity('version', id, version.id));
      }

      const updatedNotes = [...state.notes];
      updatedNotes[index] = updatedNote;
      activityLog.push(logActivity('edit', id));

      useDBStore.getState().saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: now(),
          activityLog,
          notes: updatedNotes,
        },
      };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const filteredNotes = state.notes.filter((note) => note.id !== id);
      const updatedLog = [...state.analytics.activityLog, logActivity('delete', id)];
      useDBStore.getState().saveNotes(filteredNotes);
      return {
        notes: filteredNotes,
        analytics: {
          ...state.analytics,
          totalNotes: state.analytics.totalNotes - 1,
          lastUpdated: now(),
          activityLog: updatedLog,
          notes: filteredNotes,
        },
      };
    });
  },

  togglePin: (id) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      );
      const updatedLog = [...state.analytics.activityLog, logActivity('edit', id)];
      useDBStore.getState().saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: now(),
          activityLog: updatedLog,
          notes: updatedNotes,
        },
      };
    });
  },

  addTag: (id, tag) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, tags: [...new Set([...(note.tags || []), tag])] } : note
      );
      const updatedLog = [...state.analytics.activityLog, logActivity('edit', id)];
      useDBStore.getState().saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: now(),
          activityLog: updatedLog,
          notes: updatedNotes,
        },
      };
    });
  },

  removeTag: (id, tag) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, tags: (note.tags || []).filter((t) => t !== tag) } : note
      );
      const updatedLog = [...state.analytics.activityLog, logActivity('edit', id)];
      useDBStore.getState().saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: now(),
          activityLog: updatedLog,
          notes: updatedNotes,
        },
      };
    });
  },

  searchNotes: (query) => {
    const searchTerm = query.toLowerCase();
    return get().notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        (note.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  },

  addVersion: (noteId, content, changes) => {
    set((state) => {
      const index = state.notes.findIndex((note) => note.id === noteId);
      if (index === -1) return state;

      const version: NoteVersion = {
        id: uuidv4(),
        content,
        timestamp: now(),
        changes,
      };

      const updatedNote = {
        ...state.notes[index],
        versions: [...(state.notes[index].versions || []), version],
      };

      const updatedNotes = [...state.notes];
      updatedNotes[index] = updatedNote;

      const updatedLog = [...state.analytics.activityLog, logActivity('version', noteId, version.id)];
      useDBStore.getState().saveNotes(updatedNotes);
      return {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          activityLog: updatedLog,
          notes: updatedNotes,
        },
      };
    });
  },

  getVersion: (noteId, versionId) => {
    const note = get().notes.find((n) => n.id === noteId);
    return note?.versions?.find((v) => v.id === versionId);
  },

  restoreVersion: (noteId, versionId) => {
    const version = get().getVersion(noteId, versionId);
    if (version) get().updateNote(noteId, { content: version.content });
  },

  fetchAnalytics: () => {
    const notes = get().notes;
    const activityLog = get().activityLog;
    const lastUpdated = notes.reduce((latest, note) =>
      note.updatedAt > latest ? note.updatedAt : latest, new Date(0));

    set({
      analytics: {
        totalNotes: notes.length,
        lastUpdated,
        activityLog,
        notes,
      },
    });
  },
}));

// Load notes from localStorage on initialization
const loadInitialNotes = async () => {
  const loadedNotes = await useDBStore.getState().loadNotes();
  const notes = loadedNotes ? loadedNotes : [];
  useNoteStore.setState({ notes });
};

loadInitialNotes().catch((error) => {
  console.error('Failed to load initial notes:', error);
});

export default useNoteStore;