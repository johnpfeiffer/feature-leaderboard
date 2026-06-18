# Add Projects as Feature Request Containers

Date: 2026-06-18

## Problem

Feature requests exist in a flat list with no organizational container. The kernel requires that feature requests exist within a Project (INV-005) and that projects carry a maturity attribute (INV-006). The current implementation satisfies neither invariant.

## Outcome

Authenticated users see all projects on a single page, grouped by project. Each project displays its name, maturity level, and its feature requests. Users can submit feature requests scoped to a specific project.

## Requirements

### R1: Project entity

A project has a name and a maturity level. Maturity values are: `idea`, `vibes-only`, `vibes-with-code`, `vibes-with-tests`, `spec-driven`, `evals`.

Kernel trace: INV-005, INV-006.

### R2: Feature requests belong to a project

Every feature request must reference exactly one project. A feature request cannot exist without a project.

Kernel trace: INV-005.

### R3: Projects are pre-seeded

Projects are created directly in the database. The application does not provide UI for creating, editing, or deleting projects.

### R4: Single-page grouped display

The authenticated view shows all projects on one page. Each project appears as a section containing its name, maturity badge, and its feature requests sorted by creation time (newest first) with deterministic tie-breaking.

### R5: Project ordering by maturity

Projects are ordered by maturity level, most mature first: `evals` > `spec-driven` > `vibes-with-tests` > `vibes-with-code` > `vibes-only` > `idea`. Projects at the same maturity level use alphabetical name ordering as a tiebreaker.

### R6: Per-project feature request creation

Each project section includes an action to submit a feature request scoped to that project. The creation form pre-selects the project. Title and description remain required fields.

### R7: Authorization unchanged

All authenticated users can view all projects and all feature requests. All authenticated users can create feature requests in any project. Anonymous users see only the login page. No per-project access control.

### R8: Migration of existing data

Existing feature requests must be assigned to a project. A seed project must exist before the migration runs so that INV-005 is not violated during or after the migration.

## Scope Boundaries

### Included

- `projects` database table with RLS
- `project_id` foreign key on `feature_requests`
- Seed SQL for at least one project
- Migration path for existing feature requests
- UI restructured from flat list to project-grouped sections
- Maturity badge visible on each project section

### Deferred for later

- Project creation, editing, or deletion UI
- Per-project access control or roles
- Cross-project search or filtering
- Project descriptions or metadata beyond name and maturity

### Outside this product's identity

- Project management features (tasks, milestones, timelines)
- Nested project hierarchies

## Success Criteria

- INV-005 is satisfied: every feature request belongs to a project.
- INV-006 is satisfied: every project has a name and one of the six maturity values.
- Authenticated users see projects grouped on one page, ordered by maturity.
- Users can create feature requests scoped to a specific project.
- Existing feature requests are preserved and assigned to a seed project.
- All existing acceptance criteria continue to pass.

## Outstanding Questions

- What name and maturity should the default seed project have for migrating existing feature requests?

## Dependencies and Assumptions

- At least one project must be seeded before the app is usable after this change.
- The maturity ordering is a fixed sequence, not configurable.
- Project data changes (name, maturity) are handled via direct database access, not the application.
