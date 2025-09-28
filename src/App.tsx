import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Note from "./components/Note";

export type NoteData = {
  _id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

function App() {
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const { token } = useAuth();

  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedBoardId("");
  }, [token]);

  const notes = useQuery<NoteData[]>({
    queryKey: ["notes", selectedBoardId],
    refetchInterval: 1000,
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BOARD_API_URL}/boards/${selectedBoardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(await response.json());
      }
      const data = await response.json();
      return data.board.notes;
    },
    initialData: [],
    enabled: !!selectedBoardId,
  });

  const newNoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BOARD_API_URL}/boards/${selectedBoardId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: "New Note",
            x: 0,
            y: 0,
            width: 200,
            height: 200,
            color: "yellow",
          }),
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    },
    onSuccess: () => {
      notes.refetch();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_BOARD_API_URL}/boards/${selectedBoardId}/notes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    },
    onSettled: () => {
      notes.refetch();
    },
  });

  const patchNoteMutation = useMutation({
    mutationFn: async (note: Partial<NoteData>) => {
      const modifiedNote = { ...note };
      delete modifiedNote._id;
      const response = await fetch(
        `${import.meta.env.VITE_BOARD_API_URL}/boards/${selectedBoardId}/notes/${note._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(note),
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    },
    onSettled: () => {
      notes.refetch();
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_BOARD_API_URL}/boards/${id}/owners/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ["notes", selectedBoardId] });
      queryClient.removeQueries({ queryKey: ["boards"] });
      setSelectedBoardId("");
    },
  });

  const newNote = () => {
    newNoteMutation.mutate();
  };

  const deleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  if (!token) {
    return <Auth />;
  }

  return (
    <>
      <Header
        newNote={newNote}
        setSelectedBoardId={setSelectedBoardId}
        selectedBoardId={selectedBoardId}
        deleteBoard={deleteBoardMutation}
      />
      <main className="p-2 h-[calc(100vh-56px)]">
        {notes.data.map((note) => (
          <Note
            key={note._id}
            noteData={note}
            deleteNote={deleteNote}
            patchNoteMutation={patchNoteMutation}
          />
        ))}
      </main>
    </>
  );
}

export default App;
