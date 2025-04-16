import { useState } from 'react';
import { Note } from '../types';
import { getAISuggestions } from '../services/aiService';
import { Button } from './ui/Button';

interface AISuggestionsProps {
  note: Note;
  onApplySuggestion: (suggestion: Partial<Note>) => void;
}

export const AISuggestions = ({ note, onApplySuggestion }: AISuggestionsProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    title?: string;
    tags?: string[];
    summary?: string;
    improvements?: string[];
  } | null>(null);

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const aiSuggestions = await getAISuggestions(note);
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!suggestions) {
    return (
      <div className="ai-suggestions">
        <Button onClick={handleGetSuggestions} disabled={loading}>
          {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
        </Button>
      </div>
    );
  }

  return (
    <div className="ai-suggestions space-y-4">
      {suggestions.title && (
        <div>
          <h3 className="font-semibold">Suggested Title</h3>
          <p>{suggestions.title}</p>
          <Button onClick={() => onApplySuggestion({ title: suggestions.title })}>
            Apply Title
          </Button>
        </div>
      )}

      {suggestions.tags && suggestions.tags.length > 0 && (
        <div>
          <h3 className="font-semibold">Suggested Tags</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 rounded"
                onClick={() =>
                  onApplySuggestion({
                    tags: [...new Set([...(note.tags || []), tag])],
                  })
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {suggestions.summary && (
        <div>
          <h3 className="font-semibold">Summary</h3>
          <p>{suggestions.summary}</p>
        </div>
      )}

      {suggestions.improvements && suggestions.improvements.length > 0 && (
        <div>
          <h3 className="font-semibold">Suggested Improvements</h3>
          <ul className="list-disc list-inside">
            {suggestions.improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 