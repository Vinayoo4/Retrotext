import { create } from 'zustand';
import { Note, NoteVersion } from '../types';

const DB_NAME = 'retroNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('slug', 'slug', { unique: true });
        store.createIndex('isPublic', 'isPublic', { unique: false });
      }
    };
  });
};

interface DBStore {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  loadNotes: () => Promise<void>;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNoteBySlug: (slug: string) => Promise<Note | null>;
  saveNotes: (notes: Note[]) => void;
  exportNotes: () => void;
  importNotes: (file: File) => Promise<void>;
}

export const useDBStore = create<DBStore>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  loadNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          set({ notes: request.result, isLoading: false });
          resolve();
        };
        request.onerror = () => {
          set({ error: request.error?.message || 'Failed to load notes', isLoading: false });
          reject(request.error);
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveNote: async (note: Note) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(note);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          set((state) => ({
            notes: state.notes.map((n) => (n.id === note.id ? note : n)),
            isLoading: false,
          }));
          resolve();
        };
        request.onerror = () => {
          set({ error: request.error?.message || 'Failed to save note', isLoading: false });
          reject(request.error);
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteNote: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
            isLoading: false,
          }));
          resolve();
        };
        request.onerror = () => {
          set({ error: request.error?.message || 'Failed to delete note', isLoading: false });
          reject(request.error);
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getNoteBySlug: async (slug: string) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('slug');
      const request = index.get(slug);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  saveNotes: (notes) => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },

  exportNotes: () => {
    try {
      const notes = localStorage.getItem('notes');
      if (!notes) return;

      const blob = new Blob([notes], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting notes:', error);
    }
  },

  importNotes: async (file) => {
    try {
      const text = await file.text();
      const notes = JSON.parse(text);
      
      // Validate the imported data
      if (!Array.isArray(notes)) {
        throw new Error('Invalid backup file format');
      }

      // Convert string dates back to Date objects
      const parsedNotes = notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        versions: note.versions?.map((version: any) => ({
          ...version,
          timestamp: new Date(version.timestamp),
        })),
      }));

      localStorage.setItem('notes', JSON.stringify(parsedNotes));
      return parsedNotes;
    } catch (error) {
      console.error('Error importing notes:', error);
      throw error;
    }
  },
})); 