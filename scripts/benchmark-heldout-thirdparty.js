#!/usr/bin/env node
/**
 * Held-out benchmark for third-party scanners — runs Semgrep or Bearer
 * against the same held-out corpus (test-fixtures/held-out/)
 * that scripts/benchmark-heldout.js scores XploitScan on, so the /benchmark
 * page's held-out section can show all three scanners side by side.
 *
 *   node scripts/benchmark-heldout-thirdparty.js semgrep
 *   node scripts/benchmark-heldout-thirdparty.js bearer
 *
 * Output: benchmark-heldout-semgrep.json / benchmark-heldout-bearer.json
 * at repo root, matching the shape of benchmark-heldout.json.
 *
 * Methodology — class-level detection, not rule-ID mapping:
 *   Held-out fixtures are labeled with a vulnerability class ("SQL
 *   injection", "XXE", …), not the other scanner's rule IDs. A fixture
 *   counts as DETECTED if the scanner produced at least one finding inside
 *   the fixture whose rule ID or message matches the class (keyword map
 *   below). This mirrors the XploitScan scorer's question — "did the
 *   scanner catch this class of bug in code it never saw?" — and avoids
 *   crediting an unrelated finding (e.g. a hardcoded-secret hit) as
 *   detection of an SQL injection.
 */

const fs = require("node:fs");
const path = require("node:path");
const { execSync, spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "test-fixtures/held-out");

// Keyword patterns per fixture class, matched (case-insensitively) against
// each finding's rule ID + message/title. Both Semgrep check_ids and Bearer
// rule IDs are descriptive enough for this (e.g.
// "javascript.lang.security.audit.sqli.node-mysql-sqli" /
// "javascript_lang_sql_injection").
const CLASS_PATTERNS = {
  "SQL injection": /sql/i,
  "NoSQL injection": /nosql|mongo|\$where/i,
  "Command injection": /command|child[-_.]?process|\bexec\b|os[-_.]?command|shell/i,
  "Code injection (eval)": /\beval\b|code[-_.]?injection|insecure[-_.]?use[-_.]?of[-_.]?eval/i,
  "XXE": /xxe|xml[-_.]?external|external[-_.]?entit|libxml|noent/i,
  "SSRF": /ssrf|server[-_.]?side[-_.]?request/i,
  "Open redirect": /redirect/i,
  "Insecure deserialization": /deserial|serializ/i,
  "Prototype pollution": /prototype|pollution/i,
  "Path traversal": /traversal|path[-_.]?injection|non[-_.]?literal[-_.]?fs|sendfile|zip[-_.]?slip/i,
  "Hardcoded credentials": /hardcode|private[-_.]?key|secret|credential/i,
  "Weak password hashing": /md5|weak[-_.]?hash|insecure[-_.]?hash|password[-_.]?hash|reversible[-_.]?hash/i,
  "Server-side template injection": /ssti|template[-_.]?injection/i,
  "Cross-site scripting (DOM)": /xss|cross[-_.]?site[-_.]?script|bypass[-_.]?security[-_.]?trust/i,
  "IDOR / broken access control (BOLA)":
    /idor|bola|broken[-_.]?access|access[-_.]?control|authoriz|insecure[-_.]?direct[-_.]?object/i,
};

// Same community rulesets as scripts/semgrep-benchmark.js — pinned for
// reproducibility (no Pro rules, no app token).
const SEMGREP_CONFIGS = [
  "p/security-audit",
  "p/owasp-top-ten",
  "p/javascript",
  "p/typescript",
  "p/react",
];

function ensureTool(cmd, versionArgs, installHint) {
  const probe = spawnSync(cmd, versionArgs, { encoding: "utf8" });
  if (probe.status !== 0) {
    console.error(`${cmd} CLI not found on PATH. ${installHint}`);
    process.exit(2);
  }
  return (probe.stdout || "").trim().split("\n")[0];
}

/** Returns findings as { absPath, rule, message } for the whole held-out dir. */
function runSemgrep() {
  const args = [];
  for (const c of SEMGREP_CONFIGS) args.push("--config", c);
  args.push("--json", "--quiet", "--timeout", "30", "--metrics", "off", DIR);
  const result = spawnSync("semgrep", args, {
    encoding: "utf8",
    maxBuffer: 100 * 1024 * 1024,
  });
  if (result.status !== 0 && result.status !== 1) {
    console.error("semgrep failed (exit " + result.status + ")");
    console.error(result.stderr?.slice(0, 2000) || "(no stderr)");
    process.exit(2);
  }
  const parsed = JSON.parse(result.stdout || "{}");
  return (parsed.results || []).map((r) => ({
    absPath: path.isAbsolute(r.path || "") ? r.path : path.resolve(DIR, r.path || ""),
    rule: r.check_id || "",
    message: r.extra?.message || "",
  }));
}

