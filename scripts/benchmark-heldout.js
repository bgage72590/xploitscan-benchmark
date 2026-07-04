#!/usr/bin/env node
/**
 * Held-out benchmark: scores XploitScan against third-party intentionally-
 * vulnerable code (OWASP NodeGoat, Juice Shop, DVNA, …) that no rule author
 * wrote. Deliberately separate from the main self-authored corpus — this is
 * the honest, harder number (see /blog/why-we-dont-trust-our-benchmark).
 *
 * A fixture counts as DETECTED if any of its expected.json `expectedRules`
 * fires anywhere in the fixture. We score detection-per-vuln, not exact
 * line, because the question is "did the scanner catch this class of bug in
 * code it never saw?" — not "did it match our line number?".
 *
 * Output: writes benchmark-heldout.json next to the other benchmark JSON.
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "test-fixtures/held-out");
const OUT = path.join(ROOT, "benchmark-heldout.json");

const { runCustomRules, allCustomRules } = require(
  "xploitscan-shared-rules",
);

function scoreFixture(name) {
  const dir = path.join(DIR, name);
  const expected = JSON.parse(fs.readFileSync(path.join(dir, "expected.json"), "utf8"));
  const wanted = new Set(expected.expectedRules);
  const firedAll = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (f === "expected.json") continue;
    const content = fs.readFileSync(path.join(dir, f), "utf8");
    for (const finding of runCustomRules(content, f, [], "pro", allCustomRules)) {
      firedAll.add(finding.rule);
    }
  }
  const detected = [...wanted].some((r) => firedAll.has(r));
  return {
    fixture: name,
    class: expected.class,
    source: expected.source,
    license: expected.license,
    expectedRules: expected.expectedRules,
    detected,
  };
}

function main() {
  const names = fs
    .readdirSync(DIR)
    .filter((n) => fs.statSync(path.join(DIR, n)).isDirectory())
    .sort();
  const results = names.map(scoreFixture);
  const total = results.length;
  const detected = results.filter((r) => r.detected).length;
  const output = {
    generatedAt: new Date().toISOString(),
    total,
    detected,
    recall: total ? detected / total : null,
    results,
  };
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + "\n");
  console.log(`Held-out: ${detected}/${total} detected (${((detected / total) * 100).toFixed(0)}% recall)`);
  for (const r of results) {
    console.log(`  ${r.detected ? "✓" : "✗"} ${r.class.padEnd(26)} ${r.source}`);
  }
  console.log("Wrote " + path.relative(ROOT, OUT));
}

main();
