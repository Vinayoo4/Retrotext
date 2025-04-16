import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '../types';

interface SortableBlockProps {
  block: Block;
}

export const SortableBlock = ({ block }: SortableBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="sortable-block"
    >
      {block.type === 'heading' && (
        <h1 className="text-2xl font-bold">{block.content}</h1>
      )}
      {block.type === 'paragraph' && (
        <p className="text-base">{block.content}</p>
      )}
      {block.type === 'todo' && (
        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <span>{block.content}</span>
        </div>
      )}
      {block.type === 'code' && (
        <pre className="bg-gray-100 p-4 rounded">
          <code>{block.content}</code>
        </pre>
      )}
      {block.type === 'divider' && <hr className="my-4" />}
      {block.type === 'image' && (
        <img src={block.content} alt="" className="max-w-full" />
      )}
    </div>
  );
}; 