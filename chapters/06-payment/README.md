<p align="left"><a href="README_zh-CN.md">简体中文</a></p>

# Chapter 6: Make Money

**Adding payments — the feature that turns a website into a business.**

> 📋 [Read the full experiment record](experiment.md)

---

## 🎯 You'll Learn

How to add a feature that **connects two existing modules** — authentication (who's buying) and courses (what they're buying) — into a new payment system. This is the first chapter where a new module isn't just self-contained; it has to *reach into* existing modules to do its job.

You'll also see what happens when complexity goes up: three bugs, all caught by the compiler, all fixed without a human ever seeing them.

## 🗣️ What the CEO Said

> 继续阶段八

Translation: "Continue phase 8."

Same pattern as before. One sentence. No specification, no technology choices, no acceptance criteria. The COO turned that into a full payment module with three API endpoints and eleven acceptance criteria — and one hard constraint: don't touch the existing code.

## 🔍 What Got Built

A payment system that lets logged-in users buy courses.

Here's how it works: a user hits "checkout" on a course, which creates a pending order. Then they "pay" (simulated — no real credit card, no real gateway), which flips the order to completed and adds the course to their enrollment list. After that, they can check what courses they've bought through an enrollment endpoint.

Three endpoints. Three distinct steps in a business transaction.

What makes this chapter different from the last two is that the payment module needs to know **who** the user is (from the auth module) and **what** the course costs (from the courses module). It reads data from both, but it never modifies either. The auth module doesn't know payments exist. The courses module doesn't know payments exist. The payment module knows about both, but only in one direction.

This is the one-way dependency rule: new features can look at existing features, but existing features never have to change to accommodate new ones.

## 🏗️ Three Bugs, Zero Panics

Here's something interesting: this chapter had three bugs, compared to one in the previous chapter. Is the code getting worse?

No. The code is doing more.

Payment is the first module that touches **two** existing modules instead of one. More integration points means more places where types have to line up across module boundaries. Every boundary is a potential mismatch, and TypeScript strict mode caught all three.

Bug one: accessing data on a result type without first checking which branch of a union it was. Bug two: TypeScript couldn't track types through a chained `.map().filter()` call. Bug three: a field typed as a generic `string` when it should have been the specific `Category` type from the courses module.

Three bugs. Three auto-fixes. The build caught them, the agent fixed them, and the CEO never knew. This is exactly what a type system is supposed to do — catch mistakes at the door, before they become runtime errors.

## 💡 The Pattern Holds

Let's look at the numbers:

- **Chapter 4** (refactor): 34 tests, 0 regressions
- **Chapter 5** (auth): 65 tests, 0 regressions, 1 bug
- **Chapter 6** (payment): 94 tests, 0 regressions, 3 bugs

Each chapter adds a full feature module. Each chapter's existing tests pass without modification. The test suite runs in 2.3 seconds. Zero performance concerns.

The modular architecture from Chapter 4 is now three features deep and still working exactly as designed. Features drop in, tests pass, nothing breaks.

## 🎓 Chapter Takeaway

Adding payments is where most side projects stall. You have users, you have content, but connecting "who's buying" to "what they're buying" to "did the money actually change hands" requires touching multiple parts of the system at once. In a tangled codebase, this is where regressions explode.

In this architecture, it was just another module.

The payment module reads from auth and courses but doesn't modify them. The one-way dependency rule means existing features never need to change when a new feature arrives. TypeScript catches the inevitable type mismatches at build time, not at 3 AM in production.

Three features. 94 tests. Zero regressions. One sentence from the CEO.

The system is working.

---

**Previous:** [Chapter 5: Let Users In](../05-auth/README.md) · **Next:** [Chapter 7](../07-fix-bugs/README.md) →
