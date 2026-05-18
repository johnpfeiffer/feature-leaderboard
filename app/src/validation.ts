import type { FeatureRequestDraft, FormErrors } from "./types";

export const limits = {
  titleMax: 120,
  descriptionMax: 2000,
};

export function normalizeFeatureRequestDraft(
  draft: FeatureRequestDraft,
): FeatureRequestDraft {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
  };
}

export function validateFeatureRequestDraft(
  draft: FeatureRequestDraft,
): FormErrors {
  const normalized = normalizeFeatureRequestDraft(draft);
  const errors: FormErrors = {};

  if (!normalized.title) {
    errors.title = "Title is required.";
  } else if (normalized.title.length > limits.titleMax) {
    errors.title = `Title must be ${limits.titleMax} characters or fewer.`;
  }

  if (!normalized.description) {
    errors.description = "Description is required.";
  } else if (normalized.description.length > limits.descriptionMax) {
    errors.description = `Description must be ${limits.descriptionMax} characters or fewer.`;
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

