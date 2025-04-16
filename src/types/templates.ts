export type NoteCategory = 'journal' | 'todo' | 'meeting' | 'study' | 'idea' | 'task' | 'daily';

export type NoteTone = 'professional' | 'personal' | 'academic' | 'casual' | 'reflective';

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'journal' | 'todo' | 'meeting' | 'study' | 'other';
  content: string;
  tags: string[];
  emoji: string;
}

export interface SmartCategorization {
  category: string;
  confidence: number;
  tone: 'formal' | 'casual' | 'professional' | 'personal';
  suggestedTags: string[];
  suggestedEmoji: string;
} 