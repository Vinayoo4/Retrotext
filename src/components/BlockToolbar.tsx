import { Editor } from '@tiptap/react';
import { Button } from './ui/Button';

interface BlockToolbarProps {
  editor: Editor | null;
}

const toolbarButtons = [
  {
    label: 'H1',
    isActive: (editor: Editor) => editor.isActive('heading', { level: 1 }),
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: 'H2',
    isActive: (editor: Editor) => editor.isActive('heading', { level: 2 }),
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Bullet List',
    isActive: (editor: Editor) => editor.isActive('bulletList'),
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: 'Code',
    isActive: (editor: Editor) => editor.isActive('codeBlock'),
    action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    label: 'Divider',
    isActive: () => false, // Divider doesn't toggle
    action: (editor: Editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];

export const BlockToolbar = ({ editor }: BlockToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="block-toolbar flex gap-2 mb-4">
      {toolbarButtons.map(({ label, isActive, action }) => (
        <Button
          key={label}
          onClick={() => action(editor)}
          active={isActive(editor)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
