import { SelectGroup, SelectValue } from "@radix-ui/react-select";
import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

type Props = {
  newNote: () => void;
};

const boards = [
  { id: 1, name: "Board 1" },
  { id: 2, name: "Board 2" },
  { id: 3, name: "Board 3" },
];

const Header = (props: Props) => {
  const [selectedBoard, setSelectedBoard] = useState(boards[0]);

  return (
    <header className="flex items-center justify-between p-2 border-b gap-2">
      <Select
        value={selectedBoard.name}
        onValueChange={(value) => {
          const board = boards.find((b) => b.name === value);
          if (board) {
            setSelectedBoard(board);
          }
        }}
      >
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {boards.map((board) => (
              <SelectItem key={board.id} value={board.name}>
                {board.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={props.newNote}>New note</Button>
    </header>
  );
};

export default Header;
