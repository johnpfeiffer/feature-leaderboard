An experiment in using AI extensively to build an app


1. Human writes immutable kernel.
2. Specification agent reads kernel and produces derived system spec.
3. Specification agent decomposes system into shallow, composable modules.
4. Validation agent creates proof obligations for each requirement and module.
5. Critic agent reviews for traceability, simplicity, missing requirements, weak validation, and excess complexity.
6. Specification agent revises derived artifacts.
7. Human optionally reviews, focusing especially on validation quality.
8. Implementation begins only after each module has falsifiable success criteria.
9. Completion requires evidence, not assertion.

