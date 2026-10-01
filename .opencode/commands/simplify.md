---
description: Simplify code without changing behaviour (tests must stay green)
---

Simplify $ARGUMENTS (or the files just discussed) without changing behaviour.

Rules:
- Keep the public behaviour and the tests green.
- Do not add dependencies.
- Do not introduce abstractions that do not pay off — no pattern religion. Prefer deleting
  code over moving it around.
- Name things for what they are; keep the existing style.

After the change, run and report:
`npm run lint && npm run typecheck && npm test && npm run build`

Then explain, in a few lines, what you removed or merged and why.
