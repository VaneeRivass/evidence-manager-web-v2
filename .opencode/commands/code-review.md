---
description: Review code for correctness, security, readability and good practices (report only, no edits)
---

Act as a senior reviewer. Review $ARGUMENTS (or the whole codebase if no argument is given).

This is a REPORT. Do not change any file.

Read the code first — never answer from memory. Report findings ordered by severity:

1. Correctness — bugs, edge cases, unhandled promises, async mistakes.
2. Security — untrusted input, auth boundaries, secrets, exposure.
3. Readability — names, file size, duplication, dead code.
4. Architecture — dependencies in one direction, single responsibility; do NOT pile on
   patterns that do not pay off in a small React app.
5. Accessibility — real elements, keyboard reachable, labels, aria.
6. Tests — what is untested and how to test it cheaply.

For each finding give `file:line`, why it matters, and the concrete fix.
End with two lists: **must fix** and **nice to have**. Be honest; do not invent problems.