function runBearer() {
  const tmpOut = path.join(ROOT, ".bearer-heldout-out.json");
  if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
  const result = spawnSync(
    "bearer",
    [
      "scan", DIR,
      "--format", "json",
      "--output", tmpOut,
      "--quiet",
      "--scanner", "sast",
      "--report", "security",
      "--exit-code", "0",
    ],
    { encoding: "utf8", maxBuffer: 100 * 1024 * 1024 },
  );
  if (result.status !== 0 && result.status !== 1) {
    console.error("bearer failed (exit " + result.status + ")");
    console.error(result.stderr?.slice(0, 2000) || "(no stderr)");
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    process.exit(2);
  }
  let parsed = {};
  try {
    parsed = JSON.parse(fs.readFileSync(tmpOut, "utf8"));
  } catch (err) {
    console.error("Could not parse Bearer JSON: " + err.message);
  }
  if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
  const out = [];
  for (const bucket of ["critical", "high", "medium", "low", "warning"]) {
    for (const f of parsed[bucket] || []) {
      const rawPath = f.filename || "";
      out.push({
        absPath: path.isAbsolute(rawPath) ? rawPath : path.resolve(DIR, rawPath),
        rule: f.id || f.rule_id || "",
        message: f.title || f.description || "",
      });
    }
  }
  return out;
}

function main() {
  const tool = process.argv[2];
  if (tool !== "semgrep" && tool !== "bearer") {
    console.error("usage: benchmark-heldout-thirdparty.js <semgrep|bearer>");
    process.exit(2);
  }

  const version =
    tool === "semgrep"
      ? ensureTool("semgrep", ["--version"], "Install with `pip install semgrep`.")
      : ensureTool("bearer", ["version"], "Install with `brew install bearer/tap/bearer`.");
  console.log(`Using ${tool} ${version}`);

  const allFindings = tool === "semgrep" ? runSemgrep() : runBearer();
  console.log(`  got ${allFindings.length} finding(s) across held-out corpus`);

  const names = fs
    .readdirSync(DIR)
    .filter((n) => fs.statSync(path.join(DIR, n)).isDirectory())
    .sort();

  const results = names.map((name) => {
    const fxDir = path.join(DIR, name);
    const expected = JSON.parse(
      fs.readFileSync(path.join(fxDir, "expected.json"), "utf8"),
    );
    const pattern = CLASS_PATTERNS[expected.class];
    if (!pattern) {
      // New fixture class without a keyword map — fail loudly rather than
      // silently scoring it as a miss for the competitor.
      console.error(`::error::no CLASS_PATTERNS entry for class "${expected.class}" (${name})`);
      process.exit(2);
    }
    const prefix = fxDir + path.sep;
    const inFixture = allFindings.filter(
      (f) => f.absPath === fxDir || f.absPath.startsWith(prefix),
    );
    const matching = inFixture.filter(
      (f) => pattern.test(f.rule) || pattern.test(f.message),
    );
    return {
      fixture: name,
      class: expected.class,
      source: expected.source,
      license: expected.license,
      detected: matching.length > 0,
      totalFindings: inFixture.length,
      matchedRules: [...new Set(matching.map((f) => f.rule))].slice(0, 3),
    };
  });

  const total = results.length;
  const detected = results.filter((r) => r.detected).length;
  const output = {
    generatedAt: new Date().toISOString(),
    tool,
    toolVersion: version,
    ...(tool === "semgrep" ? { semgrepConfigs: SEMGREP_CONFIGS } : {}),
    total,
    detected,
    recall: total ? detected / total : null,
    results,
  };

  const outPath = path.join(ROOT, `benchmark-heldout-${tool}.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(
    `Held-out (${tool}): ${detected}/${total} detected (${((detected / total) * 100).toFixed(0)}% recall)`,
  );
  for (const r of results) {
    console.log(`  ${r.detected ? "✓" : "✗"} ${r.class.padEnd(26)} ${r.source}`);
  }
  console.log("Wrote " + path.relative(ROOT, outPath));
}

main();
