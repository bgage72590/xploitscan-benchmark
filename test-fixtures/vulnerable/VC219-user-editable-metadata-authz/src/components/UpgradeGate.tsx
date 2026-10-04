"use client";
import { useUser } from "@clerk/clerk-react";

export function UpgradeGate({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  // unsafeMetadata is writable from the browser: user.update({ unsafeMetadata: { plan: "pro" } }).
  if (user?.unsafeMetadata?.plan !== "pro") {
    return <a href="/pricing">Upgrade to Pro</a>;
  }
  return <>{children}</>;
}
