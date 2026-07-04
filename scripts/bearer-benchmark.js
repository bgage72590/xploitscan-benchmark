#!/usr/bin/env node
/**
 * Bearer head-to-head comparison — runs Bearer (https://github.com/Bearer/bearer)
 * against the same labeled fixture corpus at test-fixtures/ that
 * our own benchmark + the Semgrep comparison use. Same methodology so the
 * three columns on the /benchmark page (XploitScan, Semgrep, Bearer) are
 * apples-to-apples.
 *
 * Requires the `bearer` CLI on PATH. The matching CI workflow installs it
 * via Bearer's official install script. Locally: `brew install bearer/tap/bearer`.
 *
 * Methodology — positional coverage, not rule-ID mapping:
 *   For each vulnerable fixture with an `expectedFindings[i]` entry, we ask:
 *   "did any Bearer rule fire on the expected file within ±10 lines of the
 *   expected range?" If yes → TP. If no → FN. This treats the scanners
 *   fairly regardless of naming; we're comparing capability, not taxonomy.
 *
 *   For each clean fixture, any Bearer finding counts as an FP (same
 *   stricter interpretation used for Semgrep: we can't per-rule attribute
 *   against our own mustNotFire list because Bearer's rule IDs are different).
 *
 * Output: writes benchmark-bearer.json at repo root.
 */

const fs = require("node:fs");
const path = require("node:path");
const { execSync, spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const FIXTURES_DIR = path.join(ROOT, "test-fixtures");
const RESULTS_PATH = path.join(ROOT, "benchmark-bearer.json");

// Lines of slack for TP matching, matches the Semgrep comparison.
const LINE_SLACK = 10;

function ensureBearer() {
  const probe = spawnSync("bearer", ["version"], { encoding: "utf8" });
  if (probe.status !== 0) {
    console.error("bearer CLI not found on PATH.");
    console.error("Install: curl -sfL https://raw.githubusercontent.com/Bearer/bearer/main/contrib/install.sh | sh");
    console.error(probe.stderr || probe.error?.message || "(no error output)");
    process.exit(2);
  }
  const v = (probe.stdout || "").trim();
  console.log("Using " + v);
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
 * Run Bearer on a fixture directory. Bearer emits JSON organized by severity
 * bucket — { critical: [...], high: [...], medium: [...], low: [...],
 * warning: [...] } — with each entry containing filename + line_number.
 * We flatten it into a uniform list.
 */
/**
 * Run Bearer ONCE over the whole fixtures directory — one process, one
 * rule-pack load — then bucket findings by which fixture they belong to.
 * Per-fixture invocation (the old approach) paid Bearer's multi-second
 * startup cost 81× in a row.
 */
function runBearerOnCorpus(corpusDir) {
  const tmpOut = path.join(corpusDir, ".bearer-out.json");
  const result = spawnSync(
    "bearer",
    [
      "scan",
      corpusDir,
      "--format", "json",
      "--output", tmpOut,
      "--quiet",
      "--scanner", "sast",
      "--report", "security",
      "--exit-code", "0",
      "--skip-path", ".bearer-out.json",
    ],
    {
      encoding: "utf8",
      maxBuffer: 100 * 1024 * 1024,
    },
  );

  if (result.status !== 0 && result.status !== 1) {
    console.error("bearer failed on " + corpusDir + " (exit " + result.status + ")");
    console.error(result.stderr?.slice(0, 2000) || "(no stderr)");
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(tmpOut, "utf8"));
  } catch (err) {
    console.error("Could not parse Bearer JSON: " + err.message);
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    return [];
  }
  fs.unlinkSync(tmpOut);

  const out = [];
  for (const bucket of ["critical", "high", "medium", "low", "warning"]) {
    const findings = parsed[bucket] || [];
    for (const f of findings) {
      const rawPath = f.filename || "";
      // Bearer reports paths relative to the directory it was told to scan.
      // Resolve against corpusDir so downstream bucketing can compare to
      // absolute fixture paths (path.resolve alone would resolve against
      // CWD, which is the repo root — wrong, and the reason every finding
      // was previously dropping out unattributed and Bearer scored 0/N).
      const absPath = rawPath
        ? (path.isAbsolute(rawPath) ? rawPath : path.resolve(corpusDir, rawPath))
        : "";
      out.push({
        rule: f.id || f.rule_id || "unknown",
        absPath,
        line: f.line_number || f.line || 0,
        severity: bucket,
      });
    }
  }
  return out;
}

/** Filter corpus-wide findings down to those inside a specific fixture dir.
 * Paths in `allFindings` are already absolute (resolved against corpusDir
 * during parse), so this is a straight prefix match. */
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
    totalBearerFindings: findings.length,
  };

  for (const exp of result.expected) {
    const hit = findings.find((f) => findingCoversExpected(f, exp));
    if (hit) {
      result.tp.push({
        xploitRule: exp.rule,
        bearerRule: hit.rule,
        file: hit.file,
        line: hit.line,
      });
    } else {
      result.fn.push({ xploitRule: exp.rule, file: exp.file, lineRange: exp.lineRange });
    }
  }

  if (fixture.category === "clean") {
    for (const f of findings) {
      result.fp.push({ bearerRule: f.rule, file: f.file, line: f.line });
    }
  }

  return result;
}

