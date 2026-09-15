// Open Graph card renderer. Social crawlers and link unfurlers fetch this
// anonymously — that is the entire purpose of the URL. It takes no request
// object, reads nothing, and returns a static marketing image.
//
// "Add authentication to this route" would break every share preview on the
// site, so VC003 must not fire on it.

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          color: "#ffffff",
          fontSize: "64px",
        }}
      >
        Example
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
