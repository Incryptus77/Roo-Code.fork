# Roo-Code.fork — Agent Commands and Execution Procedures

## Recover and plan direct executable task
Read `.incryptusos/AGENTS.md` and `.incryptusos/agent_comms/START_HERE.md`. Inspect `git status --short --branch`, `git log -1 --format=%H` and current accepted task handoff without cleaning. Determine first incomplete working slice: R0 Pin original and fork source/license dependency matrix.

## Verify mission pack and placement
`node .incryptusos/scripts/verify-agent-pack.cjs` checks local mission files, skill descriptions and references.
`node .incryptusos/scripts/audit-documentation.cjs --json` lists nonproduct candidates; it **never** auto-moves them.
`node --test .incryptusos/scripts/verify-agent-pack.test.cjs` runs deterministic local mission harness checks.

## Implement and test
Use actual project native toolchain discovered in current source (Cargo, pnpm, Python, Frappe, etc). Do not run invented commands or install dependencies without source/host evidence. Capture exact exit of every nested child, repair first failure and rerun affected consumers.

## Migrate nonproject material
Run placement audit, inspect consumers, update references, then git mv confirmed construction files to .incryptusos. Before retiring old path, execute both original and replacement invocations and verify platform loader requirements.

## Publish and receipt
Use protected branch PR/merge as repo already uses, validate returned main remote readback and update handoff. For unavailable H: operations write a complete guarded source-pinned runner under `.incryptusos/scripts/` and expose minimal Git Bash invocation; record sanitized remote receipts.

[END OF DOCUMENT: Roo-Code.fork — Agent Commands and Execution Procedures]
