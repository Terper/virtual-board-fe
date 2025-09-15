import { LucideX } from "lucide-react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";

type Props = {};

const Note = (props: Props) => {
  const [text, setText] = useState("");
  const [isEdited, setIsEdited] = useState(false);

  const deleteNote = () => {
    console.log("Deleted note");
  };

  const saveNote = () => {
    console.log("Saved note:", text);
  };

  const updateText = (newText: string) => {
    setIsEdited(true);
    setText(newText);
  };

  useEffect(() => {
    if (!isEdited) return;

    const timeout = setTimeout(() => {
      saveNote();
      setIsEdited(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [text, isEdited]);

  return (
    <Rnd
      bounds={"parent"}
      default={{ x: 0, y: 0, width: 300, height: 150 }}
      minWidth={200}
      minHeight={100}
      dragHandleClassName="drag-handle"
    >
      <Card className="pb-0 pt-2 gap-0 h-full w-full select-none">
        <CardHeader className="[.border-b]:pb-2 border-b px-2 drag-handle cursor-move">
          <CardAction>
            <Button
              onClick={deleteNote}
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
