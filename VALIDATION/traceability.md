# Traceability Matrix

## Requirements

| Kernel Item | Derived Spec Coverage | Validation Coverage |
| --- | --- | --- |
| `REQ-001` Feature Leaderboard | `SPEC/product-spec.md`, `SPEC/modules.md` | `ACCEPT-005`, `ACCEPT-006`, `ACCEPT-007`, `ACCEPT-009` |
| `REQ-002` Google-Authenticated Users | `SPEC/product-spec.md`, `SPEC/architecture.md`, `SPEC/modules.md` | `ACCEPT-001`, `ACCEPT-002`, `ACCEPT-003`, `ACCEPT-004` |
| `REQ-003` Create Feature Request | `SPEC/product-spec.md`, `SPEC/data-model.md`, `SPEC/modules.md` | `ACCEPT-008`, `ACCEPT-009`, `ACCEPT-010`, `ACCEPT-011`, `ACCEPT-012`, `ACCEPT-013`, `ACCEPT-014` |
| `REQ-004` View Feature Requests | `SPEC/product-spec.md`, `SPEC/modules.md` | `ACCEPT-005`, `ACCEPT-007`, `ACCEPT-009` |
| `REQ-005` Persistence | `SPEC/product-spec.md`, `SPEC/architecture.md`, `SPEC/data-model.md` | `ACCEPT-008`, `ACCEPT-015`, `ACCEPT-016` |

## Boundaries

| Kernel Item | Derived Spec Coverage | Validation Coverage |
| --- | --- | --- |
| `BOUNDARY-001` Immutable Kernel | `SPEC/README.md`, `VALIDATION/README.md` | `ACCEPT-019` |
| `BOUNDARY-002` Validation Required | `VALIDATION/README.md`, `VALIDATION/test-plan.md` | `ACCEPT-018` |
| `BOUNDARY-003` Prioritization of Authoritative Resources | `SPEC/architecture.md` | Architecture review checklist |
| `BOUNDARY-004` No Paid-Only MVP Dependency | `SPEC/architecture.md` | `ACCEPT-017` |
| `BOUNDARY-005` No Client-Only Authorization | `SPEC/architecture.md`, `SPEC/data-model.md` | `ACCEPT-002`, `ACCEPT-003`, `ACCEPT-013`, `ACCEPT-014` |

## Invariants

| Kernel Item | Derived Spec Coverage | Validation Coverage |
| --- | --- | --- |
| `INV-001` Documentation as facts | All derived docs | Documentation review |
| `INV-002` Tests Pass | `VALIDATION/test-plan.md` | `ACCEPT-018` |
| `INV-003` Authorship Integrity | `SPEC/data-model.md`, `SPEC/modules.md` | `ACCEPT-008`, `ACCEPT-013`, `ACCEPT-014` |
| `INV-004` Authentication Enforcement | `SPEC/product-spec.md`, `SPEC/architecture.md` | `ACCEPT-001`, `ACCEPT-002`, `ACCEPT-003` |

## Current Gaps And Ambiguities

| Topic | Gap | Suggested Resolution |
| --- | --- | --- |
| Leaderboard ranking | No scoring or voting exists in current kernel. Kernel acceptance specifies creation date time sorting. | Treat as creation-date-time sorted until another ranking requirement is added. |
| Feature editing | Not required. | Exclude from MVP unless kernel adds it. |
| Feature deletion | Not required. | Exclude from MVP unless kernel adds it. |
| Admin roles | Not required. | Exclude from MVP unless kernel adds it. |
| Field limits | Not specified. | Define practical limits in implementation spec before coding. |
