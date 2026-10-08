import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import type { DebouncedFunc } from "lodash";

// Runs `search` 300ms after the user stops typing.
export function useDebouncedSearch<T>(search: (q: string) => Promise<T[]>, delay = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);

  const run: DebouncedFunc<(q: string) => Promise<void>> = useMemo(
    () => debounce(async (q: string) => setResults(q ? await search(q) : []), delay),
    [search, delay],
  );

  useEffect(() => {
    run(query);
    return () => run.cancel();
  }, [query, run]);

  return { query, setQuery, results };
}
