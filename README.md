# Feature Leaderboard

A small TypeScript MVP for an authenticated feature request leaderboard.

## Local Setup

1. Create a Supabase project.
2. Create a Google OAuth client.
3. Enable Google OAuth in Supabase Auth using the Google client ID and secret.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Copy `app/.env.example` to `app/.env.local`.
6. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
7. Run the app:

```bash
cd app
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
- The app is pointing at the wrong project in `app/.env.local`.

Quick checks:

1. In Supabase, open `Table Editor` and confirm `profiles` and `feature_requests` exist.
2. In Supabase, open `Authentication` -> `Users` and confirm your Google user exists after login.
3. Confirm `app/.env.local` uses the same project URL shown in Supabase project settings.
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
https://YOUR_PRODUCTION_DOMAIN
```

Authorized redirect URIs:

```text
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
```

Use the actual callback URL shown on the Google provider page in your Supabase dashboard. The Supabase project URL is not a secret, but this README intentionally uses placeholders so the repository is not tied to one environment.

In Supabase, open `Authentication` -> `URL Configuration`. The configured URLs must match where the browser is running the app.

For local development, the `Site URL` may already be enough if it is set to `http://localhost:5173`. Add local redirect URLs if login redirects fail, if you use both `localhost` and `127.0.0.1`, or if you add callback routes:

```text
http://localhost:5173/**
http://127.0.0.1:5173/**
```

For production, set the production URL in Supabase too:

```text
https://YOUR_PRODUCTION_DOMAIN/**
```

If the app is deployed under a subpath, include that subpath:

```text
https://YOUR_PRODUCTION_DOMAIN/feature-leaderboard/**
```

The app uses the current page URL without query string or hash as `redirectTo`, so use the same host and path in the browser that you allow in Supabase. If you open `http://localhost:5173`, allow `localhost`; if you deploy to `https://YOUR_PRODUCTION_DOMAIN/feature-leaderboard/`, allow that production subpath.

If local and production both use the same `VITE_SUPABASE_URL`, they share the same Supabase database rows. Use separate Supabase projects if you want separate development and production data.

References:

- Supabase Google login docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase redirect URL docs: https://supabase.com/docs/guides/auth/redirect-urls

## Validation

```bash
cd app
npm test
npm run build
```

## Deployment Copy

The deployable Vite app lives under `app/`. The root-level `cloud-deploy.sh` copies only that subdirectory to the monorepo deployment target and excludes generated or local-only files such as `node_modules`, `dist`, `.env*`, test files, and logs.

Root-level governance and planning artifacts such as `/KERNEL/`, `/SPEC/`, `/VALIDATION/`, and `supabase/schema.sql` are intentionally not copied by the deploy script.

## Kernel Discipline

`/KERNEL/` is human-authored authority. `/SPEC/` and `/VALIDATION/` are derived interpretation and proof obligations.
