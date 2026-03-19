# TOOLS.md — COO Tool Configuration

> Environment-specific settings for the COO. Update as you set up tools.

---

## acpx — Communicating with Claude Code

### Standard Command Template
```bash
acpx --approve-all --allowed-tools "Write,Bash,Read,Edit,MultiEdit,Glob,Grep,LS" claude exec "[TASK]"
```

### Permission Layers
| Layer | Flag | Purpose |
|-------|------|---------|
| L1: Approve all | `--approve-all` | Auto-approve all Claude Code actions |
| L2: Tool whitelist | `--allowed-tools "..."` | Restrict which tools Claude Code can use |
| L3: dontAsk | (inside prompt) | Tell Claude Code not to ask for confirmation |

### Important
- **Always include `--allowed-tools`**. Without it, Claude Code in dontAsk mode will refuse to write files.
- The standard whitelist `"Write,Bash,Read,Edit,MultiEdit,Glob,Grep,LS"` covers 99% of tasks.
- For tasks needing file deletion, add `MultiEdit` (already included).

---

## Project Directory Convention

```
ceo-project/
├── src/              # All source code
│   ├── types/        # TypeScript interfaces and types
│   ├── store/        # Data storage / database layer
│   ├── routes/       # API route definitions
│   ├── controllers/  # Business logic handlers
│   ├── middleware/    # Express middleware (auth, errors, etc.)
│   └── index.ts      # Entry point
├── tests/            # All test files
├── public/           # Static assets (if needed)
├── package.json
├── tsconfig.json
└── jest.config.js    # or vitest.config.ts
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Run tests | `npm test` |
| Type check | `npx tsc --noEmit` |
| Start server | `npm start` |
| Check dependencies | `npm audit` |
| Git status | `git status` |
| Git commit + push | `git add -A && git commit -m "msg" && git push` |

---

## Changelog

### v0.2 — After Chapter 2
- Added project directory convention (standardized from Control C acpx experiment)
- Added quick reference table
- Documented the `--allowed-tools` gotcha from Chapter 0

### v0.1 — After Chapter 0
- Initial acpx command template
- Discovered: without `--allowed-tools`, Claude Code refuses writes in dontAsk mode
