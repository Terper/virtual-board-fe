import { useState } from "react";
import Header from "./components/Header";
import Note from "./components/Note";

export type NoteData = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

function App() {
  const [notes, setNotes] = useState<NoteData[]>([]);

  const newNote = () => {
    const newNote: NoteData = {
      id: crypto.randomUUID(),
      text: "",
      x: 0,
      y: 0,
      width: 300,
      height: 150,
      color: "yellow",
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    console.log("Created new note:", newNote);
  };

  const deleteNote = (id: string) => {
    console.log("Deleted note:", id);
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <>
      <Header newNote={newNote} />
      <main className="p-2 h-[calc(100vh-56px)]">
        {notes.map((note) => (
          <Note key={note.id} noteData={note} deleteNote={deleteNote} />
        ))}
      </main>
    </>
  );
}

export default App;
