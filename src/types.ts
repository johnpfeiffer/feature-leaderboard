export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
};

export type FeatureRequest = {
  id: string;
  author_id: string;
  title: string;
  description: string;
  created_at: string;
  author: Profile;
};

export type FeatureRequestDraft = {
  title: string;
  description: string;
};

export type FormErrors = Partial<Record<keyof FeatureRequestDraft, string>>;

