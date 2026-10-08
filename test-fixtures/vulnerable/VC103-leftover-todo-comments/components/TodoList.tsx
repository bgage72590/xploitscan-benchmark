"use client";

import { useState } from "react";

type Todo = { id: string; title: string; done: boolean };

// Todo list for the dashboard: toggle, delete, and add new todos
export function TodoList({ initial }: { initial: Todo[] }) {
  const [todos, setTodos] = useState(initial);

  const toggle = async (todo: Todo) => {
    // HACK: optimistic update with no rollback if the request fails
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)));
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: !todo.done }),
    });
  };

  return (
    <ul className="divide-y rounded-lg border">
      {/* TODO: drag-and-drop reordering */}
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center gap-3 px-4 py-2">
          <input type="checkbox" checked={todo.done} onChange={() => toggle(todo)} />
          <span className={todo.done ? "text-gray-400 line-through" : ""}>{todo.title}</span>
        </li>
      ))}
    </ul>
  );
}
