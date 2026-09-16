// Search-console / webmaster-tools ownership tokens.
//
// These strings are high-entropy and look exactly like API keys, but the
// mechanism is the opposite of a secret: you prove you own a domain by
// PUBLISHING the token where anyone can read it. Next.js renders this block
// as <meta name="google-site-verification" content="..."> on every page, so
// the value is already served to every visitor and every crawler.
//
// ENTROPY must not fire — telling someone to "move this to an environment
// variable and rotate it" is advice that breaks their search-console
// ownership for no security benefit.
//
// The tokens below are deliberately chosen ABOVE the scanner's 4.5-bit gate.
// An earlier version of this fixture used lower-entropy values and passed
// without the rule understanding the pattern at all, which is how this false
// positive was once measured as "already fixed" while it was still firing.

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: "Example",
  verification: {
    google: "gT4kLp9QwXz2vNb7YsRdE1hJmC8fA0uK3iO6wZtBnV",
    yandex: "Qr7Vx2Nm9Bk4Ht6Lz1Cw8Pd3Fj5Sg0Ya",
    yahoo: "Wm3Zq8Tb5Nv1Xk7Ry2Jd9Lc4Ph6Gs0Ue",
    other: {
      "facebook-domain-verification": "q7x2m9k4p1s8v3b6n0z5c2j7h4g9d1f8",
      "msvalidate.01": "Kb8Nw3Rq6Zt1Xm9Vy4Jc7Ld2Ph5Gs0Ae",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* The same token written by hand rather than through the Metadata API. */}
        <meta name="google-site-verification" content="Tz5Wq8Km2Nx7Bv4Rd1Hj6Lc9Pf3Gs0Yu" />
      </head>
      <body>{children}</body>
    </html>
  );
}
