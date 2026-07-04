# Scanner Regression Test Fixtures

This directory contains reference projects that the scanner is tested against on every PR. The tests run via `vitest` from `packages/cli/src/__tests__/regression.test.ts`.

## Purpose

Each fixture is either:
- **Vulnerable** — contains a known security issue. Scanner MUST detect it.
- **Clean** — contains code that looks similar to vulnerable patterns but is actually safe. Scanner MUST NOT flag it.

The `clean` fixtures are how we lock in every false-positive fix we've shipped. If someone tweaks a rule and accidentally regresses an FP, the test fails.

## Fixture format

Each fixture is a directory containing:
- Source files (`.js`, `.ts`, `.tsx`, etc.)
- An `expected.json` file describing what the scanner should (and should not) find

### `expected.json` schema

```json
{
  "description": "Human-readable explanation of what this fixture demonstrates",
  "expectedFindings": [
    {
      "rule": "VC005",
      "file": "server.js",
      "lineRange": [10, 25],
      "severityAtLeast": "critical"
    }
  ],
  "mustNotFire": ["VC003", "VC088"]
}
```

Fields:
- **`description`** — what the fixture is testing
- **`expectedFindings`** — rules that MUST fire. Each entry:
  - `rule` (required) — rule ID (e.g. `"VC005"`)
  - `file` (required) — filename relative to the fixture dir
  - `lineRange` (required) — `[minLine, maxLine]` inclusive, generous to tolerate small regex changes
  - `severityAtLeast` (optional) — `"critical" | "high" | "medium" | "low"` — fails if severity is lower
- **`mustNotFire`** — array of rule IDs that must NOT produce any findings on any file in the fixture

Clean fixtures have `expectedFindings: []` and a `mustNotFire` listing the rule(s) they specifically guard against.

## Adding a new fixture

1. Create a new directory under `vulnerable/` or `clean/`
2. Add your sample code file(s)
3. Write `expected.json`
4. Run `cd packages/cli && npm test` to verify

If you're adding a regression fixture for an FP you just fixed, put it in `clean/` with `mustNotFire: [rule-id]`.
