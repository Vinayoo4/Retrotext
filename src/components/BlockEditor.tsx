import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Block } from '@/types'; // Fixed import path
import { BlockToolbar } from './BlockToolbar';
import { SortableBlock } from './SortableBlock';

interface BlockEditorProps {
  blocks: Block[];
  onUpdate: (blocks: Block[]) => void;
  onReorder: (blocks: Block[]) => void;
}

export const BlockEditor = ({ blocks, onUpdate, onReorder }: BlockEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      // Convert TipTap content to our Block format
      const newBlocks = content.content?.map((node, index) => ({
        id: crypto.randomUUID(),
        type: node.type as Block['type'],
        content: node.content?.[0]?.text || '',
        order: index,
        metadata: node.attrs,
      })) || [];
      onUpdate(newBlocks);
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      const newBlocks = [...blocks];
      const [removed] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, removed);
      onReorder(newBlocks);
    }
  };

  return (
    <div className="block-editor">
      <BlockToolbar editor={editor} />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock key={block.id} block={block} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}; 