# Product Specification

Derived from:

- `KERNEL/REQUIREMENTS.md`
- `KERNEL/BOUNDARIES.md`
- `KERNEL/INVARIANTS.md`
- `KERNEL/RESOURCES.md`

## Scope

The system is a web application where Google-authenticated users can submit and view feature requests.

The MVP does not include voting, comments, public anonymous browsing, moderation workflows, notifications, or status transition workflows unless the kernel later adds those requirements.

## Users

### Anonymous Visitor

An anonymous visitor is not authenticated.

Expected behavior:

- Can reach the application entry point.
- Can see the login page or login path.
- Cannot read feature requests.
- Cannot create feature requests.

### Authenticated User

An authenticated user has completed Google authentication.

Expected behavior:

- Can view the feature request leaderboard.
- Can submit a feature request.
- Can see feature request authorship.
- Can return later and see persisted feature requests.
- Can sign out.

## Feature Request Leaderboard

The leaderboard displays persisted feature requests to authenticated users.

Each feature request must include:

- Title
- Description or summary
- Author display identity
- Creation time

Each feature request also has a status.

Allowed status values:

- Requested
- Pending
- Beta
- Done

Display behavior:

- Sort by creation date time.
- Use a deterministic secondary sort such as unique identifier when creation times match.
- Empty state should be visible to authenticated users when no feature requests exist.
- Show the current status for each feature request.

## Multi-User Behavior

The system is a multi-user application.

Validation must include at least three users:

- A user with no submitted feature requests.
- A user with one or more submitted feature requests.
- Another user with one or more submitted feature requests.

All authenticated users should see the same persisted leaderboard data, including requests authored by other users.

## Feature Request Creation

Authenticated users can create feature requests by providing:

- Title
- Description

Derived validation:

- Title is required.
- Description is required.
- Whitespace-only values are invalid.
- Maximum lengths should be defined before implementation to protect UI and storage.
- When validation fails, previously entered valid or invalid field values remain visible so the user can correct only the missing or invalid fields.

On successful creation:

- The request is persisted.
- The request is associated with the authenticated user.
- The request is created with status `Requested`.
- The request appears in the leaderboard.

## Authentication

Google authentication is required before reading or modifying application data.

Derived behavior:

- Unauthenticated users are routed to login.
- Authenticated users can access the application.
- Session state may be cached by the client, but authorization must be enforced outside client-only code.
- Signing out removes the local authenticated session and returns the user to the unauthenticated state.
- After sign-out, the user may only see the login page until authenticating again.

## Persistence

Users and feature requests must survive:

- Browser refresh
- Browser storage clearing
- Application restart
- Application redeployment

Browser-local storage must not be the source of truth.

## Out Of Scope For Current Kernel

These features are not currently required:

- Upvotes
- Downvotes
- Comments
- Public anonymous feature browsing
- Status transition workflows
- Request deletion
- Request editing
- Duplicate detection
- Email notifications
- File uploads
- Paid infrastructure
