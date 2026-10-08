"use client";

type Todo = { id: string; title: string; done: boolean };

type TodoItemProps = {
  // todo: the item rendered in this row
  todo: Todo;
  // Todo: optimistic copy shown while a save is in flight
  pending?: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, pending, onToggle, onDelete }: TodoItemProps) {
  const shown = pending ?? todo;
  return (
    <li className="flex items-center gap-2">
      <input type="checkbox" checked={shown.done} onChange={() => onToggle(todo)} />
      <span className={shown.done ? "line-through text-gray-400" : ""}>{shown.title}</span>
      <button type="button" className="ml-auto text-xs text-red-500" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
