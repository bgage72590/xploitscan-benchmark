/**
 * Path near-miss #2: a file NAMED `generated-*`, not a file inside a
 * `generated/` directory. The vendored exclusion is `**\/generated/**` — a
 * directory pattern — so this is app code and its findings must count toward
 * the grade.
 */
import { exec } from "node:child_process";

export function renderInvoicePdf(req: { params: { id: string } }) {
  // Command injection: attacker-controlled id concatenated into a shell string.
  exec(`wkhtmltopdf /tmp/invoice-${req.params.id}.html /tmp/out.pdf`);
}
