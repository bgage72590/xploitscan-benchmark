"use client";
import { useState } from "react";

export function BillingPanel() {
  // The store belongs to the user. One line in devtools unlocks Pro.
  const [isPro] = useState(() => localStorage.getItem("isPro") === "true");
  const role = localStorage.getItem("user_role");

  return (
    <div>
      {isPro && <ProOnlyExport />}
      {role === "admin" ? <AdminSettings /> : null}
    </div>
  );
}

function ProOnlyExport() { return <button>Export everything</button>; }
function AdminSettings() { return <button>Delete workspace</button>; }
