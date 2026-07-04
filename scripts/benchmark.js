#!/usr/bin/env node
/**
 * XploitScan detection quality benchmark.
 *
 * Runs the scanner against every labeled sample in test-fixtures/
 * and computes precision / recall / F1 — overall and per-rule. Labels come from
 * each fixture's expected.json:
 *   - `expectedFindings[]` — rule IDs that MUST fire (with file + inclusive line range)
 *   - `mustNotFire[]`      — rule IDs that MUST NOT fire anywhere in the fixture
 *
 * Counting rules:
 *   TP = a finding on a `vulnerable` fixture whose (rule, file, line) matches an
 *        entry in the fixture's `expectedFindings[]`.
 *   FN = an `expectedFindings[]` entry with no matching finding.
 *   FP = a finding for a rule listed in the fixture's `mustNotFire[]`.
 *   Other findings (on vulnerable fixtures, for rules that aren't expected and
 *   aren't forbidden) are ignored — they're "adjacent" findings that may or
 *   may not be noise depending on context.
 *
 * Output: writes benchmark-results.json at repo root + prints a terminal table.
 * Exit code 0 on success, non-zero only on runner error (not on weak scores).
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const FIXTURES_DIR = path.join(ROOT, "test-fixtures");
const RESULTS_PATH = path.join(ROOT, "benchmark-results.json");
const HISTORY_PATH = path.join(ROOT, "benchmark-history.json");
// The accumulated trend lives with the published benchmark JSON; CI commits
// it back to main, so we read the prior entries from there and append.
const PUBLISHED_HISTORY_PATH = path.join(
  ROOT,
  "packages/web/public/benchmark/benchmark-history.json",
);
const MAX_HISTORY = 90;

const {
  runCustomRules,
  allCustomRules,
  scanEntropy,
} = require("xploitscan-shared-rules");

// The config analyzer still lives in packages/api and hasn't been ported to
// shared-rules yet. Once it is, add it here. For now the benchmark exercises
// the two biggest surfaces: the 206 custom regex rules + the Shannon-entropy
// secret scanner.

function walkFiles(dir, acc = [], root = dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkFiles(full, acc, root);
    } else if (name !== "expected.json") {
      // Scan every file in the fixture except its label manifest. Lets
      // fixtures include .json / .tf / .yml / Dockerfile / etc. as the
      // code-under-test without the walker silently dropping them.
      acc.push({
        path: path.relative(root, full),
        content: fs.readFileSync(full, "utf8"),
      });
    }
  }
  return acc;
}

function loadFixtures() {
  const categories = ["vulnerable", "clean"];
  const fixtures = [];
  for (const category of categories) {
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

function scanFixture(fixture) {
  const findings = [];
  const proOnlyRules = allCustomRules.filter(r => !isFreeRule(r.id));
  for (const file of fixture.files) {
    const fileFindings = runCustomRules(file.content, file.path, [], "pro", proOnlyRules);
    findings.push(...fileFindings);
  }
  // Entropy scanner runs over the whole fixture at once (it doesn't need
  // to be called per-file). Its findings are counted against mustNotFire
  // on clean fixtures.
  findings.push(...scanEntropy(fixture.files));
  return findings;
}

// runCustomRules always includes `freeRules` internally; the `extraRules`
// argument lets us add the rest. Mirror that logic here to ask for the full
// 206-rule set.
const FREE_RULE_IDS = new Set([
  "VC001","VC002","VC003","VC004","VC005","VC006","VC007","VC008","VC009","VC010",
  "VC011","VC014","VC015","VC016","VC017","VC018","VC020","VC031","VC032","VC033",
  "VC034","VC036","VC037","VC039","VC060","VC061","VC063","VC097","VC103","VC104",
]);
function isFreeRule(id) {
  return FREE_RULE_IDS.has(id);
}

function findingMatchesExpected(finding, exp) {
  if (finding.rule !== exp.rule) return false;
  // expected file is a basename; matched file may have directories prepended.
  const expectedFile = exp.file;
  const matches =
    finding.file === expectedFile ||
    finding.file.endsWith("/" + expectedFile) ||
    finding.file.endsWith("\\" + expectedFile);
  if (!matches) return false;
  const [lo, hi] = exp.lineRange || [1, 9999];
  return finding.line >= lo && finding.line <= hi;
}

function evaluateFixture(fixture, findings) {
  const result = {
    fixture: fixture.category + "/" + fixture.name,
    category: fixture.category,
    expected: fixture.expected.expectedFindings || [],
    mustNotFire: fixture.expected.mustNotFire || [],
    tp: [], // { rule, file, line }
    fp: [], // { rule, file, line }  (rule was in mustNotFire)
    fn: [], // { rule, file, lineRange, knownGap? }  (no finding for an expected entry)
  };

  // TP: expected entries with a matching finding.
  for (const exp of result.expected) {
    const hit = findings.find(f => findingMatchesExpected(f, exp));
    if (hit) {
      result.tp.push({ rule: hit.rule, file: hit.file, line: hit.line });
    } else {
      // knownGap propagates — the benchmark still counts the miss (for
      // honest /benchmark numbers) but tags it so the CI regression gate
      // can ignore documented gaps and only fail on genuine regressions.
      result.fn.push({
        rule: exp.rule,
        file: exp.file,
        lineRange: exp.lineRange,
        ...(exp.knownGap ? { knownGap: true } : {}),
      });
    }
  }

  // FP: findings for any rule in mustNotFire.
  const forbidden = new Set(result.mustNotFire);
  for (const f of findings) {
    if (forbidden.has(f.rule)) {
      result.fp.push({ rule: f.rule, file: f.file, line: f.line });
    }
  }

  return result;
}

function aggregate(perFixtureResults) {
  const perRule = new Map(); // ruleId -> { tp, fp, fn, knownGapFn }
  const ensure = (id) => {
    if (!perRule.has(id)) perRule.set(id, { tp: 0, fp: 0, fn: 0, knownGapFn: 0 });
    return perRule.get(id);
  };
  for (const r of perFixtureResults) {
    for (const t of r.tp) ensure(t.rule).tp++;
    for (const f of r.fp) ensure(f.rule).fp++;
    for (const f of r.fn) {
      const slot = ensure(f.rule);
      slot.fn++;
      if (f.knownGap) slot.knownGapFn++;
    }
  }

  const rules = [];
  let totalTP = 0, totalFP = 0, totalFN = 0;
  for (const [id, c] of [...perRule.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const precision = c.tp + c.fp === 0 ? null : c.tp / (c.tp + c.fp);
    const recall = c.tp + c.fn === 0 ? null : c.tp / (c.tp + c.fn);
    const f1 =
      precision !== null && recall !== null && precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : null;
    // "Enforced" F1 excludes knownGap FNs — documented pending gaps aren't
    // regressions. The CI gate compares this metric across runs so adding
    // a knownGap fixture to an existing rule doesn't register as a drop.
    const enforcedFn = c.fn - c.knownGapFn;
    const enforcedRecall = c.tp + enforcedFn === 0 ? null : c.tp / (c.tp + enforcedFn);
    const enforcedF1 =
      precision !== null && enforcedRecall !== null && precision + enforcedRecall > 0
        ? (2 * precision * enforcedRecall) / (precision + enforcedRecall)
        : null;
    rules.push({
      rule: id,
      tp: c.tp,
      fp: c.fp,
      fn: c.fn,
      knownGapFn: c.knownGapFn,
      precision,
      recall,
      f1,
      enforcedF1,
    });
    totalTP += c.tp;
    totalFP += c.fp;
    totalFN += c.fn;
  }

  // Micro-averaged metrics (treat every ground-truth entry equally).
  const microPrecision = totalTP + totalFP === 0 ? null : totalTP / (totalTP + totalFP);
  const microRecall = totalTP + totalFN === 0 ? null : totalTP / (totalTP + totalFN);
  const microF1 =
    microPrecision !== null && microRecall !== null && microPrecision + microRecall > 0
      ? (2 * microPrecision * microRecall) / (microPrecision + microRecall)
      : null;

  // Macro-averaged F1 (average F1 across rules that have ground truth).
  const ruleF1s = rules.map(r => r.f1).filter(f => f !== null);
  const macroF1 = ruleF1s.length > 0 ? ruleF1s.reduce((a, b) => a + b, 0) / ruleF1s.length : null;

  return {
    totals: {
      tp: totalTP,
      fp: totalFP,
      fn: totalFN,
      microPrecision,
      microRecall,
      microF1,
      macroF1,
    },
    rules,
  };
}

function formatPct(x) {
  if (x === null || x === undefined) return "n/a";
  return (x * 100).toFixed(1) + "%";
}

function printReport(summary, perFixtureResults) {
  const { totals, rules } = summary;
  console.log("");
  console.log("XploitScan Detection Benchmark — " + perFixtureResults.length + " fixtures");
  console.log("==============================================================================");
  console.log("TP: " + totals.tp + "   FP: " + totals.fp + "   FN: " + totals.fn);
  console.log(
    "Micro P: " + formatPct(totals.microPrecision) +
    "   Micro R: " + formatPct(totals.microRecall) +
    "   Micro F1: " + formatPct(totals.microF1) +
    "   Macro F1: " + formatPct(totals.macroF1),
  );
  console.log("");
  console.log("Per-rule scores (rules with at least one ground-truth entry):");
  console.log("  Rule     TP  FP  FN   Precision  Recall    F1");
  for (const r of rules) {
    console.log(
      "  " + r.rule.padEnd(7) +
      "  " + String(r.tp).padStart(2) +
      "  " + String(r.fp).padStart(2) +
      "  " + String(r.fn).padStart(2) +
      "    " + formatPct(r.precision).padStart(8) +
      "  " + formatPct(r.recall).padStart(7) +
      "  " + formatPct(r.f1).padStart(7),
    );
  }

  const weakFixtures = perFixtureResults.filter(r => r.fn.length > 0 || r.fp.length > 0);
  if (weakFixtures.length > 0) {
    console.log("");
    console.log("Fixtures with ground-truth misses (showing up to 10):");
    for (const r of weakFixtures.slice(0, 10)) {
      const issues = [];
      for (const fn of r.fn) issues.push("FN " + fn.rule);
      for (const fp of r.fp) issues.push("FP " + fp.rule);
      console.log("  " + r.fixture + "  — " + issues.join(", "));
    }
  }
}

function main() {
  const fixtures = loadFixtures();
  if (fixtures.length === 0) {
    console.error("No fixtures found under " + FIXTURES_DIR);
    process.exit(1);
  }

  const perFixtureResults = [];
  for (const fixture of fixtures) {
    const findings = scanFixture(fixture);
    perFixtureResults.push(evaluateFixture(fixture, findings));
  }

  const summary = aggregate(perFixtureResults);

  const output = {
    generatedAt: new Date().toISOString(),
    corpusSize: fixtures.length,
    fixtures: perFixtureResults,
    summary,
  };

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log("Wrote " + path.relative(ROOT, RESULTS_PATH));

  updateHistory(output);

  printReport(summary, perFixtureResults);
}

// Append this run's headline numbers to the trend history (one entry per
// calendar day; same-day reruns replace). Reads the prior history from the
// published copy so the series accumulates across CI runs.
function updateHistory(output) {
  let history = [];
  for (const p of [PUBLISHED_HISTORY_PATH, HISTORY_PATH]) {
    try {
      const parsed = JSON.parse(fs.readFileSync(p, "utf8"));
      if (Array.isArray(parsed)) {
        history = parsed;
        break;
      }
    } catch {
      // no prior history at this path — try the next
    }
  }

  const t = output.summary.totals;
  const date = output.generatedAt.slice(0, 10); // YYYY-MM-DD
  const entry = {
    date,
    generatedAt: output.generatedAt,
    corpusSize: output.corpusSize,
    tp: t.tp,
    fp: t.fp,
    fn: t.fn,
    precision: t.microPrecision,
    recall: t.microRecall,
    f1: t.microF1,
  };

  const idx = history.findIndex((h) => h.date === date);
  if (idx >= 0) history[idx] = entry;
  else history.push(entry);
  history.sort((a, b) => (a.generatedAt < b.generatedAt ? -1 : 1));
  if (history.length > MAX_HISTORY) history = history.slice(history.length - MAX_HISTORY);

  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n");
  console.log(
    "Wrote " + path.relative(ROOT, HISTORY_PATH) + " (" + history.length + " entries)",
  );
}

main();
