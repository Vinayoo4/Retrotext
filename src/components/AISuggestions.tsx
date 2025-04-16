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

  const handleApplyTag = (tag: string) => {
    const updatedTags = [...new Set([...(note.tags || []), tag])];
    onApplySuggestion({ tags: updatedTags });
  };

  const SuggestionSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );

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
        <SuggestionSection title="Suggested Title">
          <p>{suggestions.title}</p>
          <Button onClick={() => onApplySuggestion({ title: suggestions.title })}>
            Apply Title
          </Button>
        </SuggestionSection>
      )}

      {suggestions.tags?.length > 0 && (
        <SuggestionSection title="Suggested Tags">
          <div className="flex flex-wrap gap-2">
            {suggestions.tags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleApplyTag(tag)}
                className="cursor-pointer px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </SuggestionSection>
      )}

      {suggestions.summary && (
        <SuggestionSection title="Summary">
          <p>{suggestions.summary}</p>
        </SuggestionSection>
      )}

      {suggestions.improvements?.length > 0 && (
        <SuggestionSection title="Suggested Improvements">
          <ul className="list-disc list-inside">
            {suggestions.improvements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </SuggestionSection>
      )}
    </div>
  );
};
