import { describe, expect, it } from "vitest";
import {
  hasErrors,
  limits,
  normalizeFeatureRequestDraft,
  validateFeatureRequestDraft,
} from "./validation";

describe("feature request validation", () => {
  it.each([
    {
      name: "valid draft",
      draft: { title: "Dark mode", description: "Add a low-light theme." },
      errors: {},
    },
    {
      name: "missing title",
      draft: { title: "", description: "Add a low-light theme." },
      errors: { title: "Title is required." },
    },
    {
      name: "whitespace title",
      draft: { title: "   ", description: "Add a low-light theme." },
      errors: { title: "Title is required." },
    },
    {
      name: "missing description",
      draft: { title: "Dark mode", description: "" },
      errors: { description: "Description is required." },
    },
    {
      name: "whitespace description",
      draft: { title: "Dark mode", description: "  " },
      errors: { description: "Description is required." },
    },
    {
      name: "long title",
      draft: {
        title: "x".repeat(limits.titleMax + 1),
        description: "Add a low-light theme.",
      },
      errors: { title: `Title must be ${limits.titleMax} characters or fewer.` },
    },
    {
      name: "long description",
      draft: {
        title: "Dark mode",
        description: "x".repeat(limits.descriptionMax + 1),
      },
      errors: {
        description: `Description must be ${limits.descriptionMax} characters or fewer.`,
      },
    },
  ])("$name", ({ draft, errors }) => {
    expect(validateFeatureRequestDraft(draft)).toEqual(errors);
  });

  it("normalizes user-entered whitespace", () => {
    expect(
      normalizeFeatureRequestDraft({
        title: "  Dark mode  ",
        description: "\nAdd a low-light theme.\n",
      }),
    ).toEqual({
      title: "Dark mode",
      description: "Add a low-light theme.",
    });
  });

  it("detects whether any field errors exist", () => {
    expect(hasErrors({})).toBe(false);
    expect(hasErrors({ title: "Title is required." })).toBe(true);
  });
});

