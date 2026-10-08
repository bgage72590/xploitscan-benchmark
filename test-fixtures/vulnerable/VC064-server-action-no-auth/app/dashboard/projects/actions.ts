"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ProjectInput = z.object({
  name: z.string().min(1).max(80),
  ownerId: z.string().cuid(),
});

// Input is validated, but nothing checks who is calling: ownerId comes from
// the form, so a caller can create projects for, or delete projects of, any
// account.
export const createProject = async (formData: FormData) => {
  const input = ProjectInput.parse({
    name: formData.get("name"),
    ownerId: formData.get("ownerId"),
  });
  const project = await prisma.project.create({ data: input });
  redirect(`/dashboard/projects/${project.id}`);
};

export const deleteProject = async (projectId: string) => {
  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/dashboard/projects");
};
