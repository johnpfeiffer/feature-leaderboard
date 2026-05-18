import { describe, expect, it } from "vitest";
import {
  emptyFeatureRequestDraft,
  featureRequestDraftFromFormData,
  featureRequestFieldsHtml,
} from "./featureRequestForm";

describe("feature request form", () => {
  it("renders the submitted title when description validation fails", () => {
    const html = featureRequestFieldsHtml(
      { title: "Keep this title", description: "" },
      { description: "Description is required." },
    );

    expect(html).toContain('value="Keep this title"');
    expect(html).toContain("Description is required.");
  });

  it("renders the submitted description when title validation fails", () => {
    const html = featureRequestFieldsHtml(
      { title: "", description: "Keep this description" },
      { title: "Title is required." },
    );

    expect(html).toContain(">Keep this description</textarea>");
    expect(html).toContain("Title is required.");
  });

  it("escapes retained field values", () => {
    const html = featureRequestFieldsHtml(
      { title: '"quoted"', description: "<script>" },
      {},
    );

    expect(html).toContain("value=\"&quot;quoted&quot;\"");
    expect(html).toContain("&lt;script&gt;</textarea>");
  });

  it("reads a draft from submitted form data", () => {
    const formData = new FormData();
    formData.set("title", "Dark mode");
    formData.set("description", "Add a low-light theme.");

    expect(featureRequestDraftFromFormData(formData)).toEqual({
      title: "Dark mode",
      description: "Add a low-light theme.",
    });
  });

  it("creates an empty draft", () => {
    expect(emptyFeatureRequestDraft()).toEqual({
      title: "",
      description: "",
    });
  });
});

