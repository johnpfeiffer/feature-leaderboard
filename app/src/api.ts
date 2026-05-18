import type { User } from "@supabase/supabase-js";
import { getAuthRedirectUrl } from "./authRedirect";
import { supabase } from "./supabase";
import type { FeatureRequest, FeatureRequestDraft, Profile } from "./types";
import { normalizeFeatureRequestDraft } from "./validation";

type FeatureRequestRow = {
  id: string;
  author_id: string;
  title: string;
  description: string;
  created_at: string;
  author: Profile | Profile[] | null;
};

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl(window.location),
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function syncProfile(user: User): Promise<void> {
  const displayName =
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email ??
    "Google user";

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName,
    avatar_url: user.user_metadata.avatar_url ?? null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}

export async function listFeatureRequests(): Promise<FeatureRequest[]> {
  const { data, error } = await supabase
    .from("feature_requests")
    .select(
      "id, author_id, title, description, created_at, author:profiles!feature_requests_author_id_fkey(id, display_name, avatar_url)",
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(toFeatureRequest);
}

export async function createFeatureRequest(
  draft: FeatureRequestDraft,
  authorId: string,
): Promise<void> {
  const normalized = normalizeFeatureRequestDraft(draft);
  const { error } = await supabase.from("feature_requests").insert({
    title: normalized.title,
    description: normalized.description,
    author_id: authorId,
  });

  if (error) {
    throw error;
  }
}

function toFeatureRequest(row: FeatureRequestRow): FeatureRequest {
  const author = Array.isArray(row.author) ? row.author[0] : row.author;

  return {
    id: row.id,
    author_id: row.author_id,
    title: row.title,
    description: row.description,
    created_at: row.created_at,
    author: author ?? {
      id: row.author_id,
      display_name: "Unknown user",
      avatar_url: null,
    },
  };
}
