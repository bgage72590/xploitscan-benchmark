"use client"

import * as React from "react"

/**
 * Structurally the same shape as shadcn's ChartStyle — a <style> element fed
 * through dangerouslySetInnerHTML — but written by the app author, at an app
 * path, and fed a tenant-supplied stylesheet body.
 *
 * This is the case that makes per-rule suppression impossible and path
 * classification necessary: nothing inside the file distinguishes it from the
 * vendored primitive. The only difference is where it lives.
 *
 * VC063 must fire at critical here AND must count toward the grade.
 */
export function TenantTheme({ tenantCss, accent }: { tenantCss: string; accent: string }) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
:root { --brand-accent: ${accent}; }
${tenantCss}
`,
      }}
    />
  )
}
