import { useState } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { NoteTemplate, SmartCategorization } from '../types/templates';
import { Book, Calendar, ClipboardList, FileText } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (template: NoteTemplate) => void;
  content?: string;
}

const TemplateSelector = ({ onSelect, content }: TemplateSelectorProps) => {
  const templates = useTemplateStore(state => state.templates);
  const analyzeContent = useTemplateStore(state => state.analyzeContent);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<SmartCategorization | null>(null);

  const handleAnalyze = () => {
    if (content) {
      const result = analyzeContent(content);
      setAnalysis(result);
      setShowAnalysis(true);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'journal':
        return <Book className="w-5 h-5" />;
      case 'todo':
        return <ClipboardList className="w-5 h-5" />;
      case 'meeting':
        return <FileText className="w-5 h-5" />;
      case 'study':
        return <Book className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {getIcon(template.category)}
            <div className="text-left">
              <div className="font-medium">{template.name}</div>
              <div className="text-sm text-gray-500">{template.description}</div>
            </div>
          </button>
        ))}
      </div>

      {content && (
        <div className="mt-4">
          <button
            onClick={handleAnalyze}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Analyze Content
          </button>
          
          {showAnalysis && analysis && (
            <div className="mt-2 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-2">Content Analysis</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Category:</span>{' '}
                  <span className="font-medium">{analysis.category}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round(analysis.confidence * 100)}% confidence)
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tone:</span>{' '}
                  <span className="font-medium">{analysis.tone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Suggested Tags:</span>{' '}
                  <span className="font-medium">
                    {analysis.suggestedTags.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Suggested Emoji:</span>{' '}
                  <span className="text-xl">{analysis.suggestedEmoji}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector; 