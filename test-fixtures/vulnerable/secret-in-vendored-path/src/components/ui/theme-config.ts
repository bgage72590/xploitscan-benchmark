// A credential dropped into the vendored UI directory. `components/ui/**` is
// where shadcn primitives live and where the XSS false-positive cluster comes
// from — but a hardcoded key here is still the author's leak, so it must still
// count toward the grade.

export const analyticsConfig = {
  apiKey: "a7Kd93Lm2Qp8Zx4Rv6Ty1Wb5Nc0Hf7Jg",
  endpoint: "https://telemetry.example.com/v1/events",
};
