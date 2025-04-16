import { useState } from 'react';
import { Note, Block } from '../types';
import { BlockEditor } from './BlockEditor';
import { ShareNote } from './ShareNote';
import { NoteTemplates } from './NoteTemplates';
import { AISuggestions } from './AISuggestions';
import { Button } from './ui/Button';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: () => void;
}

export const NoteEditor = ({ note, onSave, onDelete }: NoteEditorProps) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleUpdateBlocks = (blocks: Block[]) => {
    onSave({ ...note, content: blocks });
  };

  const handleReorderBlocks = (blocks: Block[]) => {
    onSave({ ...note, content: blocks });
  };

  const handleTogglePublic = () => {
    onSave({ ...note, isPublic: !note.isPublic });
  };

  const handleApplySuggestion = (suggestion: Partial<Note>) => {
    onSave({ ...note, ...suggestion });
  };

  return (
    <div className="note-editor space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onSave({ ...note, title: e.target.value })}
          placeholder="Note Title"
          className="text-2xl font-bold border-none focus:outline-none"
        />
        <div className="flex gap-2">
          <Button onClick={() => setShowTemplates(!showTemplates)}>
            Templates
          </Button>
          <Button onClick={() => setShowAISuggestions(!showAISuggestions)}>
            AI Assistant
          </Button>
          <Button onClick={onDelete} className="bg-red-500 text-white">
            Delete
          </Button>
        </div>
      </div>

      {showTemplates && (
        <NoteTemplates
          onSelectTemplate={(blocks) => {
            onSave({ ...note, content: blocks });
            setShowTemplates(false);
          }}
        />
      )}

      <BlockEditor
        blocks={note.content}
        onUpdate={handleUpdateBlocks}
        onReorder={handleReorderBlocks}
      />

      <ShareNote note={note} onTogglePublic={handleTogglePublic} />

      {showAISuggestions && (
        <AISuggestions
          note={note}
          onApplySuggestion={handleApplySuggestion}
        />
      )}
    </div>
  );
}; 