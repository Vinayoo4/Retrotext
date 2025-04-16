import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Block } from '@/types';
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
      try {
        const json = editor.getJSON();
        if (!json?.content) return;

        const newBlocks: Block[] = json.content.map((node, index) => ({
          id: crypto.randomUUID(),
          type: node.type as Block['type'],
          content: node.content?.[0]?.text || '',
          order: index,
          metadata: node.attrs ?? {},
        }));

        onUpdate(newBlocks);
      } catch (err) {
        console.error('Failed to parse editor content:', err);
      }
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...blocks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder(reordered);
  };

  return (
    <div className="block-editor space-y-4">
      <BlockToolbar editor={editor} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock key={block.id} block={block} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
