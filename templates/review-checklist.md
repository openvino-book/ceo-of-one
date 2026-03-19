# Review Checklist

> Every task MUST pass all items before reporting "done" to the CEO.
> This checklist evolves with each chapter — items are added when real bugs are caught.

---

## Pre-Delivery Checklist

### Build
- [ ] `npx tsc --noEmit` — zero compilation errors
- [ ] `npm run build` — builds successfully (if applicable)
- [ ] `npm install` — no missing dependencies

### Tests
- [ ] `npm test` — 100% pass rate, zero failures
- [ ] Tests cover all new endpoints/features
- [ ] Tests cover edge cases (empty input, invalid input, boundary values)

### Code Quality
- [ ] No `TODO`, `FIXME`, `HACK`, `XXX` comments
- [ ] No `console.log` / `console.debug` in production code
- [ ] No hardcoded secrets, API keys, or passwords
- [ ] No commented-out code blocks
- [ ] All TypeScript types/interfaces properly defined (no `any` without reason)

### Structure
- [ ] New files follow existing project directory conventions
- [ ] File names are clear and consistent (camelCase for files, PascalCase for components)
- [ ] Imports are organized (external → internal)
- [ ] Each file has a single responsibility

### Runtime
- [ ] `npm start` — app starts without crashing
- [ ] All API endpoints respond with correct HTTP status codes
- [ ] Error responses return structured JSON, not stack traces
- [ ] Input validation on all user-facing inputs

### Security
- [ ] No sensitive data in logs or error messages
- [ ] Input sanitized before use (prevent injection)
- [ ] No `eval()`, `innerHTML`, or equivalent dangerous patterns

---

## Chapter-Driven Evolution

Items marked with 🆕 were added from a specific chapter's real mistakes.

| Item | Added After | What Happened |
|------|------------|---------------|
| Tests cover edge cases | Ch1 | Control A had zero tests, shipped broken code |
| No `any` without reason | Ch1 | Claude Code sometimes takes shortcuts with `any` type |
| Input validation on all inputs | Ch1 | Control B caught missing validation during test phase |
| Error responses = JSON, not traces | Ch1 | Control A leaked stack traces in error responses |
| No hardcoded secrets | Ch2 | Noted as risk for future payment chapters (Ch6) |
| File names consistent | Ch2 | Control A/B chose `snake.html`, Control C used `index.html` — inconsistency |

---

## How to Use

When verifying a completed task, run each item. If ANY item fails:
1. Do NOT report "done" to the CEO
2. Fix the issue (or ask Claude Code to fix it)
3. Re-run the full checklist
4. Only report when ALL items pass
