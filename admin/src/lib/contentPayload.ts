// Builds the request body for a content create/update. Plain JSON whenever no file
// field actually has a new File selected (the common case) — a JS array there is
// unambiguous either way (a relation list or a JSONField list), and an empty array
// correctly means "clear this," which DRF's JSON parsing handles natively.
//
// Once any file IS present, the whole request must go multipart, which has no native
// list type — Django's QueryDict represents a list as repeated `key=value` pairs, but
// that convention is specific to DRF's `SlugRelatedField(many=True)` relation fields
// (via ManyRelatedField.get_value()'s dictionary.getlist()); a plain `JSONField`
// (included/obligations/body/stats) instead expects ONE key holding a JSON-encoded
// string (JSONField.to_internal_value() calls json.loads() on multipart input). Passing
// `jsonFields` tells this function which keys need that stringify treatment instead of
// the repeated-key treatment.
//
// Known limitation: multipart has no way to explicitly signal "clear this relation to
// zero items" (an absent key means "unchanged" on a PATCH, same as an empty one) — an
// empty relation array is simply omitted when a file is also being uploaded in the same
// submit. Save again without a new file to clear a relation to zero items.
export function buildContentPayload(
  values: Record<string, unknown>,
  config: { fileFields?: string[]; jsonFields?: string[] } = {},
): Record<string, unknown> | FormData {
  const { fileFields = [], jsonFields = [] } = config;
  const hasFile = fileFields.some((f) => values[f] instanceof File);

  if (!hasFile) {
    const rest = { ...values };
    for (const f of fileFields) delete rest[f];
    return rest;
  }

  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File) {
      formData.append(key, value);
    } else if (jsonFields.includes(key)) {
      formData.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      for (const item of value) formData.append(key, String(item));
    } else if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
}
