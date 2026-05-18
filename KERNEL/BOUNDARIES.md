# Boundaries

What the AI and system must not do. Limits and constraints.

## BOUNDARY-001: Immutable Kernel

Agents must not modify files in `/KERNEL/`.

Validation:

- Git diff shows no changes under `/KERNEL/`.


## BOUNDARY-002: Validation Required

Do not skip validation. Agents must not mark a task complete without identifying and running, or explicitly deferring, the relevant validation.

Validation:

- Every completed task links to validation evidence.

## BOUNDARY-003: Prioritization of Authoritative Resources

RESOURCES.md are the highest priority source of authority and expertise.

Validation:

- Conflicts between researched or discovered items and RESOURCES are documented. 


## BOUNDARY-004: No Paid-Only MVP Dependency

The MVP must not require a paid hosting, database, authentication, or storage service.

Validation:

- Derived architecture identifies all external services and their free-tier assumptions.


## BOUNDARY-005: No Client-Only Authorization

The system must not rely on client-side code as the sole enforcement for actions

Validation:

- Authorization rules are enforced by server-side code, database policies, or both.

