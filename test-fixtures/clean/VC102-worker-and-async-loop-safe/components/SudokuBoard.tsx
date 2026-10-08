"use client";

import { useEffect, useRef, useState } from "react";
import type { Board } from "@/lib/sudoku.worker";

const CLUES = { easy: 40, medium: 32, hard: 24 } as const;

export function SudokuBoard() {
  const [difficulty, setDifficulty] = useState<keyof typeof CLUES>("medium");
  const [puzzle, setPuzzle] = useState<Board | null>(null);
  const [generating, setGenerating] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("../lib/sudoku.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<{ puzzle: Board }>) => {
      setPuzzle(event.data.puzzle);
      setGenerating(false);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const newGame = () => {
    setGenerating(true);
    workerRef.current?.postMessage({ clues: CLUES[difficulty] });
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
        <button
          className="rounded bg-indigo-600 px-3 py-1 text-white"
          onClick={newGame}
          disabled={generating}
        >
          {generating ? "Generating…" : "New game"}
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
