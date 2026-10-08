"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

type Notification = { id: string; title: string; read: boolean };

export function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const load = () =>
      fetch("/api/notifications", { signal: controller.signal })
        .then((res) => res.json())
        .then(setItems)
        .catch(() => {});
    load();
    // Refresh whenever the user comes back to the tab.
    window.addEventListener("focus", load);
    return () => controller.abort();
  }, []);

  const unread = items.filter((n) => !n.read).length;

  return (
    <button type="button" className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Notifications">
      <Bell className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
          {unread}
        </span>
      )}
    </button>
  );
}
