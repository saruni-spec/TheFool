"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-slate-700 bg-slate-900/50 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("bold") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("italic") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("strike") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-700 mx-1 self-center" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("heading", { level: 1 }) ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("heading", { level: 2 }) ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-slate-700 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("bulletList") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("orderedList") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-slate-700 mx-1 self-center" />

      <button
        type="button"
        onClick={setLink}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("link") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={addImage}
        className="p-1.5 rounded hover:bg-slate-800 transition-colors text-slate-400"
        title="Image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("blockquote") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
          editor.isActive("codeBlock") ? "bg-purple-500/20 text-purple-400" : "text-slate-400"
        }`}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="flex-grow" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-1.5 rounded hover:bg-slate-800 transition-colors text-slate-400 disabled:opacity-50"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-1.5 rounded hover:bg-slate-800 transition-colors text-slate-400 disabled:opacity-50"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-purple-400 hover:text-purple-300 underline',
        }
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'rounded-lg max-h-[500px] object-contain my-4 border border-slate-700',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something amazing...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-slate-300",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full rounded-lg border border-slate-800 bg-slate-950 overflow-hidden focus-within:ring-2 focus-within:ring-purple-400/50 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
