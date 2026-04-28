import { cn } from "@/lib/utils";
import Link from "@tiptap/extension-link";
import { TableKit } from "@tiptap/extension-table";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import TipTapToolbar from "./TipTapToolbar";

interface TipTapEditorProps {
  value?: string;
  onChange?: (html: string) => void;
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
      }),
      ImageResize.configure({
        inline: false,
      }),
    //   Image,
      TableKit.configure({ table: { resizable: true } }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class: [
          "tiptap px-4 py-3.5 min-h-[120px] outline-none",
          "font-sans text-[15px] leading-[1.75]",
          "text-foreground max-w-none",
        ].join(" "),
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isStrike: editor.isActive("strike"),
      isH2: editor.isActive("heading", { level: 2 }),
      isBullet: editor.isActive("bulletList"),
      isOrdered: editor.isActive("orderedList"),
      isBlockquote: editor.isActive("blockquote"),
      isCode: editor.isActive("code"),
    }),
  });

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background overflow-hidden",
        "transition-[border-color,box-shadow] duration-150",
        "focus-within:border-foreground/40 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]",
      )}
    >
      <TipTapToolbar editor={editor} editorState={editorState} />
      <EditorContent editor={editor} />
    </div>
  );
}
