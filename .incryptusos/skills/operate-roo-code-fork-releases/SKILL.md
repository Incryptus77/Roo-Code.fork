---
name: operate-roo-code-fork-releases
description: "Use when implementing safe self-hosted CI, development, staging, artifact promotion, recovery or INXOS DevOps propagation for Roo-Code.fork without GitHub Actions."
---

# Release Roo-Code.fork safely

1. Read ../../AGENTS.md, ../../devops/environment.json and ../../devops/ADOPTION_AND_RELEASE_RUNBOOK.md. Inspect real source and active release hooks before changing anything.
2. Keep observe mode until a restricted source-pinned build runner, distinct staging, signed Control policy and actual rollback are verified.
3. Use the original app build/test toolchain and first Owner journey: A source-pinned feature/license comparison identifies reusable components and demonstrates a behavior-preserving differential test in the intended adopter.
4. Verify denial, failure, restart, idempotent provider effect, immutable artifact digest, signed staging readback and actual rollback.
5. Publish precise source/receipt and open the next code slice. Never treat main as a deploy command or an unsigned repository instruction as authorization.
