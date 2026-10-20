---
name: normalize-artifacts
description: "Locate and safely migrate non-runtime documentation, prompts, skills, agent communications, rules, harness scripts and build/release automation into .incryptusos. Use at agent startup, before PRs, or when repairing stale paths after a document or tooling move."
---

# Normalize Construction Artifacts

1. Read ../../mission/DOCUMENTATION_AND_HARNESS_MIGRATION.md.
2. Run node ../../scripts/audit-documentation.cjs --json from the repository root via the canonical path .incryptusos/scripts/audit-documentation.cjs.
3. Check real loading paths and references. Preserve root AGENTS.md, README.md and .github/workflows as minimal compatibility loaders when required.
4. Move only confirmed nonruntime files with git mv, repair every consumer and test original/new invocations.
5. Store old/new source mapping and child exit evidence under ../../audits/source-moves/; continue active product work.

Never automatically move executable runtime source or clean a dirty Owner worktree.
