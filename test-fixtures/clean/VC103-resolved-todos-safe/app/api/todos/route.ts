import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const NewTodo = z.object({ title: z.string().trim().min(1).max(200) });

// GET /api/todos — the todo list shown on the dashboard
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Todos belong to one user; RLS enforces the same filter in the database.
  const { data, error } = await supabase
    .from("todos")
    .select("id, title, done, position")
    .eq("user_id", user.id)
    .order("position");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/todos — add a todo to the end of the list
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = NewTodo.safeParse(await req.json()); // todo titles are 1-200 chars
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("todos")
    .insert({ title: parsed.data.title, done: false, user_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
