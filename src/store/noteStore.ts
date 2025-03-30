import { create } from 'zustand';
import type { Note, NoteStore } from '../types';

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  addNote: (note) => set((state) => ({
    notes: [{
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isPinned: false,
    }, ...state.notes],
  })),
  updateNote: (id, updatedNote) => set((state) => ({
    notes: state.notes.map((note) =>
      note.id === id
        ? { ...note, ...updatedNote, updatedAt: new Date() }
        : note
    ),
  })),
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter((note) => note.id !== id),
  })),
  togglePin: (id) => set((state) => ({
    notes: state.notes.map((note) =>
      note.id === id
        ? { ...note, isPinned: !note.isPinned }
        : note
    ),
  })),
  addTag: (id, tag) => set((state) => ({
    notes: state.notes.map((note) =>
      note.id === id
        ? { ...note, tags: [...new Set([...(note.tags || []), tag])] }
        : note
    ),
  })),
  removeTag: (id, tag) => set((state) => ({
    notes: state.notes.map((note) =>
      note.id === id
        ? { ...note, tags: (note.tags || []).filter((t) => t !== tag) }
        : note
    ),
  })),
}));