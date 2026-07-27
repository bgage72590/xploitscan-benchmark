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
  "mustNotFire": ["VC003", "VC088"],
  "mustNotAffectGrade": [],
  "mustBeGraded": []
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
- **`mustNotAffectGrade`** — rule IDs that MAY fire but must never move the grade, because the fixture's files live in vendored / generated / documentation paths
- **`mustBeGraded`** — rule IDs that MUST fire *and* MUST count toward the grade

Unknown top-level keys fail the suite. A mistyped key would otherwise silently
drop the assertion it was meant to add.

Clean fixtures have `expectedFindings: []` and a `mustNotFire` listing the rule(s) they specifically guard against.

### Reported vs graded

`mustNotFire` and `mustNotAffectGrade` are different tools and are not
interchangeable.

Use `mustNotFire` when the rule is simply wrong to fire — the pattern is
benign and the rule should be tightened.

Use `mustNotAffectGrade` when the rule is right to fire but the code isn't the
author's: shadcn/ui primitives under `components/ui/`, example code in `.md`
docs, `__generated__/` output, committed agent state. Those findings stay
visible in every report; they're only held out of `calculateGrade`. The
classification lives in `packages/shared-rules/src/vendored.ts`.

This distinction is load-bearing. A per-rule fix for the shadcn `chart.tsx`
VC063 cluster was written and reverted because genuine shadcn code and a
genuine XSS sink are indistinguishable inside a single file — every
file-local exemption was spoofable. `mustBeGraded` fixtures exist to keep the
path list from growing until it swallows real app code.

## Adding a new fixture

1. Create a new directory under `vulnerable/` or `clean/`
2. Add your sample code file(s)
3. Write `expected.json`
4. Run `cd packages/cli && npm test` to verify

If you're adding a regression fixture for an FP you just fixed, put it in `clean/` with `mustNotFire: [rule-id]`.
