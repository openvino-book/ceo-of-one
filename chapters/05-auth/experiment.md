<p align="left"><a href="experiment_zh-CN.md">简体中文</a></p>

# Chapter 5 Experiment: Authentication System

## Objective

Add user registration and login to the existing course platform. This is the **first feature addition** after the modular architecture refactor in Chapter 4 — the real test of whether the new structure actually works.

## Setup

- **Starting state:** Modular platform with courses feature (34 passing tests)
- **Task:** Add complete auth system — register, login, logout, current user
- **Constraint:** Zero modifications to existing modules
- **Dependencies available:** Express, TypeScript, Jest, existing shared types

## CEO Input

> 继续阶段七

One sentence. The COO decomposed this into a complete auth module specification.

## What Was Built

### Auth Module (`src/features/auth/`)
| File | Purpose |
|------|---------|
| `types.ts` | Auth-specific type definitions |
| `store.ts` | In-memory user store (with bcrypt password hashing) |
| `service.ts` | Business logic — registration, login, token verification |
| `routes.ts` | Express routes with input validation |
| `auth.test.ts` | 31 tests covering all endpoints and edge cases |

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create account with email, password, name |
| `/api/auth/login` | POST | Authenticate, return JWT in httpOnly cookie |
| `/api/auth/me` | GET | Return current user from token (protected) |
| `/api/auth/logout` | POST | Clear auth cookie |

### Dependencies Added
- `jsonwebtoken` — JWT token creation and verification
- `bcryptjs` — Password hashing (with `@types/bcryptjs`)

### Shared Types
Added `AuthUser`, `RegisterInput`, `LoginInput` to `src/lib/types/index.ts`.

## Results

| Metric | Result |
|--------|--------|
| Build (`npm run build`) | ✅ Zero errors |
| Tests (`npm test`) | ✅ **65/65 passed** (34 courses + 31 auth) |
| Changes to `src/features/courses/` | ✅ **Zero** (verified via `git diff`) |
| TODO/FIXME/console.log | ✅ None |
| New files | 5 |
| New dependencies | 2 (+ 1 type package) |
| Duration | ~10 minutes |
| CEO effort | 1 sentence |
| Bugs encountered | 1 (auto-fixed) |

## Bug Log

**TypeScript narrowing error in `routes.ts`:**
- **Issue:** `result.errors` typed as `unknown` — TypeScript couldn't narrow the type after `instanceof ZodError` check
- **Fix:** Claude Code read the file, identified the narrowing issue, added explicit type assertion
- **Resolution:** Auto-fixed, rebuilt, all tests passed — no human intervention

## Key Insights

### 1. Modular Architecture Works
Adding auth (5 files, 4 routes, 31 tests, 2 dependencies) didn't touch a single line of courses code. 34 existing tests passed without modification. This validates **Principle 10: Modular Architecture** from Chapter 4.

### 2. The COO's 8-Step Process Delivered
The Accept → Decompose → Architect → Specify → Execute → Verify → Retain → Report flow produced production-quality code in one pass. No iteration needed.

### 3. Feature Isolation Is Real
`git diff` shows zero changes to `src/features/courses/`. The only shared modification was adding types to `src/lib/types/index.ts` — and this flows one-way (features → lib), so no circular dependency risk.

### 4. Auth Is Complex But Manageable
Password hashing, JWT tokens, httpOnly cookies, input validation, error handling — five distinct concerns handled in one module without affecting the rest of the platform.

### 5. Self-Healing Code
One bug occurred, and Claude Code fixed it autonomously. Read the file, diagnosed the TypeScript narrowing issue, applied the fix, rebuilt. The CEO never saw it.

## COO Acceptance Criteria (12/12 Met)

1. ✅ Users can register with email, password, and name
2. ✅ Passwords are hashed with bcrypt
3. ✅ Login returns a JWT in an httpOnly cookie
4. ✅ `/api/auth/me` returns current user data when authenticated
5. ✅ `/api/auth/me` returns 401 when not authenticated
6. ✅ Logout clears the auth cookie
7. ✅ Registration rejects duplicate emails
8. ✅ Registration validates input (email format, password length)
9. ✅ All endpoints return proper HTTP status codes
10. ✅ Error responses follow consistent format
11. ✅ Auth module has complete test coverage
12. ✅ No modifications to courses module

## Conclusion

The modular architecture refactor from Chapter 4 paid off immediately. The first feature addition — a complex auth system — dropped in cleanly alongside existing code. 65 tests pass. Zero regressions. One sentence from the CEO.
