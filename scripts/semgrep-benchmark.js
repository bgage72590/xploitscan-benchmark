#!/usr/bin/env node
/**
 * Semgrep head-to-head comparison — runs Semgrep community rules against the
 * same labeled fixture corpus at test-fixtures/ that our own
 * detection benchmark uses, then computes precision / recall / F1 on the
 * same ground-truth labels so the two scanners can be compared apples-to-apples.
 *
 * Requires the `semgrep` CLI on PATH. The matching CI workflow installs it via
 * `pip install semgrep`. Run locally via `semgrep --version` first to confirm.
 *
 * Methodology — positional coverage, not rule-ID mapping:
 *   For each vulnerable fixture with an `expectedFindings[i]` entry, we ask:
 *   "did *any* Semgrep rule fire on that expected file within ±10 lines of
 *   the expected range?" If yes → TP. If no → FN. This treats the two
 *   scanners fairly regardless of naming — we're comparing capability to
 *   detect the class of vulnerability, not rule taxonomies.
 *
 *   For each clean fixture with `mustNotFire` entries, any Semgrep finding
 *   on the fixture counts as an FP (we can't per-rule attribute Semgrep
 *   findings against mustNotFire the way we do with our own scanner, so we
 *   use the stricter interpretation: clean fixture means clean scan).
 *
 * Output: writes benchmark-semgrep.json at repo root + prints a terminal table.
 * Exit code 0 on success, non-zero only on runner error (not on weak scores).
 */

const fs = require("node:fs");
const path = require("node:path");
const { execSync, spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const FIXTURES_DIR = path.join(ROOT, "test-fixtures");
const RESULTS_PATH = path.join(ROOT, "benchmark-semgrep.json");

// Lines-of-slack when deciding whether a finding matches an expected range.
// Our own scanner can emit findings a couple of lines off from the declared
// start (snippet-start vs. match-line). Give Semgrep the same benefit of
// the doubt.
const LINE_SLACK = 10;

// Community rulesets that cover most of what our benchmark tests. Auto would
// pull in Pro rules if the CI environment has a Semgrep App token — which we
// don't want for reproducibility, so we pin to named community packs. Anyone
// can re-run these locally and get the same numbers.
//
// References:
//   https://semgrep.dev/p/security-audit  — broad security audit pack
//   https://semgrep.dev/p/owasp-top-ten    — OWASP Top 10 mappings
//   https://semgrep.dev/p/javascript       — JS-specific rules
//   https://semgrep.dev/p/typescript       — TS-specific rules
//   https://semgrep.dev/p/react            — React-specific rules (covers
//                                            dangerouslySetInnerHTML etc.)
const SEMGREP_CONFIGS = [
  "p/security-audit",
  "p/owasp-top-ten",
  "p/javascript",
  "p/typescript",
  "p/react",
];

function ensureSemgrep() {
  const probe = spawnSync("semgrep", ["--version"], { encoding: "utf8" });
  if (probe.status !== 0) {
    console.error("semgrep CLI not found on PATH. Install with `pip install semgrep`.");
    console.error(probe.stderr || probe.error?.message || "(no error output)");
    process.exit(2);
  }
  const v = (probe.stdout || "").trim();
  console.log("Using semgrep " + v);
}

function walkFiles(dir, acc = [], root = dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkFiles(full, acc, root);
    } else if (name !== "expected.json") {
      // Skip only the fixture label manifest; everything else is code-under-test.
      acc.push({ full, rel: path.relative(root, full) });
    }
  }
  return acc;
}

