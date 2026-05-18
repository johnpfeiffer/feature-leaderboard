# Acceptance Enumeration

This document enumerates testable acceptance scenarios from requirements, boundaries, invariants, and the kernel acceptance criteria.

## ACCEPT-001: Anonymous User Sees Login Only

Trace:

- `REQ-002`
- `INV-004`

Given a user who is not authenticated,
when they visit the application,
then they are shown a login page or login path,
and they are not shown the feature request leaderboard.

Proof type:

- End-to-end browser test.
- Authorization test for direct data access.

## ACCEPT-002: Anonymous User Cannot Read Feature Requests Directly

Trace:

- `REQ-002`
- `INV-004`
- `BOUNDARY-005`

Given an unauthenticated client,
when it directly requests feature request data,
then the request is rejected by server-side or database authorization.

Proof type:

- Integration test against data access layer or database policy.

## ACCEPT-003: Anonymous User Cannot Create Feature Request Directly

Trace:

- `REQ-002`
- `REQ-003`
- `INV-004`
- `BOUNDARY-005`

Given an unauthenticated client,
when it directly attempts to create a feature request,
then the request is rejected by server-side or database authorization.

Proof type:

- Integration test against data access layer or database policy.

## ACCEPT-004: Google Login Grants Application Access

Trace:

- `REQ-002`

Given a user with valid Google authentication,
when the authentication flow completes,
then the user can access the authenticated application.

Proof type:

- End-to-end test with mocked auth or documented manual OAuth test.

## ACCEPT-005: Authenticated User Can View Leaderboard

Trace:

- `REQ-001`
- `REQ-004`

Given an authenticated user,
when feature requests exist,
then the user can view the feature request leaderboard.

Each listed feature request shows:

- Title
- Description or summary
- Author display identity
- Creation time

Proof type:

- Component test.
- End-to-end browser test.

## ACCEPT-006: Leaderboard Is Sorted By Creation Date Time

Trace:

- `REQ-001`
- Kernel acceptance: "Features should be sorted - for now use Creation Date Time"

Given an authenticated user,
when multiple feature requests exist with different creation times,
then the leaderboard displays them sorted by creation date time.

When two feature requests have the same creation time,
then the ordering remains deterministic.

Proof type:

- Unit test for sorting behavior.
- Integration or end-to-end test with seeded feature requests.

## ACCEPT-007: Authenticated Empty State

Trace:

- `REQ-001`
- `REQ-004`

Given an authenticated user,
when no feature requests exist,
then the application shows an empty leaderboard state without failing.

Proof type:

- Component test.
- End-to-end browser test.

## ACCEPT-008: Authenticated User Can Submit Valid Feature Request

Trace:

- `REQ-003`
- `REQ-005`
- `INV-003`

Given an authenticated user,
when they submit a feature request with a valid title and description,
then the feature request is persisted,
and it appears in the leaderboard,
and it is attributed to that authenticated user.

Proof type:

- Integration test.
- End-to-end browser test.

## ACCEPT-009: Multi-User Leaderboard Shows Cross-User Data

Trace:

- `REQ-001`
- `REQ-003`
- `REQ-004`
- Kernel acceptance: "It is a multi-user app"

Given at least three authenticated users,
and User 1 has no submitted feature requests,
and User 2 has submitted at least one feature request,
and User 3 has submitted at least one feature request,
when each user views the leaderboard,
then each user can see the persisted feature requests from User 2 and User 3,
and User 1 can view the leaderboard even with no authored requests.

Proof type:

- End-to-end browser test with mocked authenticated users.
- Integration test with seeded users and feature requests.

## ACCEPT-010: Missing Title Is Rejected

Trace:

- `REQ-003`

Given an authenticated user,
when they submit a feature request without a title,
then no feature request is persisted.

Proof type:

- Form validation test.
- Data-layer validation test.

## ACCEPT-011: Missing Description Is Rejected

Trace:

- `REQ-003`

Given an authenticated user,
when they submit a feature request without a description,
then no feature request is persisted.

Proof type:

- Form validation test.
- Data-layer validation test.

## ACCEPT-012: Authorship Is Bound To Authenticated User

Trace:

- `REQ-003`
- `INV-003`
- `BOUNDARY-005`

Given an authenticated user,
when they submit a feature request,
then the persisted author is the authenticated user.

Proof type:

- Integration test.
- Database policy test.

## ACCEPT-013: Authorship Cannot Be Spoofed

Trace:

- `REQ-003`
- `INV-003`
- `BOUNDARY-005`

Given an authenticated user,
when they submit a feature request while attempting to set another user's author identity,
then the request is rejected or the author is overwritten with the authenticated user's identity.

Proof type:

- Integration test.
- Database policy test.

## ACCEPT-014: Feature Requests Persist Across Restart Or Redeploy

Trace:

- `REQ-005`

Given persisted users and feature requests,
when the application restarts or redeploys,
then the users and feature requests remain available.

Proof type:

- Integration test against durable data store.
- Deployment smoke test.

## ACCEPT-015: Browser Storage Is Not Source Of Truth

Trace:

- `REQ-005`

Given feature requests already exist,
when an authenticated user clears browser storage or uses a different browser,
then the feature requests remain available after authentication.

Proof type:

- End-to-end browser test.
- Manual cross-browser smoke test.

## ACCEPT-016: MVP Uses No Paid-Only Required Service

Trace:

- `BOUNDARY-004`

Given the selected architecture,
when implementation dependencies are reviewed,
then the MVP can run using only free-tier required services.

Proof type:

- Architecture review checklist.
- Deployment documentation review.

## ACCEPT-017: Validation Evidence Is Recorded

Trace:

- `BOUNDARY-002`
- `INV-002`

Given a completed implementation task,
when the task is marked complete,
then relevant validation commands and outcomes are recorded.

Proof type:

- Pull request checklist.
- Task completion checklist.

## ACCEPT-018: Kernel Remains Unmodified By Agents

Trace:

- `BOUNDARY-001`

Given agent-produced work,
when the diff is reviewed,
then no files under `/KERNEL/` are modified by the agent.

Proof type:

- Git diff check.
