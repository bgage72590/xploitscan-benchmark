/**
 * Rule sets for the benchmark scripts.
 *
 * Free: the 30 rules in the public xploitscan-shared-rules package. Every run
 * scores them, so anyone can reproduce the free-plan numbers.
 *
 * Paid: the other 193. Inside this monorepo they come from the private
 * packages/pro-rules build. From the public xploitscan-benchmark repo (which
 * has no access to that package) they are downloaded with a paid plan's API
 * key — the same request the CLI makes — so the full numbers are reproducible
 * by paying users without the rule code ever being published.
 *
 * The monorepo case refuses to fall back: if packages/pro-rules exists but is
 * not built, CI would otherwise publish free-rule numbers as the full
 * catalogue's.
 */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");
const PRO_PACKAGE_DIR = path.join(ROOT, "packages", "pro-rules");
const PRO_DIST = path.join(PRO_PACKAGE_DIR, "dist", "index.cjs");

/**
 * @returns {Promise<{ rules: object[], source: string } | null>} the 193 paid
 * rules, or null when they aren't available (public repo, no key).
 */
async function loadPaidRules() {
  if (fs.existsSync(path.join(PRO_PACKAGE_DIR, "package.json"))) {
    if (!fs.existsSync(PRO_DIST)) {
      throw new Error("packages/pro-rules is not built. Run: pnpm -C packages/pro-rules build");
    }
    const mod = require(PRO_DIST);
    return { rules: mod.proOnlyRules, source: "packages/pro-rules" };
  }

  const key = process.env.XPLOITSCAN_API_KEY;
  if (!key) return null;

  const base = (process.env.XPLOITSCAN_WEB_URL || "https://xploitscan.com").replace(/\/+$/, "");
  const res = await fetch(`${base}/api/cli/rules-bundle`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Could not download the paid rules (HTTP ${res.status}): ${body.slice(0, 200)}`);
  }
  // The bundle is a self-contained CommonJS module. Write it to a private temp
  // file just long enough to require it; nothing is cached on disk.
  const file = path.join(os.tmpdir(), `xploitscan-paid-rules-${process.pid}.cjs`);
  fs.writeFileSync(file, await res.text(), { mode: 0o600 });
  try {
    const mod = require(file);
    if (!Array.isArray(mod.proOnlyRules)) throw new Error("Downloaded bundle has no proOnlyRules export");
    return { rules: mod.proOnlyRules, source: "downloaded with XPLOITSCAN_API_KEY" };
  } finally {
    fs.rmSync(file, { force: true });
  }
}

module.exports = { loadPaidRules };
