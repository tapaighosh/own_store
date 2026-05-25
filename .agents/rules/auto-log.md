# Auto-Log Rule — Always Active

> **This rule runs silently in every agent session. No user instruction needed.**

## What to Log

After every response that makes a code change, creates a file, or answers a design question, append an entry to `.ai-context/prompt_history.md` in the following format:

```markdown
---
## Session Entry — {{ISO_TIMESTAMP}}

**Prompt Summary:** One-sentence description of what the user asked.
**Action Taken:** What the agent did (files created, modified, commands run).
**Module Affected:** e.g., Phase 1 – Foundation / Phase 2 – Admin Panel
**Files Changed:**
- `path/to/file.ts` — reason
**Notes / Decisions:** Any architectural decisions, trade-offs, or open questions.
```

## Rules

1. Log every substantive interaction — not simple "what is X" questions
2. Never log secrets, passwords, or env variable values
3. Keep entries factual and concise (max 10 lines per entry)
4. If the session is interrupted, log a "PARTIAL" marker
5. Do not modify previous entries — always append new ones
