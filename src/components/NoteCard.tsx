import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Edit2, Trash2, BookOpen, Pin, Tag, X } from 'lucide-react';
import { format } from 'date-fns';
import type { Note } from '../types';
import { useNoteStore } from '../store/noteStore';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const { deleteNote, togglePin, removeTag } = useNoteStore();

  return (
    <motion.div
      layout
      layoutId={note.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 transition-shadow duration-200 hover-lift ${
        note.isPinned ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-500/20' : ''
      }`}
    >
      {/* Header: Title + Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {note.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <IconButton
            onClick={() => togglePin(note.id)}
            label={note.isPinned ? 'Unpin note' : 'Pin note'}
            icon={<Pin className={`w-4 h-4 ${note.isPinned ? 'text-indigo-400' : 'text-indigo-400/50'}`} />}
            className={note.isPinned ? 'bg-indigo-500/20' : 'hover:bg-slate-700/50'}
          />
          <IconButton
            onClick={() => onEdit(note)}
            label="Edit note"
            icon={<Edit2 className="w-4 h-4 text-indigo-400" />}
          />
          <IconButton
            onClick={() => deleteNote(note.id)}
            label="Delete note"
            icon={<Trash2 className="w-4 h-4 text-red-400" />}
            className="hover:bg-red-500/10"
          />
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="prose prose-invert max-w-none mb-4 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </motion.div>

      {/* Tags */}
      {Array.isArray(note.tags) && note.tags?.length > 0 && (
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
                aria-label={`Remove tag ${tag}`}
              >
                <X className="w-3 h-3 text-indigo-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer: Date + Theme */}
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

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, label, className }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={`p-2 rounded-full transition-colors button-press ${className || 'hover:bg-slate-700/50'}`}
    aria-label={label}
  >
    {icon}
  </motion.button>
);
