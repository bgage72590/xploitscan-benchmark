import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  if (!data.session) redirect("/login");

  const notes = await prisma.note.findMany({
    where: { userId: data.session.user.id },
  });
  return <ul>{notes.map((n) => <li key={n.id}>{n.title}</li>)}</ul>;
}
