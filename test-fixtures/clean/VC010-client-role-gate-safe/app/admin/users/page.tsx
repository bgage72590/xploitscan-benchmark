import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteUser, promoteUser } from "./actions";

// Rendered per request before any HTML is sent, so the role checks below
// cannot be skipped from DevTools. Support staff can view the list; only
// admins get the destructive controls, and the actions re-check.
export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || !["admin", "support"].includes(session.user.role)) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>
      <table className="w-full text-left">
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>
                <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
              </td>
              <td className="space-x-2 text-right">
                {session.user.role === "admin" && (
                  <>
                    <form action={promoteUser.bind(null, u.id)} className="inline">
                      <Button size="sm">Make admin</Button>
                    </form>
                    <form action={deleteUser.bind(null, u.id)} className="inline">
                      <Button size="sm" variant="destructive">Delete</Button>
                    </form>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
