import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { SelectGroup, SelectValue } from '@radix-ui/react-select'

type Props = {}

const boards = [
    { id: 1, name: 'Board 1' },
    { id: 2, name: 'Board 2' },
    { id: 3, name: 'Board 3' },
]

const Header = (props: Props) => {
    const [selectedBoard, setSelectedBoard] = useState(boards[0])

  return (
    <header>
        <Select
            value={selectedBoard.name}
            onValueChange={(value) => {
                const board = boards.find((b) => b.name === value)
                if (board) {
                    setSelectedBoard(board)
                }
            }}
        >
            <SelectTrigger className="w-[180px]">
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
    </header>
  )
}

export default Header