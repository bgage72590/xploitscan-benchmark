// A shell-out whose interpolated value is a fixed, validated preset (not user
// input). Reviewed and accepted, annotated with the inline silencer.
// VC094 must NOT fire here.
import { exec } from "child_process";

const SAFE_PRESET = "thumbnail";

export function render() {
  // VC094-OK: SAFE_PRESET is a module constant, never user-controlled — reviewed
  exec(`convert -preset ${SAFE_PRESET} in.png out.png`);
}
