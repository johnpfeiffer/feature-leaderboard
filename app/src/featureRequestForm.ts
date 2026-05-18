import type { FeatureRequestDraft, FormErrors } from "./types";

export function emptyFeatureRequestDraft(): FeatureRequestDraft {
  return {
    title: "",
    description: "",
  };
}

export function featureRequestDraftFromFormData(
  formData: Pick<FormData, "get">,
): FeatureRequestDraft {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

export function featureRequestFieldsHtml(
  draft: FeatureRequestDraft,
  errors: FormErrors,
): string {
  return `
          <label>
            <span>Title</span>
            <input name="title" maxlength="120" autocomplete="off" value="${escapeHtml(draft.title)}" aria-invalid="${Boolean(errors.title)}" />
            ${fieldError(errors.title)}
          </label>
          <label>
            <span>Description</span>
            <textarea name="description" maxlength="2000" rows="7" aria-invalid="${Boolean(errors.description)}">${escapeHtml(draft.description)}</textarea>
            ${fieldError(errors.description)}
          </label>
  `;
}

function fieldError(message: string | undefined): string {
  return message ? `<small class="field-error">${escapeHtml(message)}</small>` : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

