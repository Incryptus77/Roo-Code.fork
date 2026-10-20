# Roo-Code.fork — Continuous Artifact Placement and Harness Migration

## Canonical requirement
All project construction artifacts (detailed agent instructions, project skills and metadata, rules, commands, reusable prompts, agent/harness configs, PRDs, design decisions, research/reviews, Agent Comms and nonruntime automation) live under `.incryptusos/`. Only genuine project/source/runtime material and tool-required minimal entrypoints may remain outside.

## Known existing reading paths outside .incryptusos
- `README.md` — inspect contents, callers, current source and migration safety.

## Do the migration rather than merely record it
1. Run `node .incryptusos/scripts/audit-documentation.cjs --json`; inspect tracked candidates, app loaders and active agents.
2. Classify MOVE_CONSTRUCTION / COMPAT_ENTRYPOINT / PRODUCT_RUNTIME_KEEP / UNKNOWN_NEEDS_PROOF.
3. Confirm file source and references with git grep, package manifests, .github workflows, IDE/skill loaders, build scripts, tests and current handoffs.
4. Ahead of moving, repair consumers and tests. Move safe files with `git mv` on owned branch into .incryptusos directories. Retain compatible fixed-path forwarding scripts where needed and verify.
5. Run old/new invocations, active app smoke tests and hostile permissions. Record old/new paths, origin SHA, changed consumers and rollback under .incryptusos/audits/source-moves/.
6. Publish remote and independently reread changed references. Repeat every agent startup and PR. Open unresolved exceptions with exact owner and earliest safe migration slice.

## Do not break active Owner development
An existing dirty or rebasing local checkout is preserved. Remote files must not be force changed. If a runtime script is actually loaded by a deployed service or GitHub Actions expects a fixed path, it is product/compatibility material until complete equivalent integration tests pass. Never move unrelated code just to satisfy a naming rule.

## Required exception examples
Root `AGENTS.md` may be a minimal tool discovery pointer, `README.md` a concise project entrypoint, and `.github/workflows/` a required GitHub loader. Their substantive instructions and scripts belong inside .incryptusos.

[END OF DOCUMENT: Roo-Code.fork — Continuous Artifact Placement and Harness Migration]
