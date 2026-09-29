<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

---

## Coding Conventions Summary (for AI Agents)

- **Function Declarations:** Prefer arrow functions assigned to constants. React components may use either style but be consistent.
- **Function Parameters:** Always use a params object (even for single params). Name types as `{FunctionName}Params` and `{FunctionName}Result`.
- **Variable Naming:** Use complete, descriptive names. Avoid single-letter/abbreviated names except for well-known cases (`id`, `url`, etc.) and unused params (prefix with `_`).
- **Boolean Naming:** Prefix with `is`, `has`, `can`, `should`.
- **Arrays:** Use plural names.
- **Functions:** Use verb-noun pairs.
- **TypeScript:** Use `import type` for type-only imports. Prefer `as` for type assertions. **Explicit return types are required for all functions.**
- **Import Order:** Node built-ins, external, internal, relative, type imports (alphabetical/grouped).
- **Formatting:** Use `const` by default. Blank lines before `return`, `throw`, `if`, and between variable declarations and other statements.
- **Comments:** Only for non-obvious logic, workarounds, or references. No commented-out code or obvious comments.
- **Testing:** Test files colocated with source, descriptive test names, Arrange-Act-Assert pattern.
- **Prohibited:** No lodash, no magic numbers (use named constants), avoid deep nesting (prefer early returns).
- **Enforcement:** ESLint, Prettier, TypeScript, pre-commit hooks, and code review.

For details, see `CONVENTIONS.md`.
