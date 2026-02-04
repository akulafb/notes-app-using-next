"use client";

import { useState, useEffect } from "react";
import { Reorder, AnimatePresence, useDragControls } from "motion/react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GripVertical } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string | null;
}

interface NotesGridProps {
  notes: Note[];
  deleteNote: (formData: FormData) => void;
}

// Size presets: [gridCols, cardHeight]
const SIZE_PRESETS: Record<number, { cols: string; height: string }> = {
  0: { cols: "grid-cols-1", height: "h-64" },
  25: { cols: "grid-cols-1 sm:grid-cols-2", height: "h-56" },
  50: { cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", height: "h-48" },
  75: { cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", height: "h-40" },
  100: { cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5", height: "h-32" },
};

function getSizeConfig(value: number) {
  // Find the closest preset
  const keys = Object.keys(SIZE_PRESETS).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const key of keys) {
    if (value >= key) closest = key;
    else break;
  }
  return SIZE_PRESETS[closest];
}

interface ReorderableNoteItemProps {
  note: Note;
  index: number;
  sizeConfig: { cols: string; height: string };
  sizeValue: number;
  deleteNote: (formData: FormData) => void;
}

function ReorderableNoteItem({
  note,
  index,
  sizeConfig,
  sizeValue,
  deleteNote,
}: ReorderableNoteItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={note}
      dragControls={dragControls}
      dragListener={false}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.03,
      }}
      whileDrag={{
        scale: 1.02,
        zIndex: 50,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
      className="list-none"
    >
      <div
        className={`group relative flex ${sizeConfig.height} flex-col rounded-lg border border-border bg-card p-4 transition-colors`}
      >
        {/* Drag Handle */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="absolute left-2 top-2 cursor-grab active:cursor-grabbing text-muted-foreground transition-colors hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-hidden pl-6">
          <h3 className={`line-clamp-2 text-sm font-medium text-card-foreground ${sizeValue >= 75 ? "text-xs" : ""}`}>
            {note.title}
          </h3>
          {note.content && (
            <p className={`${sizeValue >= 75 ? "line-clamp-2 text-xs" : sizeValue >= 50 ? "line-clamp-3 text-xs" : "line-clamp-4 text-sm"} flex-1 text-muted-foreground`}>
              {note.content}
            </p>
          )}
        </div>
        <form
          action={deleteNote}
          className="mt-3 flex justify-end opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        >
          <input type="hidden" name="id" value={note.id} />
          <Button type="submit" size="sm" variant="destructive">
            Delete
          </Button>
        </form>
      </div>
    </Reorder.Item>
  );
}

export function NotesGrid({ notes, deleteNote }: NotesGridProps) {
  const [orderedNotes, setOrderedNotes] = useState(notes);
  const [sizeValue, setSizeValue] = useState(50); // Default to medium size

  // Sync orderedNotes when notes prop changes (e.g., new note added)
  useEffect(() => {
    const existingIds = new Set(orderedNotes.map((n) => n.id));
    const newNotes = notes.filter((n) => !existingIds.has(n.id));
    if (newNotes.length > 0) {
      setOrderedNotes([...newNotes, ...orderedNotes]);
    }
    // Remove deleted notes
    const noteIds = new Set(notes.map((n) => n.id));
    setOrderedNotes((prev) => prev.filter((n) => noteIds.has(n.id)));
  }, [notes]);

  const sizeConfig = getSizeConfig(sizeValue);

  return (
    <div className="space-y-4">
      {/* Size Control */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
        <label className="text-sm font-medium text-card-foreground whitespace-nowrap">
          Size:
        </label>
        <Slider
          value={sizeValue}
          onValueChange={setSizeValue}
          min={0}
          max={100}
          step={25}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
          {sizeValue === 0 ? "Large" : sizeValue === 25 ? "Medium-Large" : sizeValue === 50 ? "Medium" : sizeValue === 75 ? "Small" : "Compact"}
        </span>
      </div>

      {/* Reorderable Grid */}
      <Reorder.Group
        axis="y"
        values={orderedNotes}
        onReorder={setOrderedNotes}
        className={`grid ${sizeConfig.cols} gap-3`}
        as="ul"
      >
        <AnimatePresence mode="popLayout">
          {orderedNotes.map((note, index) => (
            <ReorderableNoteItem
              key={note.id}
              note={note}
              index={index}
              sizeConfig={sizeConfig}
              sizeValue={sizeValue}
              deleteNote={deleteNote}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
