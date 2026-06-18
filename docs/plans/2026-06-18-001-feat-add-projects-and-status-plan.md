---
title: "feat: Add Projects as feature request containers and status field"
type: feat
origin: docs/brainstorms/2026-06-18-add-projects-requirements.md
created: 2026-06-18
---

# feat: Add Projects as Feature Request Containers and Status Field

## Summary

Add a `projects` table so every feature request belongs to a project (INV-005), each project carries a maturity level (INV-006), and the authenticated view groups feature requests by project ordered by maturity. Also add the `status` column to `feature_requests` (REQ-007) since we are modifying the schema. Projects are pre-seeded — no CRUD UI.

---

## Problem Frame

The kernel requires feature requests to exist within a Project (INV-005) and projects to have a maturity attribute (INV-006). The current implementation has neither — feature requests are a flat list with no project container. Additionally, the `status` field required by REQ-007 exists in the spec and data model but is missing from the database schema, TypeScript types, and UI.

---

## Requirements

From the origin document (see origin: `docs/brainstorms/2026-06-18-add-projects-requirements.md`):

- **R1**: Project entity with name and maturity (`idea`, `vibes-only`, `vibes-with-code`, `vibes-with-tests`, `spec-driven`, `evals`)
- **R2**: Every feature request references exactly one project
- **R3**: Projects are pre-seeded in the database (no application CRUD)
- **R4**: Single-page grouped display — all projects visible, each showing its feature requests
- **R5**: Projects ordered by maturity (most mature first), alphabetical tiebreaker
- **R6**: Per-project feature request creation form
- **R7**: Authorization unchanged — all authenticated users see all projects and requests
- **R8**: Existing feature requests migrated to a seed project

Additional (agreed during planning):

- **R9**: Add `status` column to `feature_requests` with allowed values `Requested`, `Pending`, `Beta`, `Done` and default `Requested` (REQ-007)

---

## Key Technical Decisions

**KTD-1: Maturity ordering via integer column.** Store maturity as a text enum but add a `maturity_order` integer column to `projects` for sort queries. This avoids complex `CASE` expressions in every query and keeps ordering deterministic. The order maps: `evals`=1, `spec-driven`=2, `vibes-with-tests`=3, `vibes-with-code`=4, `vibes-only`=5, `idea`=6.

**KTD-2: Single schema migration file.** All schema changes (new `projects` table, `project_id` and `status` columns on `feature_requests`, seed data, RLS policies) go into one new migration SQL file applied after the existing `schema.sql`. This keeps the migration atomic and the existing schema file as a historical baseline.

**KTD-3: Per-project collapsible form.** Each project section includes a toggle button to show/hide a feature request creation form. Only one form is visible at a time. This avoids cluttering the page with multiple open forms while keeping the interaction local to each project.

