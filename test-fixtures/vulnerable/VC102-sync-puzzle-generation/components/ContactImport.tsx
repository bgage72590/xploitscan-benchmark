"use client";

import { useState } from "react";
import Papa from "papaparse";

type Contact = { name: string; email: string; company: string };

function similarity(a: string, b: string): number {
  const dp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    dp[i] = [i];
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        i === 0
          ? j
          : Math.min(
              dp[i - 1][j] + 1,
              dp[i][j - 1] + 1,
              dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
            );
    }
  }
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length, 1);
}

export function ContactImport() {
  const [duplicates, setDuplicates] = useState<Array<[Contact, Contact]>>([]);

  const onFile = (file: File) => {
    Papa.parse<Contact>(file, {
      header: true,
      complete: ({ data }) => {
        // Flag every pair of rows whose names look like the same person.
        const pairs: Array<[Contact, Contact]> = [];
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (similarity(data[i].name.toLowerCase(), data[j].name.toLowerCase()) > 0.85) {
              pairs.push([data[i], data[j]]);
            }
          }
        }
        setDuplicates(pairs);
      },
    });
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".csv" onChange={(e) => e.target.files && onFile(e.target.files[0])} />
      {duplicates.length > 0 && (
        <p className="text-sm text-amber-700">{duplicates.length} possible duplicates found</p>
      )}
    </div>
  );
}
