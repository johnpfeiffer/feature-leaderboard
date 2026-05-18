import type { User } from "@supabase/supabase-js";
import {
  emptyFeatureRequestDraft,
  featureRequestDraftFromFormData,
  featureRequestFieldsHtml,
} from "./featureRequestForm";
import {
  createFeatureRequest,
  listFeatureRequests,
  signInWithGoogle,
  signOut,
  syncProfile,
} from "./api";
import { isSupabaseConfigured, supabase } from "./supabase";
import type { FeatureRequest, FeatureRequestDraft, FormErrors } from "./types";
import { hasErrors, validateFeatureRequestDraft } from "./validation";

type AppState = {
  user: User | null;
  requests: FeatureRequest[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  formDraft: FeatureRequestDraft;
  formErrors: FormErrors;
};

const state: AppState = {
  user: null,
  requests: [],
  loading: true,
  saving: false,
  error: null,
  formDraft: emptyFeatureRequestDraft(),
  formErrors: {},
};

export function mountApp(root: HTMLElement): void {
  void initialize(root);
}

async function initialize(root: HTMLElement): Promise<void> {
  render(root);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  state.user = session?.user ?? null;

  supabase.auth.onAuthStateChange((_event, sessionUpdate) => {
    state.user = sessionUpdate?.user ?? null;
    void load(root);
  });

  await load(root);
}

async function load(root: HTMLElement): Promise<void> {
  state.loading = true;
  state.error = null;
  render(root);

  try {
    if (state.user) {
      await syncProfile(state.user);
      state.requests = await listFeatureRequests();
    } else {
      state.requests = [];
    }
  } catch (error) {
    state.error = getErrorMessage(error);
  } finally {
    state.loading = false;
    render(root);
  }
}

function render(root: HTMLElement): void {
  root.innerHTML = state.user ? authenticatedView() : loginView();
  bindEvents(root);
}

function loginView(): string {
  return `
    <main class="login-shell">
      <section class="login-panel" aria-labelledby="login-title">
        <p class="eyebrow">Feature Leaderboard</p>
        <h1 id="login-title">Sign in to view requests</h1>
        <p class="muted">Google authentication is required before reading or creating feature requests.</p>
        ${configurationWarning()}
        <button class="primary-action" data-action="login" ${isSupabaseConfigured ? "" : "disabled"}>
          Continue with Google
        </button>
      </section>
    </main>
  `;
}

function authenticatedView(): string {
  const name =
    state.user?.user_metadata.full_name ?? state.user?.email ?? "Signed-in user";

  return `
    <main class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Feature Leaderboard</p>
          <h1>Requested Features</h1>
        </div>
        <div class="account">
          <span>${escapeHtml(name)}</span>
          <button class="secondary-action" data-action="logout">Sign out</button>
        </div>
      </header>

      ${configurationWarning()}
      ${state.error ? `<div class="alert" role="alert">${escapeHtml(state.error)}</div>` : ""}

      <section class="workspace">
        <form class="request-form" data-feature-form>
          <div>
            <h2>New request</h2>
            <p class="muted">Submit one clear feature request at a time.</p>
          </div>
          ${featureRequestFieldsHtml(state.formDraft, state.formErrors)}
          <button class="primary-action" type="submit" ${state.saving ? "disabled" : ""}>
            ${state.saving ? "Saving..." : "Submit request"}
          </button>
        </form>

        <section class="request-list" aria-labelledby="requests-title">
          <div class="list-heading">
            <div>
              <h2 id="requests-title">Leaderboard</h2>
              <p class="muted">${state.requests.length} request${state.requests.length === 1 ? "" : "s"}</p>
            </div>
            <button class="icon-action" data-action="refresh" aria-label="Refresh requests" title="Refresh requests">↻</button>
          </div>
          ${requestListContent()}
        </section>
      </section>
    </main>
  `;
}

function requestListContent(): string {
  if (state.loading) {
    return `<div class="empty-state">Loading requests...</div>`;
  }

  if (state.requests.length === 0) {
    return `<div class="empty-state">No feature requests yet.</div>`;
  }

  return `
    <ol class="requests">
      ${state.requests.map(requestItem).join("")}
    </ol>
  `;
}

function requestItem(request: FeatureRequest): string {
  const createdAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(request.created_at));

  return `
    <li class="request-item">
      <div class="request-rank" aria-hidden="true"></div>
      <div class="request-body">
        <h3>${escapeHtml(request.title)}</h3>
        <p>${escapeHtml(request.description)}</p>
        <footer>
          <span>${escapeHtml(request.author.display_name)}</span>
          <span>${escapeHtml(createdAt)}</span>
        </footer>
      </div>
    </li>
  `;
}

function bindEvents(root: HTMLElement): void {
  root.querySelector("[data-action='login']")?.addEventListener("click", () => {
    void signInWithGoogle().catch((error) => {
      state.error = getErrorMessage(error);
      render(root);
    });
  });

  root.querySelector("[data-action='logout']")?.addEventListener("click", () => {
    void signOut().catch((error) => {
      state.error = getErrorMessage(error);
      render(root);
    });
  });

  root.querySelector("[data-action='refresh']")?.addEventListener("click", () => {
    void load(root);
  });

  root.querySelector("[name='title']")?.addEventListener("input", (event) => {
    state.formDraft.title = (event.currentTarget as HTMLInputElement).value;
  });

  root
    .querySelector("[name='description']")
    ?.addEventListener("input", (event) => {
      state.formDraft.description = (
        event.currentTarget as HTMLTextAreaElement
      ).value;
    });

  root.querySelector("[data-feature-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const draft = featureRequestDraftFromFormData(new FormData(form));

    state.formDraft = draft;
    state.formErrors = validateFeatureRequestDraft(draft);

    if (hasErrors(state.formErrors) || !state.user) {
      render(root);
      return;
    }

    state.saving = true;
    render(root);

    void createFeatureRequest(draft, state.user.id)
      .then(async () => {
        state.formDraft = emptyFeatureRequestDraft();
        state.formErrors = {};
        await load(root);
      })
      .catch((error) => {
        state.error = getErrorMessage(error);
      })
      .finally(() => {
        state.saving = false;
        render(root);
      });
  });
}

function configurationWarning(): string {
  if (isSupabaseConfigured) {
    return "";
  }

  return `
    <div class="alert" role="alert">
      Supabase is not configured. Copy app/.env.example to app/.env.local and set your project URL and anon key.
    </div>
  `;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isErrorLike(error)) {
    return [error.message, error.details, error.hint, error.code]
      .filter(Boolean)
      .join("\n");
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Something went wrong.";
  }
}

function isErrorLike(
  error: unknown,
): error is {
  code?: string;
  details?: string;
  hint?: string;
  message: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
