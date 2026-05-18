# Feature Leaderboard

A small TypeScript MVP for an authenticated feature request leaderboard.

## Local Setup

1. Create a Supabase project.
2. Create a Google OAuth client.
3. Enable Google OAuth in Supabase Auth using the Google client ID and secret.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Copy `.env.example` to `.env.local`.
6. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
7. Run the app:

```bash
npm install
npm run dev
```

## Supabase Database Setup

OAuth only creates an authenticated Supabase user. This app also needs application tables for profiles and feature requests.

Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor for the same project used by `VITE_SUPABASE_URL`.

That script creates:

- `public.profiles`
- `public.feature_requests`
- Row Level Security policies for authenticated reads and writes
- The relationship used to show author identity beside each feature request

If Google login succeeds but the app shows a post-login error, the most likely causes are:

- `supabase/schema.sql` was not run.
- It was run against a different Supabase project.
- The tables exist but Row Level Security policies differ from the schema file.
- The app is pointing at the wrong project in `.env.local`.

Quick checks:

1. In Supabase, open `Table Editor` and confirm `profiles` and `feature_requests` exist.
2. In Supabase, open `Authentication` -> `Users` and confirm your Google user exists after login.
3. Confirm `.env.local` uses the same project URL shown in Supabase project settings.
4. Refresh the app and read the yellow error box; it should show the exact Supabase message.

## Google OAuth Setup

The app calls Supabase Auth with `provider: "google"`. If Google is not enabled in the Supabase project, Supabase returns:

```text
Unsupported provider: provider is not enabled
```

Fix that in the Supabase dashboard for the project named by `VITE_SUPABASE_URL`.

1. In Supabase, open `Authentication` -> `Sign In / Providers`.
2. Open `Google`.
3. Enable the Google provider.
4. Paste the Google OAuth Client ID and Client Secret.
5. Save the provider settings.

In Google Cloud Console, create an OAuth client ID with application type `Web application`.

Authorized JavaScript origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Authorized redirect URIs:

```text
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
```

Use the actual callback URL shown on the Google provider page in your Supabase dashboard. The Supabase project URL is not a secret, but this README intentionally uses placeholders so the repository is not tied to one environment.

In Supabase, open `Authentication` -> `URL Configuration` and allow local redirects:

```text
http://localhost:5173/**
http://127.0.0.1:5173/**
```

The app uses `window.location.origin` as `redirectTo`, so use the same host in the browser that you allow in Supabase. If you open `http://localhost:5173`, allow `localhost`; if you open `http://127.0.0.1:5173`, allow `127.0.0.1`.

References:

- Supabase Google login docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase redirect URL docs: https://supabase.com/docs/guides/auth/redirect-urls

## Validation

```bash
npm test
npm run build
```

## Kernel Discipline

`/KERNEL/` is human-authored authority. `/SPEC/` and `/VALIDATION/` are derived interpretation and proof obligations.
