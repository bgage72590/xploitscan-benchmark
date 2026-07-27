"use client"

import * as React from "react"

/**
 * Path near-miss #1: `components/uikit/`, not `components/ui/`.
 *
 * The vendored exclusion is `**\/components/ui/**`. A directory whose name
 * merely starts with "ui" is app code and must keep counting. If a future
 * widening of the pattern list turns this into a prefix match, this fixture
 * fails.
 */
export function PreviewPane({ html }: { html: string }) {
  return <div className="preview" dangerouslySetInnerHTML={{ __html: html }} />
}
