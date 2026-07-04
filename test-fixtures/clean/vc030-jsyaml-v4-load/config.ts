// js-yaml v4+: load() is safe by default (it is the old safeLoad; the unsafe
// loader was removed and now requires an explicit DEFAULT_FULL_SCHEMA). A bare
// yaml.load(x) in a JS/TS file must NOT flag VC030.
import yaml from "js-yaml";
export function readConfig(contents: string) {
  return yaml.load(contents);
}
