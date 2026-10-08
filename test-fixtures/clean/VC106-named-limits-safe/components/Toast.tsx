"use client";

import { useEffect, useState } from "react";

const TOAST_DURATION_MS = 4000;

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;
  return (
    <div className="fixed bottom-4 right-4 rounded-md bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}
