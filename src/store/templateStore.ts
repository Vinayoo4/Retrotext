import { create } from 'zustand';
import { NoteTemplate, SmartCategorization } from '../types/templates';

const defaultTemplates: NoteTemplate[] = [
  {
    id: 'journal',
    name: 'Journal Entry',
    description: 'A template for daily journaling and personal reflections',
    category: 'journal',
    content: `# Journal Entry

## Today's Highlights
- 

## Thoughts & Reflections
- 

## Goals for Tomorrow
- `,
    tags: ['journal', 'reflection', 'personal'],
    emoji: '📝',
  },
  {
    id: 'todo',
    name: 'To-Do List',
    description: 'A template for organizing tasks and priorities',
    category: 'todo',
    content: `# To-Do List

## High Priority
- [ ] 

## Medium Priority
- [ ] 

## Low Priority
- [ ] `,
    tags: ['todo', 'tasks', 'productivity'],
    emoji: '✅',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'A template for capturing meeting discussions and action items',
    category: 'meeting',
    content: `# Meeting Notes

## Attendees
- 

## Agenda
1. 
2. 
3. 

## Discussion Points
- 

## Action Items
- [ ] `,
    tags: ['meeting', 'work', 'professional'],
    emoji: '📅',
  },
  {
    id: 'study',
    name: 'Study Notes',
    description: 'A template for organizing study materials and key concepts',
    category: 'study',
    content: `# Study Notes

## Topic

## Key Concepts
- 

## Important Points
- 

## Questions to Review
- `,
    tags: ['study', 'learning', 'education'],
    emoji: '📚',
  },
];

interface TemplateStore {
  templates: NoteTemplate[];
  analyzeContent: (content: string) => SmartCategorization;
}

const useTemplateStore = create<TemplateStore>((set) => ({
  templates: defaultTemplates,
  analyzeContent: (content: string) => {
    // Simple content analysis based on keywords
    const keywords = {
      journal: ['today', 'reflection', 'thought', 'feel', 'experience'],
      todo: ['task', 'do', 'complete', 'finish', 'check'],
      meeting: ['meeting', 'discuss', 'present', 'team', 'project'],
      study: ['learn', 'study', 'concept', 'understand', 'review'],
    };

    let maxMatches = 0;
    let detectedCategory = 'other';
    let confidence = 0;

    // Count keyword matches for each category
    Object.entries(keywords).forEach(([category, words]) => {
      const matches = words.filter(word => 
        content.toLowerCase().includes(word)
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedCategory = category;
        confidence = matches / words.length;
      }
    });

    // Determine tone based on content characteristics
    const wordCount = content.split(/\s+/).length;
    const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
    const hasFormalWords = /(regards|sincerely|dear|best)/i.test(content);
    
    let tone: SmartCategorization['tone'] = 'casual';
    if (hasFormalWords) {
      tone = 'formal';
    } else if (wordCount > 200 && !hasEmojis) {
      tone = 'professional';
    }

    // Suggest tags based on category and content
    const suggestedTags = [
      detectedCategory,
      ...defaultTemplates.find(t => t.category === detectedCategory)?.tags || [],
    ];

    // Suggest emoji based on category
    const suggestedEmoji = defaultTemplates.find(t => t.category === detectedCategory)?.emoji || '📝';

    return {
      category: detectedCategory,
      confidence,
      tone,
      suggestedTags,
      suggestedEmoji,
    };
  },
}));

export default useTemplateStore; 