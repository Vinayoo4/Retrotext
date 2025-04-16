import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note, NoteVersion, NoteStore } from '../types';
import { useDBStore } from './dbStore';

type ActivityType = 'create' | 'edit' | 'delete' | 'version';

interface ActivityLogEntry {
  type: ActivityType;
  noteId: string;
  versionId?: string;
  timestamp: Date;
}

interface StoreAnalytics {
  totalNotes: number;
  lastUpdated: Date;
  activityLog: ActivityLogEntry[];
}

interface StoreState extends NoteStore {
  analytics: StoreAnalytics;
}

const DEBOUNCE_DELAY = 1000; // 1 second

const useNoteStore = create<StoreState>((set, get) => ({
  notes: [],
  analytics: {
    totalNotes: 0,
    lastUpdated: new Date(),
    activityLog: [],
  },

  addNote: (note) => {
    const newNote: Note = {
      ...note,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      tags: [],
      versions: [],
    };

    set((state) => {
      const newState = {
        notes: [...state.notes, newNote],
        analytics: {
          ...state.analytics,
          totalNotes: state.analytics.totalNotes + 1,
          lastUpdated: new Date(),
          activityLog: [
            ...state.analytics.activityLog,
            {
              type: 'create' as ActivityType,
              noteId: newNote.id,
              timestamp: new Date(),
            },
          ],
        },
      };
      useDBStore.getState().saveNotes(newState.notes);
      return newState;
    });
  },

  updateNote: (id, updates) => {
    set((state) => {
      const noteIndex = state.notes.findIndex((note) => note.id === id);
      if (noteIndex === -1) return state;

      const updatedNote = {
        ...state.notes[noteIndex],
        ...updates,
        updatedAt: new Date(),
      };

      // Create a new version if content changed
      if (updates.content && updates.content !== state.notes[noteIndex].content) {
        const version: NoteVersion = {
          id: uuidv4(),
          content: state.notes[noteIndex].content,
          timestamp: new Date(),
          changes: 'Content updated',
        };

        updatedNote.versions = [...(updatedNote.versions || []), version];

        state.analytics.activityLog.push({
          type: 'version' as ActivityType,
          noteId: id,
          versionId: version.id,
          timestamp: new Date(),
        });
      }

      const newNotes = [...state.notes];
      newNotes[noteIndex] = updatedNote;

      const newState = {
        notes: newNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: new Date(),
          activityLog: [
            ...state.analytics.activityLog,
            {
              type: 'edit' as ActivityType,
              noteId: id,
              timestamp: new Date(),
            },
          ],
        },
      };
      useDBStore.getState().saveNotes(newState.notes);
      return newState;
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const newState = {
        notes: state.notes.filter((note) => note.id !== id),
        analytics: {
          ...state.analytics,
          totalNotes: state.analytics.totalNotes - 1,
          lastUpdated: new Date(),
          activityLog: [
            ...state.analytics.activityLog,
            {
              type: 'delete' as ActivityType,
              noteId: id,
              timestamp: new Date(),
            },
          ],
        },
      };
      useDBStore.getState().saveNotes(newState.notes);
      return newState;
    });
  },

  togglePin: (id) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      );

      const newState = {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: new Date(),
          activityLog: [
            ...state.analytics.activityLog,
            {
              type: 'edit' as ActivityType,
              noteId: id,
              timestamp: new Date(),
            },
          ],
        },
      };
      useDBStore.getState().saveNotes(newState.notes);
      return newState;
    });
  },

  addTag: (id, tag) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id
          ? { ...note, tags: [...new Set([...(note.tags || []), tag])] }
          : note
      );

      const newState = {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: new Date(),
          activityLog: [
            ...state.analytics.activityLog,
            {
              type: 'edit' as ActivityType,
              noteId: id,
              timestamp: new Date(),
            },
          ],
        },
      };
      useDBStore.getState().saveNotes(newState.notes);
      return newState;
    });
  },

  removeTag: (id, tag) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id
          ? { ...note, tags: (note.tags || []).filter((t) => t !== tag) }
          : note
      );

      const newState = {
        notes: updatedNotes,
        analytics: {
          ...state.analytics,
          lastUpdated: new Date(),
          activityLog: [
            ...state.analytics.activityLog,
            {
              type: 'edit' as ActivityType,
              noteId: id,
              timestamp: new Date(),
            },
          ],
        },
      };
      useDBStore.getState().saveNotes(newState.notes);
      return newState;
    });
  },

  searchNotes: (query) => {
    if (!query) return get().notes;
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
      const noteIndex = state.notes.findIndex((note) => note.id === noteId);
      if (noteIndex === -1) return state;

      const version: NoteVersion = {
        id: uuidv4(),
        content,
        timestamp: new Date(),
        changes,
      };

      const updatedNote = {
        ...state.notes[noteIndex],
        versions: [...(state.notes[noteIndex].versions || []), version],
      };

      const newNotes = [...state.notes];
      newNotes[noteIndex] = updatedNote;

      const newState = {
        notes: newNotes,
        analytics: {
          ...state.analytics,
          activityLog: [
            ...state.analytics.activityLog,
            {
              type: 'version' as ActivityType,
              noteId,
              versionId: version.id,
              timestamp: new Date(),
            },
          ],
        },
      };
      useDBStore.getState().saveNotes(newState.notes);
      return newState;
    });
  },

  getVersion: (noteId, versionId) => {
    const note = get().notes.find((n) => n.id === noteId);
    return note?.versions?.find((v) => v.id === versionId);
  },

  restoreVersion: (noteId, versionId) => {
    const version = get().getVersion(noteId, versionId);
    if (!version) return;

    get().updateNote(noteId, { content: version.content });
  },
}));

// Load notes from localStorage on initialization
const loadInitialNotes = () => {
  const notes = useDBStore.getState().loadNotes();
  useNoteStore.setState({ notes });
};

loadInitialNotes();

export default useNoteStore;