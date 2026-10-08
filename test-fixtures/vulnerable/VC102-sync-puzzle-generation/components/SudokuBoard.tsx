"use client";

import { useState } from "react";
import { generatePuzzle, type Board } from "@/lib/sudoku";

const CLUES = { easy: 40, medium: 32, hard: 24 } as const;

export function SudokuBoard() {
  const [difficulty, setDifficulty] = useState<keyof typeof CLUES>("medium");
  const [puzzle, setPuzzle] = useState<Board | null>(null);

  const newGame = () => {
    const { puzzle } = generatePuzzle(CLUES[difficulty]);
    setPuzzle(puzzle);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {(Object.keys(CLUES) as Array<keyof typeof CLUES>).map((level) => (
          <button
            key={level}
            className={level === difficulty ? "font-bold underline" : ""}
            onClick={() => setDifficulty(level)}
          >
            {level}
          </button>
        ))}
        <button className="rounded bg-indigo-600 px-3 py-1 text-white" onClick={newGame}>
          New game
        </button>
      </div>
      {puzzle && (
        <div className="grid grid-cols-9 border-2 border-gray-900">
          {puzzle.flat().map((value, i) => (
            <div key={i} className="flex h-10 w-10 items-center justify-center border text-lg">
              {value || ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
