import { Note, Block } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getAISuggestions = async (note: Note) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found');
  }

  const prompt = `Analyze this note and provide suggestions:
Title: ${note.title}
Content: ${note.content.map((block: Block) => block.content).join('\n')}

Please provide:
1. A better title if the current one is not descriptive
2. Relevant tags
3. A brief summary
4. Suggestions for improvement`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const suggestions = data.choices[0].message.content;

    // Parse the AI response into structured data
    const titleMatch = suggestions.match(/Title: (.*?)(?:\n|$)/);
    const tagsMatch = suggestions.match(/Tags: (.*?)(?:\n|$)/);
    const summaryMatch = suggestions.match(/Summary: (.*?)(?:\n|$)/);
    const improvementsMatch = suggestions.match(/Improvements: (.*?)(?:\n|$)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : undefined,
      tags: tagsMatch ? tagsMatch[1].split(',').map((tag: string) => tag.trim()) : undefined,
      summary: summaryMatch ? summaryMatch[1].trim() : undefined,
      improvements: improvementsMatch ? improvementsMatch[1].split('\n').map((imp: string) => imp.trim()) : undefined,
    };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    throw error;
  }
};

export const detectTone = async (content: string) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found');
  }

  const prompt = `Analyze the tone of this text and suggest an appropriate emoji:
${content}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error detecting tone:', error);
    throw error;
  }
}; 