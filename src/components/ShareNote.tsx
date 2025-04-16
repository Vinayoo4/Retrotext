import { useState } from 'react';
import { Note } from '../types';
import { Button } from './ui/Button';

interface ShareNoteProps {
  note: Note;
  onTogglePublic: () => void;
}

export const ShareNote = ({ note, onTogglePublic }: ShareNoteProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/note/${note.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="share-note">
      <div className="flex items-center gap-2">
        <Button onClick={onTogglePublic}>
          {note.isPublic ? 'Make Private' : 'Make Public'}
        </Button>
        {note.isPublic && (
          <>
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border rounded"
            />
            <Button onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}; 