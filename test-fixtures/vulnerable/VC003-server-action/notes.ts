"use server";

// A file-level "use server" makes every export a callable POST endpoint.
// There is no route file and no URL anywhere in the repo, so a scanner that
// works from routes cannot see this at all. No auth check.
export async function deleteNote(id: string) {
  await db.note.delete({ where: { id } });
}
