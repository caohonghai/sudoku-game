"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SudokuBoard,
  Difficulty,
} from "@/types/sudo";

import { generateSudokuBoard } from "@/lib/sudo";

import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"] });

// 难度级别定义
const DIFFICULTY_LEVELS: {
  [key in Difficulty]: {
    name: string;
    emptyCount: number;
  };
} = {
  easy: { name: "Easy", emptyCount: 30 },
  medium: { name: "Medium", emptyCount: 40 },
  hard: { name: "Hard", emptyCount: 50 },
  expert: { name: "Expert", emptyCount: 60 },
};

const DISABLE_BUTTON = false;

function generatePuzzle(
  board: SudokuBoard,
  difficulty: Difficulty
): SudokuBoard {
  const boardCopy = board.map((row) => [...row]);
  const emptyCount =
    DIFFICULTY_LEVELS[difficulty].emptyCount;
  let count = 0;
  while (count < emptyCount) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (boardCopy[row][col] !== 0) {
      boardCopy[row][col] = 0;
      count++;
    }
  }
  return boardCopy;
}

export default function Component() {
  const [solution, setSolution] =
    useState<SudokuBoard>([]);
  const [puzzle, setPuzzle] =
    useState<SudokuBoard>([]);
  const [userInput, setUserInput] =
    useState<SudokuBoard>([]);
  const [difficulty, setDifficulty] =
    useState<Difficulty>("medium");
  const [isCorrect, setIsCorrect] = useState<
    null | boolean
  >(null);
  const [position, setPosition] = useState<{
    row: number;
    col: number;
  }>({ row: -1, col: -1 });
  const [selectButton, setSelectButton] =
    useState<Set<number>>(new Set());
  const [timer, setTimer] = useState<number>(0);

  function isActive(row: number, col: number) {
    return (
      position.row === row ||
      position.col === col ||
      (Math.floor(position.col / 3) ===
        Math.floor(col / 3) &&
        Math.floor(position.row / 3) ===
          Math.floor(row / 3))
    );
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isCorrect)
        setTimer((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isCorrect]);

  useEffect(() => {
    newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  function newGame() {
    const board = generateSudokuBoard();
    setSolution(board);
    setPosition({ row: -1, col: -1 });
    const newPuzzle = generatePuzzle(
      board,
      difficulty
    );
    setPuzzle(newPuzzle);
    setUserInput(
      newPuzzle.map((row) => [...row])
    );
    setIsCorrect(null);
    setSelectButton(new Set());
    setTimer(0);
  }

  function clearCell() {
    if (position.row === -1) return;
    setUserInput((prevInput) => {
      const newInput = [...prevInput];
      newInput[position.row][position.col] = 0;
      return newInput;
    });
  }

  function clearAll() {
    setUserInput(() => {
      return puzzle.map((row) => [...row]);
    });
    setPosition({ row: -1, col: -1 });
    setSelectButton(new Set());
    setTimer(0);
  }

  function activeCell(row: number, col: number) {
    setPosition({ row, col });
    const st = new Set<number>();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (
          i === row ||
          j === col ||
          (Math.floor(col / 3) ===
            Math.floor(j / 3) &&
            Math.floor(row / 3) ===
              Math.floor(i / 3))
        ) {
          st.add(userInput[i][j]);
        }
      }
    }
    setSelectButton(st);
  }

  function setUserCellInput(i: number) {
    const { row, col } = position;
    setUserInput((prevInput) => {
      const newInput = [...prevInput];
      newInput[row][col] = i;
      return newInput;
    });
    // count unselect
    let cnt = 0;
    userInput.map((row) => {
      row.map((cell, colIndex) => {
        if (cell === 0) {
          cnt++;
        }
      });
    });
    if (cnt !== 0) return;
    // check solution
    const check =
      JSON.stringify(userInput) ===
      JSON.stringify(solution);
    setIsCorrect(check);
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <h1
        className={cn(
          "text-3xl font-bold mb-4",
          outfit.className
        )}
      >
        Sudoku Game
      </h1>
      <div className="mb-4 flex items-center space-x-2 flex-col md:flex-row gap-4">
        <Select
          value={difficulty}
          onValueChange={(val) =>
            setDifficulty(val as Difficulty)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(
              DIFFICULTY_LEVELS
            ).map(([key, { name }]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-4">
          <Button onClick={newGame}>
            New Game
          </Button>
          <Button onClick={clearCell}>
            Clear Cell
          </Button>
          <Button onClick={clearAll}>
            Restart
          </Button>
        </div>
      </div>
      {isCorrect !== null && (
        <div
          className={`mb-4 flex items-center ${
            isCorrect
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {isCorrect ? (
            <>
              <span>恭喜！解答正确！</span>
            </>
          ) : (
            <>
              <span>
                解答不正确，请继续尝试。
              </span>
            </>
          )}
        </div>
      )}
      <p className="text-lg mb-4">
        {Math.floor(timer / 60)}:{timer % 60}
      </p>
      <div className="grid grid-cols-9 gap-0.5 bg-zinc-400 p-0.5 rounded">
        {userInput.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-8 h-8 md:w-10 md:h-10 text-center text-2xl flex items-center justify-center bg-white ${
                isActive(rowIndex, colIndex)
                  ? "cursor-pointer !bg-blue-200"
                  : ""
              } ${
                rowIndex === position.row &&
                colIndex === position.col
                  ? "!bg-blue-300"
                  : ""
              } ${
                puzzle[rowIndex][colIndex] === 0
                  ? "text-blue-500"
                  : ""
              } ${
                position.row !== -1 &&
                userInput[rowIndex][colIndex] ===
                  userInput[position.row][
                    position.col
                  ] &&
                userInput[rowIndex][colIndex] !==
                  0
                  ? "!bg-blue-300"
                  : ""
              }`}
              onClick={() => {
                activeCell(rowIndex, colIndex);
              }}
            >
              {cell === 0 ? "" : cell}
            </div>
          ))
        )}
      </div>
      <div className="grid grid-cols-9 mt-8 gap-0.5 p-0.5 rounded">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) =>
          DISABLE_BUTTON &&
          selectButton.has(i) ? (
            <div
              key={i}
              className="w-8 h-8 md:w-10 md:h-10 "
            ></div>
          ) : (
            <div
              key={i}
              className="w-8 h-8 md:w-10 md:h-10 text-center flex items-center justify-center bg-blue-200 cursor-pointer text-2xl text-zinc-600"
              onClick={() => {
                setUserCellInput(i);
              }}
            >
              {i}
            </div>
          )
        )}
      </div>
    </div>
  );
}
