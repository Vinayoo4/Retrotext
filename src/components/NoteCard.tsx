import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { Note } from '../types';
import { Edit2, Trash2, BookOpen, Pin, Tag, X } from 'lucide-react';
import { format } from 'date-fns';
import { useNoteStore } from '../store/noteStore';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const { deleteNote, togglePin, removeTag } = useNoteStore();

  return (
    <motion.div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 hover-lift ${
        note.isPinned ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-500/20' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      layoutId={note.id}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {note.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => togglePin(note.id)}
            className={`p-2 rounded-full transition-colors button-press
              ${note.isPinned ? 'bg-indigo-500/20' : 'hover:bg-slate-700/50'}`}
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'text-indigo-400' : 'text-indigo-400/50'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(note)}
            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors button-press"
          >
            <Edit2 className="w-4 h-4 text-indigo-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => deleteNote(note.id)}
            className="p-2 hover:bg-red-500/10 rounded-full transition-colors button-press"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
        </div>
      </div>
      <motion.div 
        className="prose prose-invert max-w-none mb-4 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </motion.div>
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-full text-sm"
            >
              <Tag className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-200">{tag}</span>
              <button
                onClick={() => removeTag(note.id, tag)}
                className="hover:bg-slate-600/50 rounded-full p-1"
              >
                <X className="w-3 h-3 text-indigo-400" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center text-sm">
        <span className="text-indigo-200/70">
          {format(new Date(note.updatedAt), 'MMMM dd, yyyy')}
        </span>
        <motion.span 
          className="px-3 py-1 bg-slate-700/50 rounded-full text-indigo-200"
          whileHover={{ scale: 1.05 }}
        >
          {note.theme}
        </motion.span>
      </div>
    </motion.div>
  );
};