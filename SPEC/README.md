# Derived Specification

This directory contains AI-derived interpretation of `/KERNEL/`.

The files here are not authoritative. If anything in this directory conflicts with `/KERNEL/`, the kernel wins.

## Files

- `product-spec.md` - user-facing behavior and product scope derived from requirements.
- `architecture.md` - recommended MVP architecture and external service assumptions.
- `data-model.md` - persistence model and authorization implications.
- `modules.md` - shallow module decomposition for implementation.

## Current Product Interpretation

The current MVP is an authenticated feature request list. The word "leaderboard" is retained from the kernel, but no voting or scoring behavior is currently required.

Kernel acceptance currently defines the ranking behavior:

- Feature requests are sorted by creation date time.
- Derived implementation should use deterministic tie-breaking when creation times match.
