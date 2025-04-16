import create from 'zustand';

interface TemplateStore {
  templates: { id: string; name: string; category: string; description: string }[];
  analyzeContent: (content: string) => Promise<{
    category: string;
    confidence: number;
    tone: string;
    suggestedTags: string[];
    suggestedEmoji: string;
  }>;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [
    { id: '1', name: 'Journal', category: 'journal', description: 'Daily journal template' },
    { id: '2', name: 'To-Do List', category: 'todo', description: 'Task management template' },
  ],
  analyzeContent: async (content) => {
    // Simulate analysis logic
    const category = content.includes('task') ? 'todo' : 'journal';
    const confidence = 0.9;
    const tone = content.includes('urgent') ? 'Urgent' : 'Neutral';
    const suggestedTags = content.split(' ').filter((word) => word.length > 5);
    const suggestedEmoji = tone === 'Urgent' ? '⚠️' : '📝';

    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ category, confidence, tone, suggestedTags, suggestedEmoji });
      }, 1000)
    );
  },
}));