import { Block } from '../types';

interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
}

const templates: Template[] = [
  {
    id: 'journal',
    name: 'Journal Entry',
    description: 'Daily journal template with mood tracking',
    blocks: [
      {
        id: '1',
        type: 'heading',
        content: 'Daily Journal',
        order: 0,
      },
      {
        id: '2',
        type: 'paragraph',
        content: 'How are you feeling today?',
        order: 1,
      },
      {
        id: '3',
        type: 'todo',
        content: 'Highlights of the day',
        order: 2,
      },
      {
        id: '4',
        type: 'todo',
        content: 'Challenges faced',
        order: 3,
      },
      {
        id: '5',
        type: 'paragraph',
        content: 'Gratitude',
        order: 4,
      },
    ],
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Template for capturing meeting discussions and action items',
    blocks: [
      {
        id: '1',
        type: 'heading',
        content: 'Meeting Notes',
        order: 0,
      },
      {
        id: '2',
        type: 'paragraph',
        content: 'Attendees:',
        order: 1,
      },
      {
        id: '3',
        type: 'paragraph',
        content: 'Agenda:',
        order: 2,
      },
      {
        id: '4',
        type: 'todo',
        content: 'Action Items',
        order: 3,
      },
      {
        id: '5',
        type: 'paragraph',
        content: 'Next Steps',
        order: 4,
      },
    ],
  },
  {
    id: 'study',
    name: 'Study Notes',
    description: 'Template for organizing study materials and key concepts',
    blocks: [
      {
        id: '1',
        type: 'heading',
        content: 'Study Notes',
        order: 0,
      },
      {
        id: '2',
        type: 'paragraph',
        content: 'Key Concepts',
        order: 1,
      },
      {
        id: '3',
        type: 'code',
        content: 'Code Examples',
        order: 2,
      },
      {
        id: '4',
        type: 'todo',
        content: 'Questions to Review',
        order: 3,
      },
      {
        id: '5',
        type: 'paragraph',
        content: 'Summary',
        order: 4,
      },
    ],
  },
];

interface NoteTemplatesProps {
  onSelectTemplate: (blocks: Block[]) => void;
}

export const NoteTemplates = ({ onSelectTemplate }: NoteTemplatesProps) => {
  return (
    <div className="note-templates">
      <h2 className="text-xl font-bold mb-4">Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectTemplate(template.blocks)}
          >
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 