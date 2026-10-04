"use client";
import { useUser } from "@clerk/nextjs";

export function RoleBadge() {
  const { user } = useUser();
  // Display only, and the gate uses publicMetadata, which only the backend can set.
  const label = typeof user?.unsafeMetadata?.title === "string" ? user.unsafeMetadata.title : "";
  const isAdmin = user?.publicMetadata?.role === "admin";
  const currentRole = user?.unsafeMetadata?.role;
  const [selectedRole] = [currentRole];
  return (
    <span data-changed={selectedRole === currentRole}>
      {label} {String(user?.unsafeMetadata?.role ?? "")} {isAdmin ? "(admin)" : ""}
    </span>
  );
}
