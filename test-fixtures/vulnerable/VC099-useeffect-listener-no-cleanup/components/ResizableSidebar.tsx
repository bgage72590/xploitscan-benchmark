"use client";

import { useEffect, useState } from "react";

const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export function ResizableSidebar({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(280);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    document.body.style.cursor = dragging ? "col-resize" : "";
    document.body.style.userSelect = dragging ? "none" : "";
  }, [dragging]);

  const startDrag = () => {
    setDragging(true);
    document.addEventListener("mousemove", (e) => {
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX)));
    });
    document.addEventListener("mouseup", () => setDragging(false));
  };

  return (
    <aside className="relative h-screen shrink-0 border-r bg-gray-50" style={{ width }}>
      {children}
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
        onMouseDown={startDrag}
      />
    </aside>
  );
}
