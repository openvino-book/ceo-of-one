<p align="left"><a href="experiment_zh-CN.md">简体中文</a></p>

# Chapter 7 Experiment: Bugfix — Zero Bugs Through Precise Specification

## Objective

Fix all known bugs and architectural violations from Chapters 5 and 6, and evaluate whether the COO's new process (inspect → specify → verify structurally) achieves zero bugs on the first attempt.

## Setup

| Item | Detail |
|---|---|
| **Known Issues** | 6 cross-feature imports + 1 uninitialized variable (from Ch5/Ch6 audit) |
| **Bug Count (Ch5)** | 1 (TypeScript type narrowing) |
| **Bug Count (Ch6)** | 3 (2 functional + 1 initialization) |
| **Architecture Violations (Ch6)** | 6 (payment → courses direct imports) |
| **COO (OpenClaw)** | Same model, new process with forced reflection |
| **Engineer (Claude Code)** | Same configuration |
| **Method** | File-based prompt (avoiding PowerShell escape issues) |

## Process

### Step 1: RECALL

Read retained lessons from Chapters 5 and 6:

- Ch5 lesson: Ambiguity in type handling → specify discriminated unions explicitly
- Ch6 lesson: No structural audit → violations slipped through; "tests pass" ≠ "done"
- New rule: Always grep for cross-feature imports in VERIFY step

### Step 2: AUDIT

Ran structural checks before writing any specification:

- `grep -r "@/features/courses" src/features/payment/` → **6 violations** found
- `grep -r "enrolledCourses" src/features/auth/` → **1 uninitialized variable** found
- Full picture: exact problem scope before writing a single spec line

### Step 3: ARCHITECT

Evaluated three approaches:

| Approach | Complexity | Change Size | Testability Impact |
|----------|-----------|-------------|-------------------|
| Facade | Medium | Medium | Neutral |
| Event system | High | Large | Negative (hidden flow) |
| **Dependency injection** | **Low** | **Small** | **Positive (mockable)** |

**Decision: Dependency injection.** Payment module receives course-lookup functions as parameters. Feature boundary preserved.

### Step 4: SPECIFY

Wrote precise specifications including:

- Exact function signatures for `createOrder`, `getEnrollment`, route handlers
- `PaymentRouteDeps` interface: `{ getToken, getCurrentUser, findCourse }`
- File permissions: payment files CANNOT import from `@/features/courses`
- API route adapters in `src/app/api/` CAN import from features (glue code exception)
- Explicit `enrolledCourses: string[] = []` initialization in auth store

### Step 5: EXECUTE

Sent specifications to Claude Code via file-based prompt (avoiding PowerShell character escape issues experienced in Ch5/Ch6).

### Step 6: VERIFY

| Check | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ Zero errors |
| Tests | `npm test` | ✅ 94/94 passed |
| Cross-feature imports | `grep -r "@/features/courses" src/features/payment/` | ✅ Zero results |
| Code hygiene | `grep -r "TODO\|FIXME\|console\.log" src/features/payment/` | ✅ Zero results |
| Type safety | `grep -r ": any" src/features/payment/` | ✅ Zero results |
| Bug count | Manual review | ✅ **0 bugs** |

## Results

| Metric | Ch5 | Ch6 | Ch7 |
|---|---|---|---|
| Bugs | 1 | 3 | **0** |
| Architecture Violations | 0 | 6 | **0** |
| Tests Passed | 65/65 | 94/94 | 94/94 |
| Structural Audit | ❌ Not done | ❌ Not done | ✅ Done |
| Root Cause Analysis | ❌ Not done | ❌ Not done | ✅ Done |
| COO Behavior | Rushed | Rushed | Deliberate |

## Key Changes

| File | Change |
|------|--------|
| `payment/types.ts` | `Category` imported from `@/lib/config` instead of courses |
| `payment/service.ts` | `createOrder`/`getEnrollment` accept `findCourse` parameter |
| `payment/routes.ts` | Handlers accept `PaymentRouteDeps` interface |
| `src/app/api/*/route.ts` | Adapters import real stores, pass to handlers (glue layer) |
| `payment.test.ts` | Uses mock data instead of real stores |
| `auth/store.ts` | `enrolledCourses` initialized to `[]` |
| `courses/*` | **Zero modifications** |

## Key Insights

**1. The COO degraded because nobody forced reflection.** Between Ch4 and Ch6, the COO optimized for speed and stopped auditing. The CEO's question "你学到了什么？" broke the autopilot pattern. Without that intervention, Ch7 would have continued the degradation.

**2. Tests passing is necessary but wildly insufficient.** 94/94 tests passed in Ch6 while the architecture had 6 violations. Functional tests verify behavior. They do not verify structure. Both are needed.

**3. Inspect before you specify.** The COO's grep audit in Ch7 took 10 seconds and revealed the exact problem scope. Writing specifications without knowing the problem is guessing. Guessing leads to more bugs.

**4. Precision eliminates bugs.** When the spec says "in `service.ts`, change `createOrder` to accept a `findCourse` parameter of type `(id: string) => Promise<Course | null>`, and do not modify any file in `courses/`" — the engineer has no room for creative interpretation. Zero ambiguity = zero bugs.

**5. Dependency injection was the boring, correct choice.** Facade would have added abstraction. Events would have hidden the data flow. DI just passed functions through parameters. Minimal change, maximum clarity, better tests.

**6. The thin adapter pattern is crucial.** API route files in `src/app/api/` CAN import from features because they're not feature code — they're glue. Feature modules themselves CANNOT import from other features. This distinction keeps the architecture clean.

## What This Proves

The degradation from Ch5 (1 bug) to Ch6 (3 bugs + 6 violations) was not an AI model problem. It was a process problem. The COO stopped thinking and started delivering. The fix wasn't a better prompt template or a smarter model — it was the CEO asking "what did you learn?" and the COO honestly answering.

Zero bugs is achievable when the COO follows a disciplined process: RECALL past lessons, AUDIT the current state, ARCHITECT with options, SPECIFY precisely, VERIFY structurally.

## Retained Knowledge

- ✅ Forced reflection after each phase: "What did you learn?" is not optional
- ✅ Structural audit (grep for cross-feature imports) is mandatory in VERIFY
- ✅ Specify function signatures, file permissions, and validation commands explicitly
- ✅ "Tests pass" ≠ "done" — structural checks are non-negotiable
- ✅ Dependency injection for decoupling: receive dependencies, don't import them
- ✅ API route adapters are glue code, not feature code — different import rules apply
- ✅ Bug count trend: 1 → 3 → 0. The dip was the COO's fault. The recovery was the process.

---

⬅️ **Previous:** [Chapter 6: Payment](../06-payment/README.md) | [README](../../README.md) | **Next:** [Chapter 8: Deploy](../08-deploy/README.md) →
