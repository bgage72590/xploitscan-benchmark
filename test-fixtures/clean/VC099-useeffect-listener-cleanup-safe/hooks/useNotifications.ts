import { useEffect, useState } from "react";

type Notification = { id: string; title: string; read: boolean };

// Live notifications over a WebSocket, plus an unread count in the tab title
// that resets when the user comes back to the tab.
export function useNotifications(userId: string) {
  const [items, setItems] = useState<Notification[]>([]);
  const [unseen, setUnseen] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications?user=${userId}`);
    ws.addEventListener("message", (event) => {
      const notification = JSON.parse(event.data) as Notification;
      setItems((prev) => [notification, ...prev].slice(0, 50));
      if (document.hidden) setUnseen((count) => count + 1);
    });
    return () => ws.close();
  }, [userId]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden) setUnseen(0);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    document.title = unseen > 0 ? `(${unseen}) Inbox` : "Inbox";
  }, [unseen]);

  return { items, unseen };
}
