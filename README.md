# XploitScan Detection Benchmark

The full, reproducible benchmark behind the numbers on
[xploitscan.com/benchmark](https://xploitscan.com/benchmark): a labeled fixture
corpus, a held-out third-party corpus, and the exact runner scripts used to
score [XploitScan](https://xploitscan.com), [Semgrep](https://semgrep.dev), and
[Bearer](https://github.com/bearer/bearer) side by side.

This repo is mirrored automatically from the XploitScan monorepo — the fixtures
and scripts here are the same files the published scores are generated from.

> ⚠️ **The fixture corpus is intentionally vulnerable code.** It exists to test
> security scanners. Never deploy it, never copy patterns from it into real
> projects.

## What's here

| Path | What it is |
|---|---|
| `test-fixtures/vulnerable/` | ~100 labeled vulnerable fixtures, each with an `expected.json` declaring which rules must fire, where |
| `test-fixtures/clean/` | ~55 labeled clean fixtures with `mustNotFire` labels — the false-positive gate |
| `test-fixtures/held-out/` | The honest set: real vulnerabilities excerpted from third-party projects (OWASP NodeGoat, Juice Shop, DVNA, …) that no XploitScan rule author wrote, with hint comments stripped. See [`NOTICE.md`](test-fixtures/held-out/NOTICE.md) for per-fixture attribution |
| `scripts/benchmark.js` | Scores XploitScan on the main corpus → precision / recall / F1, overall and per rule |
| `scripts/semgrep-benchmark.js` | Scores Semgrep on the main corpus (pinned community rulesets, listed in the script) |
| `scripts/bearer-benchmark.js` | Scores Bearer on the main corpus (default SAST profile) |
| `scripts/benchmark-heldout.js` | Scores XploitScan on the held-out corpus |
| `scripts/benchmark-heldout-thirdparty.js` | Scores Semgrep or Bearer on the held-out corpus |

## Reproduce the scores

```sh
git clone https://github.com/bgage72590/xploitscan-benchmark
cd xploitscan-benchmark
npm install

# XploitScan — main corpus (precision/recall/F1) and held-out corpus
node scripts/benchmark.js
node scripts/benchmark-heldout.js

# Semgrep comparison (requires `pip install semgrep`)
node scripts/semgrep-benchmark.js
node scripts/benchmark-heldout-thirdparty.js semgrep

# Bearer comparison (requires the `bearer` CLI on PATH)
node scripts/bearer-benchmark.js
node scripts/benchmark-heldout-thirdparty.js bearer
```

The XploitScan rules come from the published
[`xploitscan-shared-rules`](https://www.npmjs.com/package/xploitscan-shared-rules)
npm package — the same rule set the CLI, web scanner, and API run. `npm
install` pulls the latest published rules, so your local scores track the
current engine; the live page at
[xploitscan.com/benchmark](https://xploitscan.com/benchmark) shows the scores
for the currently deployed version.

## Methodology (short version)

- **Main corpus** — self-authored, labeled fixtures. XploitScan's rules were
  developed against this corpus, so its scores here measure regression, not
  generalization. Semgrep and Bearer never saw it, which biases the comparison
  in XploitScan's favor — which is exactly why the held-out set exists.
- **Held-out corpus** — the honest number. Excerpts of real vulnerable code
  from public third-party projects that no XploitScan rule author wrote, with
  hint comments stripped so no scanner can key on them. A fixture counts as
  detected if the scanner reports the labeled *vulnerability class* inside the
  fixture (for XploitScan: one of the expected rule IDs fires; for
  Semgrep/Bearer: a finding matching the class keyword map in the runner).
  Detection is scored per vulnerability, not per line.
- **Misses are published.** Fixtures no scanner catches (including XploitScan)
  stay in the corpus and count against the score — see the held-out section of
  the benchmark page.

The full write-up: [xploitscan.com/docs/detection-methodology](https://xploitscan.com/docs/detection-methodology)

## Licensing

- Runner scripts and self-authored fixtures: [MIT](LICENSE).
- Held-out fixtures are excerpts of permissively-licensed third-party projects
  (MIT / Apache-2.0 / ISC) — per-fixture sources and licenses in
  [`test-fixtures/held-out/NOTICE.md`](test-fixtures/held-out/NOTICE.md).

## Filing issues

Think a fixture is mislabeled, a runner is unfair to Semgrep/Bearer, or a
score doesn't reproduce? Open an issue — benchmark disputes are treated as
bugs.
