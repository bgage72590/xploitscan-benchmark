export type Board = number[][];

const SIZE = 9;

function shuffled<T>(values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function canPlace(board: Board, row: number, col: number, n: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === n || board[i][col] === n) return false;
  }
  const r0 = Math.floor(row / 3) * 3;
  const c0 = Math.floor(col / 3) * 3;
  for (let r = r0; r < r0 + 3; r++) {
    for (let c = c0; c < c0 + 3; c++) {
      if (board[r][c] === n) return false;
    }
  }
  return true;
}

/** Counts solutions by brute-force backtracking, stopping once it finds `limit`. */
function countSolutions(board: Board, limit = 2): number {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] !== 0) continue;
      let count = 0;
      for (let n = 1; n <= SIZE; n++) {
        if (!canPlace(board, row, col, n)) continue;
        board[row][col] = n;
        count += countSolutions(board, limit - count);
        board[row][col] = 0;
        if (count >= limit) return count;
      }
      return count;
    }
  }
  return 1;
}

function fillBoard(board: Board): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] !== 0) continue;
      for (const n of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (!canPlace(board, row, col, n)) continue;
        board[row][col] = n;
        if (fillBoard(board)) return true;
        board[row][col] = 0;
      }
      return false;
    }
  }
  return true;
}

/**
 * Generates a puzzle with exactly one solution. Keeps retrying random boards
 * until the uniqueness check passes for the requested number of clues.
 */
export function generatePuzzle(clues: number): { puzzle: Board; solution: Board } {
  while (true) {
    const solution: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    fillBoard(solution);
    const puzzle = solution.map((row) => [...row]);
    const cells = shuffled(Array.from({ length: SIZE * SIZE }, (_, i) => i));
    for (const cell of cells.slice(0, SIZE * SIZE - clues)) {
      puzzle[Math.floor(cell / SIZE)][cell % SIZE] = 0;
    }
    if (countSolutions(puzzle.map((row) => [...row])) === 1) {
      return { puzzle, solution };
    }
  }
}
