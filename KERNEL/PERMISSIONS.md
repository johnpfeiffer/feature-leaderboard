# Permissions

## Immutable Files
Agents must not modify or remove any file in `/KERNEL/`.

This includes:

- `AGENTS.md`
- `PERMISSIONS.md`
- `REQUIREMENTS.md`
- `BOUNDARIES.md`
- `INVARIANTS.md`
- `ACCEPTANCE.md`
- `RESOURCES.md`

## Allowed Agent Actions

Agents may:

1. Read kernel files.
2. Generate derived specifications.
3. Generate plans.
4. Generate validation artifacts.
5. Generate implementation artifacts.
6. Critique derived artifacts.

## Forbidden Agent Actions

Agents must not:

1. Edit `/KERNEL/`.
2. Treat derived artifacts as authority over the kernel.
3. Delete or weaken validation criteria without recording the reason.
4. Convert unverifiable requirements into implementation work without escalation.
5. Mark work complete without running or specifying the required validation.
6. Attempt to hack or reward-hack, or act unethically towards the User 

