# Frontend Lab CSS contract

React, Angular, and Vue use
`Portfolio.Web/Showcases/shared/showcase-contract.css` as their only authored
visual stylesheet. This keeps the three Shadow DOM implementations visually
equivalent while retaining independent framework source and generated bundles.

## Ownership

- Put framework-neutral tokens, layout, typography, controls, states,
  responsive behavior, and accessibility presentation in
  `showcase-contract.css`.
- Do not add framework-local styles unless a framework integration cannot be
  expressed by the shared contract.
- Document any future local exception beside the rule with the framework
  constraint that requires it.
- The `#root` rules in the shared contract are the only current
  framework-specific exception. They size React's Shadow DOM mount point and
  are harmless for Angular and Vue.
- Each generated framework bundle intentionally embeds its own copy of the
  shared contract because each custom element renders into an isolated Shadow
  DOM. This runtime duplication is required; the authored source remains
  singular.

## Consolidation result

Issue 21 consolidated the accepted issue 17 presentation:

| Authored styles | Before | After |
| --- | ---: | ---: |
| Shared contract | 1,072 lines | 2,040 lines |
| React base and component CSS | 1,155 lines | 0 lines |
| Angular component CSS | 989 lines | 0 lines |
| Vue embedded CSS | 1,120 lines | 0 lines |
| **Total** | **4,336 lines** | **2,040 lines** |

The refactor removed 2,296 authored lines (about 53%) and eliminated duplicate
selector/property pairs in the canonical contract.

## Verification

For each framework:

1. Run its production build.
2. Run its test suite.
3. Run its linter.
4. Inspect the Blazor-hosted route at desktop and responsive widths.
5. Exercise validation, selection controls, tabs, dialogs, sandbox controls,
   customer selection, pagination, customer details, orders, and order details.

The hosted routes are:

- `/frontend-lab/react`
- `/frontend-lab/angular`
- `/frontend-lab/vue`

Generated assets under `Portfolio.Web/wwwroot/showcases` must be rebuilt and
committed whenever the shared contract changes.
