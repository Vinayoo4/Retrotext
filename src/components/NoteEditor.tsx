import { useState } from 'react';
import { Block, Note } from '../types';
import { BlockEditor } from './BlockEditor';
import { ShareNote } from './ShareNote';
import { NoteTemplates } from './NoteTemplates';
import { AISuggestions } from './AISuggestions';
import { Button } from './ui/Button';

// --- Component Props ---
interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: () => void;
}

// --- Component ---
export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onDelete }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // --- Note Update Utilities ---
  const updateNote = (updates: Partial<Note>) => onSave({ ...note, ...updates });

  const handleUpdateBlocks = (blocks: Block[]) => updateNote({ content: blocks });
  const handleReorderBlocks = (blocks: Block[]) => updateNote({ content: blocks });
  const handleTogglePublic = () => updateNote({ isPublic: !note.isPublic });
  const handleApplySuggestion = (suggestion: Partial<Note>) => updateNote(suggestion);

  // --- Render Functions ---
  const renderHeader = () => (
    <div className="flex justify-between items-center">
      <input
        type="text"
        value={note.title}
        onChange={(e) => updateNote({ title: e.target.value })}
        placeholder="Note Title"
        className="text-2xl font-bold bg-transparent border-none focus:outline-none placeholder:text-slate-400"
        aria-label="Note title input"
      />
      <div className="flex gap-2">
        <Button onClick={() => setShowTemplates((prev) => !prev)} aria-label="Toggle Templates">
          Templates
        </Button>
        <Button onClick={() => setShowAISuggestions((prev) => !prev)} aria-label="Toggle AI Suggestions">
          AI Assistant
        </Button>
        <Button
          onClick={onDelete}
          className="bg-red-500 text-white"
          aria-label="Delete Note"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  const renderTemplatesPanel = () =>
    showTemplates && (
      <NoteTemplates
        onSelectTemplate={(blocks: Block[]) => {
          updateNote({ content: blocks });
          setShowTemplates(false);
        }}
      />
    );

  const renderAISuggestions = () =>
    showAISuggestions && (
      <AISuggestions
        note={note}
        onApplySuggestion={handleApplySuggestion}
      />
    );

  // --- JSX ---
  return (
    <div className="note-editor space-y-4">
      {renderHeader()}
      {renderTemplatesPanel()}
      <BlockEditor
        blocks={Array.isArray(note.content) ? note.content : []}
        onUpdate={handleUpdateBlocks}
        onReorder={handleReorderBlocks}
      />
      <ShareNote note={note} onTogglePublic={handleTogglePublic} />
      {renderAISuggestions()}
    </div>
  );
};
