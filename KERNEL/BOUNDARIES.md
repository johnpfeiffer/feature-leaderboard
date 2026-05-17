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

- Conflicts between researched or discovered items and RESOURCES are documented, and 

