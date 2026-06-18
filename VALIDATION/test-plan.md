# Test Plan

## Test Strategy

Use red/green TDD for implementation work, as required by `INV-002`.

Prefer concise table-driven tests where the stack supports them.

## Test Layers

### Unit Tests

Target:

- Form validation.
- Data shaping.
- Sorting behavior.
- Auth state branching.

Required cases:

- Valid title and description.
- Missing title.
- Missing description.
- Whitespace-only title.
- Whitespace-only description.
- Missing description preserves previously entered title.
- Missing title preserves previously entered description.
- Signing out clears the authenticated state.
- Creation-date-time sorting.
- Deterministic tie-breaking for equal creation times.
- Allowed feature status values.
- Default feature status for new requests.
- Invalid feature status rejection.
- Empty list state.

### Integration Tests

Target:

- Data persistence.
- Authorship assignment.
- Authorization behavior.

Required cases:

- Authenticated user creates feature request.
- Created request persists in the data store.
- Created request has authenticated author.
- Created request has a valid persisted status.
- Three seeded users can read the same persisted leaderboard.
- A user with no submitted feature requests can still view other users' requests.
- Anonymous read is rejected.
- Anonymous create is rejected.
- Spoofed `author_id` is rejected or ignored.
- Invalid status value is rejected by the server-side data path or database constraint.

### End-To-End Tests

Target:

- Browser-visible acceptance behavior.

Required flows:

- Anonymous visitor sees login only.
- Authenticated user sees empty leaderboard.
- Authenticated user creates feature request.
- Authenticated user sees feature request status in the leaderboard.
- Authenticated user submitting with a missing description sees validation error and keeps the entered title.
- Authenticated user submitting with a missing title sees validation error and keeps the entered description.
- Authenticated user signs out and sees only the unauthenticated login view.
- Authenticated user sees created request after refresh.
- Three authenticated users cover multi-user permutations, including one user with no submitted feature requests.
- Authenticated user sees persisted request after clearing browser storage and signing in again.

OAuth may be tested with a mocked authenticated session for automated CI. At least one documented manual smoke test should cover real Google OAuth before production use.

### Database Policy Tests

Target:

- Server-side or database-level enforcement required by `BOUNDARY-005`.

Required checks:

- Unauthenticated role cannot select feature requests.
- Unauthenticated role cannot insert feature requests.
- Authenticated role can select feature requests.
- Authenticated role can insert a feature request for itself.
- Authenticated role cannot create a feature request attributed to another user.
- Invalid feature status values cannot be persisted.

## Manual Review Checklists

### Architecture Checklist

- MVP does not require paid infrastructure.
- Free-tier assumptions are documented.
- Google OAuth setup is documented.
- Persistence setup is documented.
- Authorization is not client-only.
- `/KERNEL/` has not been modified by agents.

### UI Checklist

- Login page is the only anonymous view.
- Authenticated feature list is readable.
- Required fields are clear.
- Feature status is visible for listed requests.
- Validation errors are visible.
- Empty state is visible.
- Loading and error states are handled.

### Completion Evidence

Each completed task should record:

- Tests added or updated.
- Validation command run.
- Result of validation command.
- Any deferred validation and the reason.
