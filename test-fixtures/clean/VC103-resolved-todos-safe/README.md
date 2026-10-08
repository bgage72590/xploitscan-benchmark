# Todo App

A small Next.js todo list with optimistic updates.

## Getting started

```bash
npm install
npm run dev
```

## Adding a field to todos

Add it to the type in `components/TodoList.tsx`, then accept it in the PATCH handler:

```ts
// TODO: replace `priority` with your field
type Todo = { id: string; title: string; done: boolean; priority?: number };
```

## Roadmap

- [x] Toggle and delete todos
- [x] Validate titles on the API route
- [ ] Drag-and-drop reordering (tracked in issue #12)