**KTD-4: Status as a database-level check constraint.** The `status` column uses a `CHECK` constraint matching the existing pattern for `title` and `description` validation. Default value is `Requested`. The UI displays status as a badge on each feature request item but does not provide a way to change it (no status transition workflow per the spec's explicit non-goals).

---

## Scope Boundaries

### Included

- `projects` table with name, maturity, maturity_order, RLS policies
- `project_id` foreign key and `status` column on `feature_requests`
- Seed SQL for at least one project
- Migration of existing feature requests to the seed project
- UI restructured to project-grouped sections with maturity badges
- Per-project feature request creation
- Status badge on each feature request item
- Updated tests

### Deferred to Follow-Up Work

- Project creation, editing, or deletion UI
- Per-project access control or roles
- Cross-project search or filtering
- Project descriptions or metadata beyond name and maturity
- Status transition workflow (changing status via UI)

### Outside this product's identity

- Project management features (tasks, milestones, timelines)
- Nested project hierarchies

---

## Implementation Units

### U1. Database schema: projects table, feature_requests changes, seed data

**Goal:** Create the `projects` table, add `project_id` and `status` to `feature_requests`, seed a default project, and migrate existing rows.

**Requirements:** R1, R2, R3, R5, R7, R8, R9

**Dependencies:** None

**Files:**
- `supabase/002-add-projects-and-status.sql` (create)
- `supabase/schema.sql` (no change — kept as baseline)

**Approach:**
- Create `projects` table: `id` (uuid PK), `name` (text, unique, not null), `maturity` (text, not null, CHECK against the six allowed values), `maturity_order` (integer, not null), `created_at`, `updated_at`
- Add RLS to `projects`: authenticated users can SELECT; no INSERT/UPDATE/DELETE policies (pre-seeded only)
- Add `project_id` (uuid, not null, FK to `projects`) to `feature_requests`
- Add `status` (text, not null, default `'Requested'`, CHECK against the four allowed values) to `feature_requests`
- Seed one project (e.g., name: `Feature Leaderboard`, maturity: `vibes-with-code`, maturity_order: 4) — the user can adjust via direct DB access
- UPDATE existing `feature_requests` rows to set `project_id` to the seed project's ID and `status` to `'Requested'`
- Add `NOT NULL` constraint on `project_id` after the backfill
- Create index on `feature_requests(project_id, created_at desc, id desc)` for grouped queries
- Update RLS insert policy on `feature_requests` to also allow `project_id` (no restriction — any authenticated user can create in any project)

**Patterns to follow:** Existing `schema.sql` — `CHECK` constraints, `gen_random_uuid()`, `timestamptz not null default now()`, RLS policy naming

**Test scenarios:**
- Inserting a project with each of the six valid maturity values succeeds
- Inserting a project with an invalid maturity value is rejected by CHECK
- Inserting a feature request with a valid `project_id` and valid `status` succeeds
- Inserting a feature request with status `Requested`, `Pending`, `Beta`, `Done` each succeeds
- Inserting a feature request with an invalid status is rejected by CHECK
- Inserting a feature request without a `project_id` is rejected (NOT NULL)
- Authenticated users can SELECT from projects
- Anonymous users cannot SELECT from projects
- Seed project exists after migration
- Existing feature requests have `project_id` set to the seed project and `status` set to `Requested`

**Verification:** Run the migration SQL against the Supabase project. Verify the seed project exists and existing feature requests have the correct `project_id` and `status`.

---

### U2. TypeScript types and API layer

**Goal:** Update types to include `Project` and add `project_id`/`status` to `FeatureRequest`. Update API functions to fetch projects and include project context.

**Requirements:** R1, R2, R4, R6, R9

**Dependencies:** U1

**Files:**
- `app/src/types.ts` (modify)
- `app/src/api.ts` (modify)

**Approach:**
- Add `Project` type: `id`, `name`, `maturity`, `maturity_order`
- Add `project_id` and `status` to `FeatureRequest` type
- Add `project_id` to `FeatureRequestDraft` type
- Add `listProjects()` function: SELECT from `projects` ordered by `maturity_order` asc, `name` asc
- Update `listFeatureRequests()` to also select `project_id` and `status`
- Update `createFeatureRequest()` to accept and insert `project_id` and set status to `Requested`
- Update `FeatureRequestRow` type to include `project_id` and `status`
- Update `toFeatureRequest()` mapper

**Patterns to follow:** Existing `api.ts` — Supabase query builder, error throwing, type mapping

**Test scenarios:**
- Test expectation: none — API functions are thin Supabase wrappers; behavior is covered by integration and E2E tests

**Verification:** TypeScript compiles without errors. API functions return the expected shapes.

---

### U3. Validation updates

**Goal:** Update validation to handle `project_id` on the feature request draft.

**Requirements:** R6

**Dependencies:** U2

**Files:**
- `app/src/types.ts` (already modified in U2)
- `app/src/validation.ts` (modify)
- `app/src/validation.test.ts` (modify)
- `app/src/featureRequestForm.ts` (modify)
- `app/src/featureRequestForm.test.ts` (modify)

**Approach:**
- `FeatureRequestDraft` now includes `project_id` — validation does not validate `project_id` (it's set by the UI, not user-entered text), but the type must flow through
- `emptyFeatureRequestDraft()` returns `project_id: ""` as the empty state
- `featureRequestDraftFromFormData()` reads the `project_id` from a hidden input or data attribute
- Form HTML includes a hidden `project_id` field
- Existing title/description validation is unchanged

**Patterns to follow:** Existing table-driven test pattern in `validation.test.ts`

**Test scenarios:**
- Valid draft with project_id passes validation (title and description still validated, project_id passed through)
- Missing title still produces error regardless of project_id
- Missing description still produces error regardless of project_id
- `featureRequestDraftFromFormData` extracts project_id from form data
- `emptyFeatureRequestDraft` includes project_id as empty string

**Verification:** `npm run test` passes with updated tests.

---

### U4. UI restructure: project-grouped display with maturity badges

**Goal:** Restructure the authenticated view from a flat feature request list to project-grouped sections, each showing a maturity badge and its feature requests.

**Requirements:** R4, R5, R9

**Dependencies:** U2, U3

**Files:**
- `app/src/render.ts` (modify)
- `app/src/styles.css` (modify)

**Approach:**
- Update `AppState` to include `projects: Project[]`
- In `load()`, fetch projects via `listProjects()` in parallel with feature requests
- Replace the single `workspace` grid (form + list) with a vertical stack of project sections
- Each project section renders: project name as heading, maturity badge (styled inline element), feature request list filtered to that project, and a per-project "Suggest feature" toggle button
- Maturity badge uses a small styled element with the maturity value text
- Feature requests within each section maintain the existing sort (creation time desc, id desc)
- Projects with zero feature requests still render (with empty state)
- Per-project form: clicking "Suggest feature" on a project section reveals the creation form with `project_id` pre-set via hidden field; clicking on a different project closes the current form and opens the new one
- Update `AppState` to track `activeProjectId: string | null` for form visibility
- Status badge: each feature request item shows its status as a small styled label in the footer alongside author and date
- Remove the old single form from the sidebar layout
- Switch workspace from 2-column grid to single-column layout

**Patterns to follow:** Existing `render.ts` — string template HTML, `data-action` attributes for event binding, `escapeHtml()` for user content

**Test scenarios:**
- Test expectation: none — render.ts produces HTML strings with no testable pure logic beyond what's covered by existing tests. UI behavior is verified via E2E and manual testing.

**Verification:** The authenticated view shows projects grouped by maturity. Each project section shows its name, maturity badge, feature requests with status badges, and a form toggle. Form submission creates a feature request in the correct project.

---

### U5. CSS for project sections and badges

**Goal:** Add styles for project sections, maturity badges, status badges, and per-project form layout.

**Requirements:** R4, R5, R9

**Dependencies:** U4

**Files:**
- `app/src/styles.css` (modify)

**Approach:**
- Add `.project-section` — bordered card matching existing `.request-list` style, stacked vertically with gap
- Add `.maturity-badge` — small pill/chip next to project name, using the green palette from the existing design
- Add `.status-badge` — small label in the feature request footer
- Add `.project-heading` — flex row with project name and maturity badge
- Adapt the responsive breakpoint to work with the new single-column layout
- Remove or adapt the 2-column `.workspace` grid since the form is now inline per-project

**Test scenarios:**
- Test expectation: none — pure styling

**Verification:** Visual check that project sections, maturity badges, and status badges render correctly on desktop and mobile widths.

---

### U6. End-to-end validation and test updates

**Goal:** Update existing tests and add new test cases covering projects and status.

**Requirements:** R1, R2, R4, R5, R6, R7, R8, R9

**Dependencies:** U1, U2, U3, U4, U5

**Files:**
- `app/src/validation.test.ts` (modify — already partially in U3)
- `VALIDATION/test-plan.md` (modify — add project and status test scenarios)
- `VALIDATION/acceptance-enumeration.md` (modify — add project acceptance criteria)

**Approach:**
- Ensure all existing validation tests still pass with the updated types
- Add test scenarios for status validation at the database level (covered by migration SQL CHECK constraints)
- Update `VALIDATION/test-plan.md` to include project-related test cases: project list ordering by maturity, per-project feature request creation, existing data migration verification
- Update `VALIDATION/acceptance-enumeration.md` to add INV-005 and INV-006 acceptance evidence

**Execution note:** Run `npm run test` to verify all unit tests pass. Manual verification against the running app with seeded projects.

**Test scenarios:**
- Existing validation tests pass unchanged (title/description validation)
- Projects appear ordered by maturity level on the page
- Feature request created via per-project form belongs to the correct project
- All feature requests display a status badge
- New feature requests default to `Requested` status
- Existing feature requests (post-migration) show in the seed project with `Requested` status
- Empty project (no feature requests) displays empty state within its section

**Verification:** `npm run test` passes. Manual walkthrough confirms projects display grouped by maturity, per-project creation works, and status badges appear.

---

## Open Questions

- What name and maturity should the default seed project have? Plan assumes `Feature Leaderboard` with maturity `vibes-with-code`, adjustable via direct database access after deployment.

---

## Risks & Dependencies

- **Migration on live data**: The `project_id` column is added as nullable first, backfilled, then set to NOT NULL. If the migration is interrupted between steps, feature requests could exist without a project. Mitigation: wrap in a transaction.
- **Supabase free-tier**: Adding a table and columns is within free-tier limits. No new services required.
- **UI complexity**: Moving from a flat list to grouped sections is the largest change. The per-project form toggle adds state management. Mitigation: keep state minimal — just `activeProjectId`.

---

## Sources & Research

- `KERNEL/INVARIANTS.md` — INV-005 (feature requests in a project), INV-006 (project maturity)
- `KERNEL/REQUIREMENTS.md` — REQ-007 (feature status)
- `supabase/schema.sql` — existing table structure and RLS patterns
- `app/src/render.ts` — existing UI rendering pattern
- `app/src/api.ts` — existing Supabase query patterns
- `app/src/validation.test.ts` — existing table-driven test pattern
