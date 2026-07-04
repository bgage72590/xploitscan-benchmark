// User-facing copy and labels that happen to contain SQL-looking verbs
// (UPDATE / SELECT / DELETE) interpolated with a variable. These are ordinary
// UI strings, not database queries — VC006 (SQL injection, critical) must NOT
// fire. Real queries carry a second structural keyword (FROM/SET/WHERE/…);
// prose does not.

export function profileToast(name: string) {
  return `UPDATE your profile settings, ${name}, to continue.`;
}

export function pickerLabel(field: string) {
  return `Please SELECT an option for ${field}.`;
}

export function confirmCopy(item: string) {
  return `This will DELETE everything in ${item}. Are you sure?`;
}

export function insertHint(where: string) {
  return `INSERT your changes wherever ${where} makes sense.`;
}
