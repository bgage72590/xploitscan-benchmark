"use client";

import { useMemo, useState } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";

export function SearchBox({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState("");
  const run = useMemo(() => debounce(onSearch, 300), [onSearch]);

  return (
    <Input
      value={value}
      placeholder="Search customers…"
      onChange={(e) => {
        setValue(e.target.value);
        run(e.target.value);
      }}
    />
  );
}
