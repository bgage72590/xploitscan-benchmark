import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { orderBy } from "lodash";
import type { Customer } from "@/lib/types";

// Rendered inside the dashboard's client layout.
export function DataTable({ rows }: { rows: Customer[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sort = params.get("sort") ?? "createdAt";
  const sorted = orderBy(rows, [sort], ["desc"]);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          {["name", "email", "createdAt"].map((col) => (
            <th key={col} className="cursor-pointer text-left" onClick={() => router.push(`${pathname}?sort=${col}`)}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
