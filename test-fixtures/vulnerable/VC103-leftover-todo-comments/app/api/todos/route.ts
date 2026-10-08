import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/todos — the todo list shown on the dashboard
export async function GET() {
  const supabase = await createClient();
  // TODO: filter by the logged-in user once auth is wired up
  const { data, error } = await supabase
    .from("todos")
    .select("id, title, done, position")
    .order("position");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/todos — add a todo to the end of the list
export async function POST(req: Request) {
  const supabase = await createClient();
  const { title } = await req.json(); // FIXME: validate title (empty / 10k chars)

  const { data, error } = await supabase
    .from("todos")
    .insert({ title, done: false })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
