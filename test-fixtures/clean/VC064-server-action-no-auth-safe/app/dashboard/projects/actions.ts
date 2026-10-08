"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ProjectInput = z.object({ name: z.string().min(1).max(80) });

// The owner is always the signed-in user, never a form field, and deletes are
// scoped to projects that user owns.
export const createProject = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const { name } = ProjectInput.parse({ name: formData.get("name") });
  const project = await prisma.project.create({ data: { name, ownerId: session.user.id } });
  redirect(`/dashboard/projects/${project.id}`);
};

export const deleteProject = async (projectId: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await prisma.project.deleteMany({ where: { id: projectId, ownerId: session.user.id } });
  revalidatePath("/dashboard/projects");
};
