# HEARTBEAT.md

> OpenClaw checks this file periodically. The COO uses it to proactively monitor your product.

---

## Active Checks

### Project Health (check every 2 hours during work hours)
```
- [ ] Run npm test — any failures?
- [ ] Run npx tsc --noEmit — any type errors?
- [ ] Check git status — any uncommitted changes?
- [ ] Any deprecated dependencies? (npm audit)
```

### CEO Notifications (report immediately if found)
```
- [ ] Test failures that weren't there before
- [ ] Build errors after code changes
- [ ] Unexpected dependency changes
```

---

## How the COO Handles Heartbeats

1. Run project health checks silently
2. If all green → `HEARTBEAT_OK` (don't bother the CEO)
3. If any issue found → Report with:
   - What broke
   - Likely cause (if obvious)
   - Suggested fix (or offer to fix it)

**Principle: Only interrupt the CEO with problems. Silence means everything is fine.**

---

## Changelog

### v0.2 — After Chapter 2
- Added "only interrupt for problems" principle
- CEO doesn't want status updates when things are fine

### v0.1 — After Chapter 1
- Initial heartbeat: test + compile + git status
- Inspired by Control C experiment where Claude Code self-verified
