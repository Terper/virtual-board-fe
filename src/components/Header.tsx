import { useAuth } from "@/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CreateBoardDialog from "./CreateBoardDialog";
import JoinBoardDialog from "./InviteDialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Board = {
  _id: string;
  title: string;
};

type BoardsResponse = { boards: Board[] };

type Props = {
  newNote: () => void;
  setSelectedBoardId: (boardId: string) => void;
};

const Header = (props: Props) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const { removeToken } = useAuth();

  const { token } = useAuth();

  const query = useQuery<BoardsResponse>({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BOARD_API_URL}/boards`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response.json();
    },
    initialData: { boards: [] },
  });

  const boards = query.data.boards;

  // Select the first board after fetching
  useEffect(() => {
    if (boards.length > 0 && !selectedBoard) {
      setSelectedBoard(boards[0]);
      props.setSelectedBoardId(boards[0]._id);
    }
  }, [boards, selectedBoard]);

  return (
    <header className="flex items-center justify-between p-2 border-b gap-2">
      <div className="flex-1 flex gap-2 items-center">
        <Select
          value={
            boards.length === 0 ? "no-boards" : (selectedBoard?.title ?? "")
          }
          onValueChange={(value) => {
            if (value === "create-board") {
              setShowCreateDialog(true);
              return;
            }
            if (boards.length === 0) return;
            const board = boards.find((b) => b.title === value);
            if (board) {
              setSelectedBoard(board);
              props.setSelectedBoardId(board._id);
            }
          }}
        >
          <SelectTrigger className="flex-1 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {boards.length === 0 && (
                <SelectItem
                  value="no-boards"
                  disabled
                  className="text-muted-foreground cursor-not-allowed"
                >
                  No boards available
                </SelectItem>
              )}
              {boards.map((board) => (
                <SelectItem
                  key={board._id}
                  value={board.title}
                  className="cursor-pointer"
                >
                  {board.title}
                </SelectItem>
              ))}
              <SelectItem
                value="create-board"
                className="text-blue-600 cursor-pointer"
              >
                Create board
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <CreateBoardDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <JoinBoardDialog
        boardId={selectedBoard?._id ?? ""}
        boardTitle={selectedBoard?.title ?? ""}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
      <Button
        disabled={selectedBoard === null}
        onClick={() => setShowInviteDialog(true)}
        className="cursor-pointer"
        variant={"outline"}
      >
        Invite user
      </Button>
      <Button onClick={props.newNote} className="cursor-pointer">
        New note
      </Button>
      <Button
        variant="destructive"
        onClick={removeToken}
        className="cursor-pointer"
      >
        Logout
      </Button>
    </header>
  );
};

export default Header;
