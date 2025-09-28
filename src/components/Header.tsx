import { useAuth } from "@/AuthProvider";
import {
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
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

type Props = {
  newNote: () => void;
  setSelectedBoardId: (boardId: string) => void;
  selectedBoardId: string;
  deleteBoard: UseMutationResult<any, Error, string, unknown>;
};

const Header = (props: Props) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { token, removeToken } = useAuth();

  const queryClient = useQueryClient();

  const boards = useQuery<Board[]>({
    queryKey: ["boards"],
    refetchInterval: 1000,
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
      const data = await response.json();
      return data.boards;
    },
    initialData: [],
  });

  // Select the first board after fetching
  useEffect(() => {
    if (boards.data.length > 0 && !props.selectedBoardId) {
      props.setSelectedBoardId(boards.data[0]._id);
    }
  }, [boards, props.selectedBoardId]);

  const deleteBoard = () => {
    props.deleteBoard.mutate(props.selectedBoardId);
    props.setSelectedBoardId("");
  };

  const getBoardById = (id: string) => {
    return boards.data.find((board) => board._id === id) || null;
  };

  const handleLogout = () => {
    removeToken();
    queryClient.removeQueries({ queryKey: ["notes", props.selectedBoardId] });
    queryClient.removeQueries({ queryKey: ["boards"] });
    props.setSelectedBoardId("");
  };

  return (
    <header className="flex items-center justify-between p-2 border-b gap-2">
      <div className="flex-1 flex gap-2 items-center">
        <Select
          value={boards.data.length === 0 ? "no-boards" : props.selectedBoardId}
          onValueChange={(value) => {
            if (value === "create-board") {
              setShowCreateDialog(true);
              return;
            }
            if (boards.data.length === 0) {
              return;
            }
            props.setSelectedBoardId(value);
          }}
        >
          <SelectTrigger className="flex-1 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {boards.data.length === 0 && (
                <SelectItem
                  value="no-boards"
                  disabled
                  className="text-muted-foreground cursor-not-allowed"
                >
                  No boards available - Press here to create one
                </SelectItem>
              )}
              {boards.data.map((board) => (
                <SelectItem
                  key={board._id}
                  value={board._id}
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
        boardId={getBoardById(props.selectedBoardId)?._id ?? ""}
        boardTitle={getBoardById(props.selectedBoardId)?.title ?? ""}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
      <Button
        disabled={props.selectedBoardId === ""}
        onClick={() => setShowInviteDialog(true)}
        className="cursor-pointer"
        variant={"outline"}
      >
        Invite user
      </Button>
      <Button
        onClick={props.newNote}
        className="cursor-pointer"
        disabled={props.selectedBoardId === ""}
      >
        New note
      </Button>
      <Button
        disabled={props.selectedBoardId === ""}
        variant="destructive"
        onClick={deleteBoard}
        className="cursor-pointer"
      >
        Leave board
      </Button>
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="cursor-pointer"
      >
        Logout
      </Button>
    </header>
  );
};

export default Header;
