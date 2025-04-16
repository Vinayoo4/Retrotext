import { Editor } from '@tiptap/react';
import { Button } from './ui/Button';

interface BlockToolbarProps {
  editor: Editor | null;
}

export const BlockToolbar = ({ editor }: BlockToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="block-toolbar">
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
      >
        H1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      >
        H2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        Bullet List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
      >
        Code
      </Button>
      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        Divider
      </Button>
    </div>
  );
}; 