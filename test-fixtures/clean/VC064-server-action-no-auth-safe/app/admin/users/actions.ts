"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Every action re-checks the caller itself: the page being behind a login
// says nothing about who invokes the action endpoint.
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session.user;
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) throw new Error("You cannot delete your own account");
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
