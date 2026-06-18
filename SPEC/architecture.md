# Architecture Specification

## Recommended MVP Architecture

Use a hosted web frontend with Supabase as the free-tier backend.

Recommended services:

- Supabase Auth for Google OAuth.
- Supabase Postgres for persisted users and feature requests.
- Supabase Row Level Security for database-enforced authorization.
- A free frontend hosting provider compatible with the chosen web framework.

This recommendation is derived from `RESOURCE-003`, `RESOURCE-004`, `RESOURCE-005`, `BOUNDARY-004`, and `BOUNDARY-005`.

## Why Supabase For This MVP

The kernel requires:

- Google-authenticated users.
- Persisted users and feature requests.
- Free-tier operation.
- Authorization that is not client-only.

Supabase directly supports these constraints with Auth, Postgres, and Row Level Security.

## Alternative Architecture

A self-hosted Redis instance with append-only persistence is not recommended for this MVP.

Reasons:

- Google OAuth still needs to be implemented separately.
- Durable relational constraints are awkward.
- Authorship integrity is easier to enforce in a relational database.
- Free hosting for always-on Redis is less straightforward than Supabase's hosted free tier.
- Server-side authorization logic would need more custom code.

## Frontend

The frontend should provide:

- Login page.
- Authenticated application shell.
- Feature request list.
- Feature request creation form.
- Empty, loading, error, and success states.

Framework choice is intentionally not fixed by the kernel.

## Backend And Data Access

The backend responsibility may be split between framework server routes and Supabase policies.

Required enforcement:

- Anonymous clients cannot read feature request data.
- Anonymous clients cannot create feature requests.
- Authenticated users can read feature requests.
- Authenticated users can create feature requests attributed to themselves.
- Authorship cannot be spoofed by client-provided values.
- Feature request status values are constrained to `Requested`, `Pending`, `Beta`, or `Done`.

## Free-Tier Assumptions

Derived architecture must document:

- Which services are required.
- Which free-tier limits are relevant.
- What happens if a service pauses or exceeds free limits.
- Whether local development requires external credentials.

## Deployment Assumptions

The MVP should be deployable without paid services.

Deployment documentation should include:

- Required environment variables.
- Google OAuth callback URLs.
- Supabase project setup.
- Database migration instructions.
- Validation commands.