function aggregate(perFixtureResults) {
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

  const microPrecision = totalTP + totalFP === 0 ? null : totalTP / (totalTP + totalFP);
  const microRecall = totalTP + totalFN === 0 ? null : totalTP / (totalTP + totalFN);
  const microF1 =
    microPrecision !== null && microRecall !== null && microPrecision + microRecall > 0
      ? (2 * microPrecision * microRecall) / (microPrecision + microRecall)
      : null;

  return {
    totals: { tp: totalTP, fp: totalFP, fn: totalFN, microPrecision, microRecall, microF1 },
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
  console.log("Bearer Comparison — " + perFixtureResults.length + " fixtures");
  console.log("==============================================================================");
  console.log("TP: " + totals.tp + "   FP: " + totals.fp + "   FN: " + totals.fn);
  console.log(
    "Micro P: " + fmtPct(totals.microPrecision) +
    "   Micro R: " + fmtPct(totals.microRecall) +
    "   Micro F1: " + fmtPct(totals.microF1),
  );
  console.log("");
  console.log("Per-rule recall:");
  console.log("  Rule     TP  FN   Recall");
  for (const r of rules) {
    console.log(
      "  " + r.rule.padEnd(7) +
      "  " + String(r.tp).padStart(2) +
      "  " + String(r.fn).padStart(2) +
      "   " + fmtPct(r.recall).padStart(7),
    );
  }
}

function main() {
  ensureBearer();

  const fixtures = loadFixtures();
  if (fixtures.length === 0) {
    console.error("No fixtures found under " + FIXTURES_DIR);
    process.exit(1);
  }

  console.log("  running Bearer over " + fixtures.length + " fixtures (one-shot) ...");
  const t0 = Date.now();
  const allFindings = runBearerOnCorpus(FIXTURES_DIR);
  const elapsedSec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log("  got " + allFindings.length + " finding(s) in " + elapsedSec + "s");

  const perFixtureResults = [];
  for (const fixture of fixtures) {
    const findings = findingsForFixture(allFindings, path.resolve(fixture.dir));
    const evaluated = evaluateFixture(fixture, findings);
    perFixtureResults.push(evaluated);
  }

  const summary = aggregate(perFixtureResults);

  let bearerVersion = "unknown";
  try {
    bearerVersion = execSync("bearer version", { encoding: "utf8" }).trim().split("\n")[0];
  } catch {
    // noop
  }

  const output = {
    generatedAt: new Date().toISOString(),
    corpusSize: fixtures.length,
    bearerVersion,
    fixtures: perFixtureResults,
    summary,
  };

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log("");
  console.log("Wrote " + path.relative(ROOT, RESULTS_PATH));

  printReport(summary, perFixtureResults);
}

main();
