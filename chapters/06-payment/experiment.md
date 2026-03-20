<p align="left"><a href="experiment_zh-CN.md">简体中文</a></p>

# Chapter 6 Experiment: Payment System

## Objective

Add a simulated payment system to the existing platform — checkout (create order), verify (complete payment), and enrollment tracking. Connect payment to auth (user identity) and courses (what they buy). This is the **third feature module** and the first that integrates data from *two* existing modules.

## Setup

- **Starting state:** Modular platform with courses (34 tests) + auth (31 tests) = 65 passing tests
- **Task:** Add payment module — checkout, payment verification, enrollment tracking
- **Constraint:** Zero modifications to `src/features/courses/` or `src/features/auth/`
- **Dependencies available:** Express, TypeScript, Jest, existing shared types, courseStore, authStore

## CEO Input

> 继续阶段八

One sentence. The COO decomposed this into a complete payment module specification with 3 API endpoints and 11 acceptance criteria.

## What Was Built

### Payment Module (`src/features/payment/`)
| File | Purpose |
|------|---------|
| `types.ts` | Payment-specific type definitions |
| `store.ts` | In-memory order store |
| `service.ts` | Business logic — checkout, verify, enrollment |
| `routes.ts` | Express routes with input validation |
| `payment.test.ts` | 29 tests covering all endpoints and edge cases |

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payments/checkout` | POST | Create an order for a course |
| `/api/payments/verify` | POST | Complete payment and enroll user |
| `/api/payments/enrollment` | GET | List courses the user is enrolled in |

### Shared Types Modified
Added `enrolledCourses` field to `AuthUser` in `src/lib/types/index.ts`.

### Dependency Pattern
Payment **reads** from `courseStore` (product data) and `authStore` (user identity) but **never modifies** them. This is the one-way dependency rule: payment → lib → courses/auth.

## Results

| Metric | Result |
|--------|--------|
| Build (`npm run build`) | ✅ Zero errors (3 type bugs auto-fixed) |
| Tests (`npm test`) | ✅ **94/94 passed** (34 courses + 31 auth + 29 payment) |
| Changes to `src/features/courses/` | ✅ **Zero** |
| Changes to `src/features/auth/` | ✅ **Zero** |
| TODO/FIXME/console.log | ✅ None |
| New files | 5 |
| New dependencies | 0 |
| Duration | ~15 minutes |
| CEO effort | 1 sentence |
| Bugs encountered | 3 (all auto-fixed) |

## Bug Log

**Bug 1 — Discriminated union access in `routes.ts`:**
- **Issue:** Accessing `result.enrolledCourses` without first checking the success/failure discriminator on the result type
- **Fix:** Added success check before accessing the field on the success branch of the union
- **Resolution:** Auto-fixed, rebuilt, tests passed

**Bug 2 — `.map().filter()` type narrowing in `service.ts`:**
- **Issue:** TypeScript couldn't narrow the type inside a chained `.map().filter()` call
- **Fix:** Split into two separate steps — map first, then filter with narrowed type
- **Resolution:** Auto-fixed, rebuilt, tests passed

**Bug 3 — `EnrolledCourse.category` type mismatch in `types.ts`:**
- **Issue:** `category` typed as `string` but should be the `Category` enum type from the courses module
- **Fix:** Imported `Category` type and used it in the `EnrolledCourse` definition
- **Resolution:** Auto-fixed, rebuilt, tests passed

## Key Insights

### 1. Cross-Module Integration Without Coupling
Payment reads from courseStore and authStore but doesn't modify them. The one-way dependency rule (payment → lib → courses/auth) holds. This is the first module that truly bridges two existing features, and the architecture handled it cleanly.

### 2. TypeScript Strict Mode Catches Real Bugs
All 3 bugs were type mismatches that would have caused runtime errors. The build step is essential — these are exactly the kinds of bugs that slip through in JavaScript projects.

### 3. More Integration Points = More Type Friction
3 bugs vs. 1 bug in Chapter 5. Payment is more complex because it touches two other modules (auth for user identity, courses for product data). More boundaries = more surface area for type mismatches.

### 4. 94 Tests, 2.3 Seconds
The test suite is still fast. No performance concerns. Each module adds its own tests without slowing down the whole.

### 5. The Pattern Is Proven
Third feature module, zero regressions. Modular architecture delivers on its promise.

## COO Acceptance Criteria (11/11 Met)

1. ✅ Users can initiate checkout for a course
2. ✅ Checkout creates an order record with pending status
3. ✅ Payment verification completes the order
4. ✅ Successful payment adds course to user's enrolled courses
5. ✅ Enrollment endpoint returns list of user's courses
6. ✅ Cannot enroll in already-enrolled course
7. ✅ Cannot pay for non-existent course
8. ✅ Cannot checkout without authentication
9. ✅ All endpoints return proper HTTP status codes
10. ✅ Error responses follow consistent format
11. ✅ No modifications to courses or auth modules

## Conclusion

The first cross-module feature landed without regressions. Payment touches both auth and courses but modifies neither. Three bugs were caught and fixed by the build process — none reached the CEO. 94 tests pass. The modular architecture continues to scale.
