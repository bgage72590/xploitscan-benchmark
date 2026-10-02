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

const { runCustomRules, buildProjectContext} = require(
  "xploitscan-shared-rules",
);
// Free rules always; the paid rules from packages/pro-rules here, or with a
// paid API key from the public benchmark repo (lib/rule-sets.js).
const { loadPaidRules } = require("./lib/rule-sets.js");

// `extraRules`: [] scores the 30 free rules (runCustomRules always runs them);
// the paid rules on top score the full catalogue.
function scoreFixture(name, extraRules) {
  const dir = path.join(DIR, name);
  const expected = JSON.parse(fs.readFileSync(path.join(dir, "expected.json"), "utf8"));
  const wanted = new Set(expected.expectedRules);
  const firedAll = new Set();
  // Same cross-file context the CLI and the regression suite build. No
  // held-out fixture needs it today, but wiring it here means a future one
  // that does will not silently score as a miss — which is precisely how
  // VC003-supabase-verify-jwt-off behaved in scripts/benchmark.js until it
  // was fixed.
  let projectContext;
  try {
    const configPath = path.join(dir, "supabase", "config.toml");
    if (fs.existsSync(configPath)) {
      projectContext = buildProjectContext([
        { path: "supabase/config.toml", content: fs.readFileSync(configPath, "utf8") },
      ]);
    }
  } catch { /* context is an optimisation, never a requirement */ }
  for (const f of fs.readdirSync(dir)) {
    if (f === "expected.json") continue;
    const content = fs.readFileSync(path.join(dir, f), "utf8");
    for (const finding of runCustomRules(content, f, [], "pro", extraRules, projectContext)) {
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
    // Propagated so main() can split blind from inspected. Undefined for every
    // fixture that has never been read, which is the normal case.
    inspectedAt: expected.inspectedAt,
    inspectionNote: expected.inspectionNote,
  };
}

function tally(results) {
  const blind = results.filter((r) => !r.inspectedAt);
  const detected = results.filter((r) => r.detected).length;
  const blindDetected = blind.filter((r) => r.detected).length;
  return {
    total: results.length,
    detected,
    recall: results.length ? detected / results.length : null,
    blindTotal: blind.length,
    blindDetected,
    blindRecall: blind.length ? blindDetected / blind.length : null,
  };
}

async function main() {
  const names = fs
    .readdirSync(DIR)
    .filter((n) => fs.statSync(path.join(DIR, n)).isDirectory())
    .sort();
  const paid = await loadPaidRules();
  const freeOnly = tally(names.map((n) => scoreFixture(n, [])));
  const results = names.map((n) => scoreFixture(n, paid ? paid.rules : []));
  const total = results.length;
  const detected = results.filter((r) => r.detected).length;

  // A fixture whose expected.json carries `inspectedAt` has been read, and a
  // rule was then changed knowing why it failed. It still proves the rule
  // works; it can no longer prove the rule GENERALISES, which is the only
  // thing a held-out corpus exists to measure. Counting it would quietly
  // convert a calibration number into a generalisation claim.
  const blindResults = results.filter((r) => !r.inspectedAt);
  const blindTotal = blindResults.length;
  const blindDetected = blindResults.filter((r) => r.detected).length;
  const output = {
    generatedAt: new Date().toISOString(),
    ruleSet: paid ? "all" : "free",
    total,
    detected,
    recall: total ? detected / total : null,
    blindTotal,
    blindDetected,
    blindRecall: blindTotal ? blindDetected / blindTotal : null,
    inspectedCount: total - blindTotal,
    // The 30 free rules alone, same cases and the same blind/inspected split.
    free: freeOnly,
    results,
  };
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + "\n");
  console.log(`Held-out: ${detected}/${total} detected (${((detected / total) * 100).toFixed(0)}% recall)`);
  if (blindTotal !== total) {
    console.log(
      `  BLIND:  ${blindDetected}/${blindTotal} (${((blindDetected / blindTotal) * 100).toFixed(0)}%) — ` +
      `${total - blindTotal} case(s) inspected and excluded. The blind figure is the one to quote.`,
    );
  }
  console.log(
    `  FREE PLAN (30 rules): ${freeOnly.detected}/${freeOnly.total} detected, blind ${freeOnly.blindDetected}/${freeOnly.blindTotal}` +
    (paid ? "" : "  (paid rules not available; set XPLOITSCAN_API_KEY to a paid plan's key to score all 214)"),
  );
  for (const r of results) {
    console.log(`  ${r.detected ? "✓" : "✗"} ${r.class.padEnd(26)} ${r.source}`);
  }
  console.log("Wrote " + path.relative(ROOT, OUT));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
