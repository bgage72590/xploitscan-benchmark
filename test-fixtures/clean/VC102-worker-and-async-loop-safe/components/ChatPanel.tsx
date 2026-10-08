"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const next: Message[] = [...messages, { role: "user", content: input }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });
    if (!res.body) {
      setLoading(false);
      return;
    }

    // Stream the reply token by token as the API sends it.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let reply = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      reply += decoder.decode(value, { stream: true });
      setMessages([...next, { role: "assistant", content: reply }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            {m.content}
          </p>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input className="flex-1 rounded border px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="rounded bg-black px-4 py-2 text-white" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
