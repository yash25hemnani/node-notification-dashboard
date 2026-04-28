import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading2,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  TextQuote,
} from "lucide-react";
import { useState } from "react";
import AppDialog from "./ui/app-dialog";
import { Box } from "./ui/box";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}

type EditorToolbarState = {
  isBold: boolean;
  isItalic: boolean;
  isStrike: boolean;
  isH2: boolean;
  isBullet: boolean;
  isOrdered: boolean;
  isBlockquote: boolean;
  isCode: boolean;
};

interface TipTapToolbarProps {
  editor: Editor;
  editorState: EditorToolbarState;
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-md transition-colors",
        isActive
          ? "bg-foreground text-background border border-foreground hover:bg-foreground/90"
          : "bg-transparent text-foreground border border-transparent hover:border-border hover:bg-muted",
      )}
    >
      {children}
    </Button>
  );
}

function ToolbarSep() {
  return <div className="w-px h-4.5 bg-border mx-1 shrink-0" />;
}

// ── Toolbar ───────────────────────────────────────────────────────────────────
export default function TipTapToolbar({
  editor,
  editorState,
}: TipTapToolbarProps) {
  const [addImageDialogOpen, setAddImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleInsert = () => {
    console.log(imageUrl)
    if (!imageUrl.trim()) return;
    editor.chain().focus().insertContent(`<img src="${imageUrl.trim()}" />`).run();
    setImageUrl("");
    setAddImageDialogOpen(false);
  };

  return (
    <Box className="flex items-center gap-0.5 px-2.5 py-1.5 border-b border-border bg-muted/40">
      <ToolbarButton
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editorState.isBold}
      >
        <Bold size={14} />
      </ToolbarButton>

      <ToolbarButton
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editorState.isItalic}
      >
        <Italic size={14} />
      </ToolbarButton>

      <ToolbarButton
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editorState.isStrike}
      >
        <Strikethrough size={14} />
      </ToolbarButton>

      <ToolbarSep />

      <ToolbarButton
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editorState.isH2}
      >
        <Heading2 size={14} />
      </ToolbarButton>

      <ToolbarButton
        title="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editorState.isBullet}
      >
        <List size={14} />
      </ToolbarButton>

      <ToolbarButton
        title="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editorState.isOrdered}
      >
        <ListOrdered size={14} />
      </ToolbarButton>

      <ToolbarButton
        title="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editorState.isBlockquote}
      >
        <TextQuote size={14} />
      </ToolbarButton>

      <ToolbarSep />

      <ToolbarButton
        title="Inline code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editorState.isCode}
      >
        <Code size={14} />
      </ToolbarButton>

      <ToolbarSep />

      <ToolbarButton
        title="Add Image"
        onClick={() => setAddImageDialogOpen(true)}
        isActive={addImageDialogOpen}
      >
        <ImageIcon size={14} />
      </ToolbarButton>

      <ToolbarSep />

      <AppDialog
        heading="Insert Image"
        open={addImageDialogOpen}
        onClose={() => setAddImageDialogOpen(true)}
      >
        <Box className="flex flex-col gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Box className="flex justify-end gap-2">
            <Button variant={"outline"}>Close</Button>
            <Button onClick={() => handleInsert()}>Add</Button>
          </Box>
        </Box>
      </AppDialog>
    </Box>
  );
}
