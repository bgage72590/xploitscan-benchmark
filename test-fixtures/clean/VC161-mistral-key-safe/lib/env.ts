// Typed server env (t3-env style). Declares that MISTRAL_API_KEY must be a
// 32-char string at boot — a schema, not a key. VC161 must NOT fire.
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MISTRAL_API_KEY: z.string().length(32),
  },
  runtimeEnv: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  },
});
