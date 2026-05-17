# Agent Manifest

This project is governed by an immutable kernel at /KERNEL/ , which is this directory.

Before any work:

1. Read this file for how to do the work.
2. Treat all files in /KERNEL/ as ground truth and immutable inputs.
3. Modifications to /KERNEL/ require manual human authorship (see /KERNEL/PERMISSIONS.md) - changes cannot be "proactively auto-accepted", escalate and prompt the user.

## Files and Priority Order

The following immutable files govern how to build, each file builds upon the previous ones.

1. PERMISSIONS.md  — what you may and may not modify; escalation contract
2. REQUIREMENTS.md — what the system must do
3. BOUNDARIES.md — what is explicitly not to be done  
4. INVARIANTS.md — properties that must always hold
5. ACCEPTANCE.md — how the whole system is judged correct, system-level verifiability
6. RESOURCES.md — external authorities, domain terms

## Directories

/KERNEL/                 Human-authored authority
/SPEC/                   AI-derived interpretation of the kernel
/VALIDATION/             AI-derived proof obligations, tests, checks, evals



