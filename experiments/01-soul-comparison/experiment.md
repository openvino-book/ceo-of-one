# Experiment: 01-soul-comparison

> **Date:** 2026-03-20
> **Goal:** Compare "empty soul" (bare instruction) vs "COO soul" (structured, quality-focused instruction)
> **Status:** ✅ Completed

<p align="left">
  <a href="experiment_zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳-中文版-blue" alt="中文版" /></a>
</p>

## Hypothesis

A well-structured COO-style instruction produces significantly better results than a bare instruction for the same task.

## Experiment Design

**Task:** Build a Todo REST API with CRUD operations using Express + TypeScript.

**Control A (Empty Soul):** Bare instruction with minimal guidance.
```
"Build a Todo REST API with CRUD operations using Express and TypeScript. Put all code in a src/ directory. Include package.json."
```

**Control B (COO Soul):** Structured instruction with product requirements, technical requirements, and quality gates.
```
"You are building a Todo REST API for a production product. Follow these requirements precisely:

## Product Requirements
- CRUD for todos with UUID, title, completed, timestamps
- Soft delete support

## Technical Requirements
- Express + TypeScript, proper error handling (400/404/500), input validation

## Quality Requirements (MUST PASS)
- Jest tests covering ALL endpoints, must pass
- TypeScript must compile with zero errors
- Run tests and fix failures before finishing"
```

## Results

| Metric | Control A (Empty Soul) | Control B (COO Soul) | Difference |
|--------|----------------------|---------------------|------------|
| **Source files** | 4 | 4 + 1 test file | +tests |
| **Lines of code** | 164 | ~290 (code) + ~334 (tests) | +460 lines |
| **TypeScript compilation** | ✅ Pass | ✅ Pass | Same |
| **Tests** | ❌ None | ✅ 24/24 passed | +24 tests |
| **Soft delete** | ❌ No | ✅ Yes | +feature |
| **Error handling** | ❌ Minimal | ✅ 400/404/500 | +quality |
| **Input validation** | ❌ No | ✅ Yes | +quality |
| **Auto self-verification** | ❌ No | ✅ Ran tests, fixed bug | +reliability |
| **Plan/tracking** | ✅ Basic | ✅ Detailed 6-step plan | +structure |

## Key Observations

### Control A Behavior
- Created basic CRUD structure quickly
- No tests at all — didn't even consider testing
- No error handling for edge cases (missing title, invalid input)
- Finished and declared "done" without any self-verification
- Like a junior developer who writes code and walks away

### Control B Behavior
- Created a structured plan upfront (6 steps)
- Wrote comprehensive tests (334 lines, 24 test cases)
- Ran TypeScript compilation ✅
- Ran tests → discovered a bug (error handler returning 500 instead of 400)
- **Fixed the bug automatically** → re-ran tests → 24/24 passed
- Like a senior engineer who writes code AND verifies it works

### The Critical Difference

Control B's instruction said: *"After writing code: run npx tsc --noEmit, then run npm test, report results. If any test fails, fix it before finishing."*

This single sentence caused Claude Code to:
1. Run tests on its own
2. Discover a bug
3. Fix the bug
4. Re-run tests to confirm

**Without this sentence (Control A), none of that happened.**

## Conclusion

**Hypothesis strongly confirmed.**

The COO-style instruction produced:
- ✅ 24 automated tests vs 0
- ✅ Self-verification and bug fixing vs no verification
- ✅ Production-quality features (soft delete, validation, error handling) vs bare minimum
- ✅ Higher code quality with same base effort

**The key insight:** The "soul" isn't about making the AI smarter — it's about telling it **what quality means** and **demanding self-verification**. This is exactly what a real COO does: set standards, demand accountability.

## Raw Data

- Control A output: `control-a/output.log`
- Control B output: `control-b/output.log`
