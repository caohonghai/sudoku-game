import { SudokuBoard } from "../types/sudo";

export function generateSudokuBoard(): SudokuBoard {
  const size = 9;
  const board: SudokuBoard = Array.from(
    { length: size },
    () => Array(size).fill(0)
  );

  function isValid(
    board: SudokuBoard,
    row: number,
    col: number,
    num: number
  ): boolean {
    for (let x = 0; x < size; x++) {
      if (
        board[row][x] === num ||
        board[x][col] === num
      ) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          board[i + startRow][j + startCol] ===
          num
        ) {
          return false;
        }
      }
    }

    return true;
  }

  function shuffleArray(array: number[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function solve(board: SudokuBoard): boolean {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          const nums = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
          ];
          shuffleArray(nums);
          for (const num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(board);
  return board;
}
