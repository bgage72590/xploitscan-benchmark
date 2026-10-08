"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Used by the admin users table. The /admin pages sit behind the login
// redirect in middleware.ts, but a Server Action is its own POST endpoint:
// anyone who has the action ID (it ships in the client bundle) can call it
// directly, signed in or not.

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