function loadFixtures() {
  const fixtures = [];
  for (const category of ["vulnerable", "clean"]) {
    const categoryDir = path.join(FIXTURES_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;
    for (const name of fs.readdirSync(categoryDir).sort()) {
      const fxDir = path.join(categoryDir, name);
      const expectedPath = path.join(fxDir, "expected.json");
      if (!fs.existsSync(expectedPath)) continue;
      const expected = JSON.parse(fs.readFileSync(expectedPath, "utf8"));
      const files = walkFiles(fxDir);
      fixtures.push({ category, name, dir: fxDir, expected, files });
    }
  }
  return fixtures;
}

/**
 * Run Semgrep ONCE over the entire fixtures directory and return the raw
 * findings keyed by absolute file path. The per-fixture evaluator then
 * buckets findings into each fixture by path prefix.
 *
 * We used to invoke Semgrep per-fixture, which meant N spawns + N ruleset
 * loads (startup dwarfs the tiny scan work on single-file fixtures). One
 * invocation across the whole corpus is 5-15× faster and produces
 * identical findings — Semgrep already tags each result with its path.
 */
function runSemgrepOnCorpus(corpusDir) {
  const configArgs = [];
  for (const c of SEMGREP_CONFIGS) configArgs.push("--config", c);
  const args = [
    ...configArgs,
    "--json",
    "--quiet",
    "--timeout", "30",
    "--metrics", "off",
    // No `--error` here — we don't want non-zero exit just because some
    // vulnerable fixture legitimately produced a finding.
    corpusDir,
  ];

  // maxBuffer 100MB — corpus-wide Semgrep JSON is bigger than per-fixture.
  const result = spawnSync("semgrep", args, {
    encoding: "utf8",
    maxBuffer: 100 * 1024 * 1024,
  });

  if (result.status !== 0 && result.status !== 1) {
    console.error("Semgrep failed on " + corpusDir + " (exit " + result.status + ")");
    console.error(result.stderr?.slice(0, 2000) || "(no stderr)");
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(result.stdout || "{}");
  } catch (err) {
    console.error("Could not parse Semgrep JSON: " + err.message);
    return [];
  }

  const out = [];
  for (const r of parsed.results || []) {
    const rawPath = r.path || "";
    // Semgrep usually emits absolute paths, but be defensive: if it returns
    // a relative one (depends on version + how it's invoked), resolve
    // against corpusDir so downstream bucketing isn't sensitive to CWD.
    const absPath = rawPath
      ? (path.isAbsolute(rawPath) ? rawPath : path.resolve(corpusDir, rawPath))
      : "";
    out.push({
      rule: r.check_id,
      absPath,
      line: r.start?.line || 0,
      severity: (r.extra?.severity || "").toLowerCase(),
    });
  }
  return out;
}

/**
 * Slice the corpus-wide findings list down to the ones that live under a
 * given fixture directory. Paths in `allFindings` are already absolute.
 */
function findingsForFixture(allFindings, fxDir) {
  const out = [];
  const prefix = fxDir.endsWith(path.sep) ? fxDir : fxDir + path.sep;
  for (const f of allFindings) {
    if (!f.absPath) continue;
    if (f.absPath === fxDir || f.absPath.startsWith(prefix)) {
      out.push({
        rule: f.rule,
        file: path.relative(fxDir, f.absPath),
        line: f.line,
        severity: f.severity,
      });
    }
  }
  return out;
}

/**
 * Decide whether a Semgrep finding covers an expected XploitScan finding.
 * Matches by file (basename OR full relative path) and line (within LINE_SLACK
 * of the expected range). Deliberately ignores rule-ID — the question is
 * "can Semgrep detect this vulnerability at all", not "do they name it the
 * same way we do".
 */
function findingCoversExpected(finding, exp) {
  const expFile = exp.file;
  const fileMatches =
    finding.file === expFile ||
    finding.file.endsWith("/" + expFile) ||
    finding.file.endsWith("\\" + expFile);
  if (!fileMatches) return false;
  const [lo, hi] = exp.lineRange || [1, 9999];
  return finding.line >= lo - LINE_SLACK && finding.line <= hi + LINE_SLACK;
}

function evaluateFixture(fixture, findings) {
  const result = {
    fixture: fixture.category + "/" + fixture.name,
    category: fixture.category,
    expected: fixture.expected.expectedFindings || [],
    mustNotFire: fixture.expected.mustNotFire || [],
    tp: [],
    fp: [],
    fn: [],
    totalSemgrepFindings: findings.length,
  };

  // TP / FN on vulnerable fixtures — did any Semgrep finding land near
  // an expected position?
  for (const exp of result.expected) {
    const hit = findings.find((f) => findingCoversExpected(f, exp));
    if (hit) {
      result.tp.push({
        xploitRule: exp.rule,
        semgrepRule: hit.rule,
        file: hit.file,
        line: hit.line,
      });
    } else {
      result.fn.push({ xploitRule: exp.rule, file: exp.file, lineRange: exp.lineRange });
    }
  }

  // FP on clean fixtures — any Semgrep finding at all counts. (We can't
  // attribute per-rule vs mustNotFire because Semgrep uses its own rule
  // IDs, so we use the stricter clean-scan definition.)
  if (fixture.category === "clean") {
    for (const f of findings) {
      result.fp.push({ semgrepRule: f.rule, file: f.file, line: f.line });
    }
  }

  return result;
}

function aggregate(perFixtureResults) {
  // Aggregate by XploitScan VC-rule (so the comparison lines up with our
  // own per-rule scorecard). Per-rule TP/FN come directly from vulnerable
  // fixtures. FPs are a single corpus-wide number because Semgrep's rule
  // IDs don't map 1:1 to ours.
  const perRule = new Map();
  const ensure = (id) => {
    if (!perRule.has(id)) perRule.set(id, { tp: 0, fn: 0 });
    return perRule.get(id);
  };
  let totalTP = 0, totalFP = 0, totalFN = 0;

  for (const r of perFixtureResults) {
    for (const t of r.tp) ensure(t.xploitRule).tp++;
    for (const f of r.fn) ensure(f.xploitRule).fn++;
    totalTP += r.tp.length;
    totalFN += r.fn.length;
    totalFP += r.fp.length;
  }

  const rules = [];
  for (const [id, c] of [...perRule.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const recall = c.tp + c.fn === 0 ? null : c.tp / (c.tp + c.fn);
    rules.push({ rule: id, tp: c.tp, fn: c.fn, recall });
  }

  // Micro precision is corpus-wide: TP / (TP + total FPs on clean fixtures).
  const microPrecision = totalTP + totalFP === 0 ? null : totalTP / (totalTP + totalFP);
  const microRecall = totalTP + totalFN === 0 ? null : totalTP / (totalTP + totalFN);
  const microF1 =
    microPrecision !== null && microRecall !== null && microPrecision + microRecall > 0
      ? (2 * microPrecision * microRecall) / (microPrecision + microRecall)
      : null;

  return {
    totals: {
      tp: totalTP,
      fp: totalFP,
      fn: totalFN,
      microPrecision,
      microRecall,
      microF1,
    },
    rules,
  };
}

function fmtPct(x) {
  if (x === null || x === undefined) return "—";
  return (x * 100).toFixed(1) + "%";
}

function printReport(summary, perFixtureResults) {
  const { totals, rules } = summary;
  console.log("");
  console.log("Semgrep Comparison — " + perFixtureResults.length + " fixtures");
  console.log("==============================================================================");
  console.log("TP: " + totals.tp + "   FP: " + totals.fp + "   FN: " + totals.fn);
  console.log(
    "Micro P: " + fmtPct(totals.microPrecision) +
    "   Micro R: " + fmtPct(totals.microRecall) +
    "   Micro F1: " + fmtPct(totals.microF1),
  );
  console.log("");
  console.log("Per-rule recall (TP / (TP+FN) across vulnerable fixtures):");
  console.log("  Rule     TP  FN   Recall    Semgrep rules that fired");
  for (const r of rules) {
    const hit = perFixtureResults
      .flatMap((f) => f.tp.filter((t) => t.xploitRule === r.rule))
      .map((t) => t.semgrepRule)
      .slice(0, 2);
    const hitStr = hit.length ? hit.join(", ") : "(none)";
    console.log(
      "  " + r.rule.padEnd(7) +
      "  " + String(r.tp).padStart(2) +
      "  " + String(r.fn).padStart(2) +
      "   " + fmtPct(r.recall).padStart(7) +
      "   " + hitStr,
    );
  }

  const fpFixtures = perFixtureResults.filter((r) => r.fp.length > 0);
  if (fpFixtures.length > 0) {
    console.log("");
    console.log("Clean fixtures with Semgrep FPs:");
    for (const r of fpFixtures) {
      console.log("  " + r.fixture + " — " + r.fp.length + " finding(s)");
    }
  }
}

function main() {
  ensureSemgrep();

  const fixtures = loadFixtures();
  if (fixtures.length === 0) {
    console.error("No fixtures found under " + FIXTURES_DIR);
    process.exit(1);
  }

  console.log("  running Semgrep over " + fixtures.length + " fixtures (one-shot) ...");
  const t0 = Date.now();
  const allFindings = runSemgrepOnCorpus(FIXTURES_DIR);
  const elapsedSec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log("  got " + allFindings.length + " finding(s) in " + elapsedSec + "s");

  const perFixtureResults = [];
  for (const fixture of fixtures) {
    const findings = findingsForFixture(allFindings, path.resolve(fixture.dir));
    const evaluated = evaluateFixture(fixture, findings);
    perFixtureResults.push(evaluated);
  }

  const summary = aggregate(perFixtureResults);

  // Include the semgrep version + the configs used so the output is
  // self-describing and any claim we make on the /benchmark page is
  // reproducible.
  let semgrepVersion = "";
  try {
    semgrepVersion = execSync("semgrep --version", { encoding: "utf8" }).trim();
  } catch {
    semgrepVersion = "unknown";
  }

  const output = {
    generatedAt: new Date().toISOString(),
    corpusSize: fixtures.length,
    semgrepVersion,
    semgrepConfigs: SEMGREP_CONFIGS,
    fixtures: perFixtureResults,
    summary,
  };

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log("");
  console.log("Wrote " + path.relative(ROOT, RESULTS_PATH));

  printReport(summary, perFixtureResults);
}

main();
