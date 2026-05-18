# Data Model Specification

## Entities

### User Profile

Represents the application-visible portion of an authenticated Google user.

Fields:

- `id` - stable authenticated user identifier.
- `display_name` - name shown beside feature requests.
- `avatar_url` - optional display image.
- `created_at` - profile creation time.
- `updated_at` - profile update time.

Derived privacy rule:

- Store only profile data needed for attribution and display.

### Feature Request

Represents a user-submitted feature request.

Fields:

- `id` - stable unique identifier.
- `author_id` - authenticated user who created the request.
- `title` - required request title.
- `description` - required request description.
- `created_at` - creation time.
- `updated_at` - last update time.


## Relationships

- A user profile can author many feature requests.
- Every feature request has exactly one author.
- A feature request cannot exist without an authenticated author.

## Authorization Rules

Rules derived from kernel requirements, boundaries, and invariants:

- Anonymous users may not select feature requests.
- Anonymous users may not insert feature requests.
- Authenticated users may select feature requests.
- Authenticated users may insert feature requests.
- Inserted feature requests must use the authenticated user's identity as `author_id`.
- Client-submitted authorship must not override the authenticated identity.

## Constraints

Required constraints:

- Feature request title is non-empty after trimming.
- Feature request description is non-empty after trimming.
- Feature request author is required.
- Feature request author references a valid authenticated user profile.
- Creation time is recorded by the system.

Recommended constraints:

- Title maximum length.
- Description maximum length.
- Stable ordering by `created_at` and `id`.

## Non-Goals

The current model intentionally excludes:

- Vote records.
- Comment records.
- Public anonymous read access.
- Admin roles.
- Moderation audit logs.

