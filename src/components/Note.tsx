import type { NoteData } from "@/App";
import type { UseMutationResult } from "@tanstack/react-query";
import clsx from "clsx";
import { LucidePalette, LucideX } from "lucide-react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardHeader } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";

const colors = {
  red: "bg-red-100 border-red-200 hover:bg-red-100",
  orange: "bg-orange-100 border-orange-200 hover:bg-orange-100",
  yellow: "bg-yellow-100 border-yellow-200 hover:bg-yellow-100",
  green: "bg-green-100 border-green-200 hover:bg-green-100",
  teal: "bg-teal-100 border-teal-200 hover:bg-teal-100",
  emerald: "bg-emerald-100 border-emerald-200 hover:bg-emerald-100",
  blue: "bg-blue-100 border-blue-200 hover:bg-blue-100",
  purple: "bg-purple-100 border-purple-200 hover:bg-purple-100",
  pink: "bg-pink-100 border-pink-200 hover:bg-pink-100",
};

type Props = {
  noteData: NoteData;
  deleteNote: (id: string) => void;
  patchNoteMutation: UseMutationResult<any, Error, Partial<NoteData>, unknown>;
};

const Note = (props: Props) => {
  const [text, setText] = useState(props.noteData.text);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const saveNote = () => {
    props.patchNoteMutation.mutate({
      _id: props.noteData._id,
      text,
    });
  };

  const updateText = (newText: string) => {
    setIsEdited(true);
    setText(newText);
  };

  const updateColor = (newColor: string) => {
    setIsColorPaletteOpen(false);
    props.patchNoteMutation.mutate({
      _id: props.noteData._id,
      color: newColor,
    });
  };

  const savePosition = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    props.patchNoteMutation.mutate({
      _id: props.noteData._id,
      x,
      y,
      width,
      height,
    });
  };

  useEffect(() => {
    if (!isEdited) return;
    const timeout = setTimeout(() => {
      saveNote();
      setIsEdited(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [text, isEdited]);

  const [position, setPosition] = useState({
    x: props.noteData.x,
    y: props.noteData.y,
    width: props.noteData.width,
    height: props.noteData.height,
  });

  useEffect(() => {
    setPosition({
      x: props.noteData.x,
      y: props.noteData.y,
      width: props.noteData.width,
      height: props.noteData.height,
    });
    if (!isEdited) {
      setText(props.noteData.text);
    }
  }, [
    props.noteData.x,
    props.noteData.y,
    props.noteData.width,
    props.noteData.height,
    props.noteData.text,
  ]);

  return (
    <Rnd
      position={{ x: position.x, y: position.y }}
      size={{ width: position.width, height: position.height }}
      onResizeStop={(_, __, ref, ____, newPosition) => {
        setPosition({
          x: newPosition.x,
          y: newPosition.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
        savePosition(
          newPosition.x,
          newPosition.y,
          ref.offsetWidth,
          ref.offsetHeight
        );
      }}
      onDragStop={(_, newPosition) => {
        setPosition((prev) => ({
          ...prev,
          x: newPosition.x,
          y: newPosition.y,
        }));
        savePosition(
          newPosition.x,
          newPosition.y,
          position.width,
          position.height
        );
      }}
      bounds={"parent"}
      minWidth={200}
      minHeight={100}
      dragHandleClassName="drag-handle"
    >
      <Card
        className={clsx(
          "pb-0 pt-2 gap-0 h-full w-full select-none",
          colors[props.noteData.color as keyof typeof colors]
        )}
      >
        <CardHeader className="[.border-b]:pb-2 border-b px-2 drag-handle cursor-move border-inherit">
          <CardAction className="flex items-center justify-end gap-2">
            <Popover
              open={isColorPaletteOpen}
              onOpenChange={setIsColorPaletteOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  className="cursor-pointer p-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-transparent"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsColorPaletteOpen(true)}
                >
                  <LucidePalette />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 grid grid-cols-3 rounded-none border-0">
                {Object.keys(colors).map((col) => (
                  <Button
                    key={col}
                    className={clsx(
                      "cursor-pointer p-0 w-8 h-8 rounded-none",
                      colors[col as keyof typeof colors]
                    )}
                    size="icon"
                    variant="ghost"
                    onClick={() => updateColor(col)}
                  ></Button>
                ))}
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => props.deleteNote(props.noteData._id)}
              className="cursor-pointer p-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white"
              variant="ghost"
              size="icon"
            >
              <LucideX />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="h-full w-full p-0">
          <Textarea
            value={text}
            onChange={(e) => updateText(e.target.value)}
            placeholder="Write your note here..."
            className="w-full h-full resize-none min-h-0 px-2 rounded-none border-0 focus:ring-0 focus-visible:ring-0 shadow-none"
          />
        </CardContent>
      </Card>
    </Rnd>
  );
};

export default Note;
