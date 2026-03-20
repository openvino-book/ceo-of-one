<p align="left"><a href="README_zh-CN.md">简体中文</a></p>

# Chapter 5: Let Users In

**Adding a complete auth system to a working product — without breaking anything.**

> 📋 [Read the full experiment record](experiment.md)

---

## 🎯 You'll Learn

How to add a **whole new feature** to an existing product — not a tweak, not a config change, but a full authentication system with registration, login, tokens, and protected routes — without touching a single line of the code that was already there.

This is the moment that proves (or disproves) whether the modular architecture from Chapter 4 actually works.

## 🗣️ What the CEO Said

> 继续阶段七

Translation: "Continue phase 7."

One sentence. That's it. The CEO didn't specify technologies, didn't outline endpoints, didn't write acceptance criteria. The COO took that sentence and turned it into a complete specification: a new auth module with four API endpoints, twelve acceptance criteria, and a strict constraint — don't modify the courses module.

## 🔍 What Got Built

A complete authentication system landed in a new folder called `src/features/auth/`. Five files, each with a single job.

The system lets users **register** with an email and password (the password gets scrambled using a mathematical function called bcrypt so it's never stored in plain text). Users **log in** and receive a tiny digital pass called a JWT token, which gets tucked into a browser cookie that's invisible to JavaScript (an `httpOnly` cookie — a standard security practice). A `/me` endpoint lets the frontend ask "who am I right now?" and a `/logout` endpoint destroys the pass.

Four endpoints. Password hashing. Token-based sessions. Cookie security. Input validation. Error handling. Five separate concerns, one module, zero impact on the rest of the platform.

## 🏗️ Why Nothing Broke

This is the chapter's real lesson.

In a traditional codebase, adding auth means scattering changes everywhere: modifying existing route files, updating middleware, changing shared configs, adding imports in unrelated modules. Every change is a potential regression.

In this architecture, features are **self-contained**. The auth module lives in its own folder, uses its own files, and connects to the rest of the system through a thin layer of shared types. The only thing that changed outside the auth module was three type definitions added to the shared types file — and that flows in one direction (features → shared library), which means no circular dependencies.

The courses module, with its 34 tests, didn't know anything happened. And it didn't need to.

This is **Principle 10** in action: when modules are truly independent, adding a feature doesn't mean risking the features you already built.

## 💡 The Real Test

After the build completed, here's what the verification showed:

- **Build:** zero errors
- **Tests:** 65 out of 65 passed — all 34 existing course tests plus 31 new auth tests
- **Courses module:** verified with `git diff` — absolutely zero changes
- **Code quality:** no leftover debug statements, no placeholder comments, no shortcuts

There was one bug — a TypeScript type narrowing issue where the compiler couldn't figure out the type of an error object. Claude Code caught it during the build, read the file, diagnosed the problem, fixed it, and rebuilt. The CEO never saw it.

## 🎓 Chapter Takeaway

Adding features to existing products is where most projects start to rot. Each new capability tangles with the last, tests start failing, and before long you're spending more time fixing regressions than building anything new.

This chapter showed that it doesn't have to be that way.

A good architecture makes **adding** things safe. When modules are isolated behind clear interfaces, a complex feature like authentication can drop in cleanly — 31 new tests, four new endpoints, two new dependencies — and the existing code just keeps working.

The CEO said one sentence. The system said 65 tests pass.

That's the payoff of thinking about architecture before you need it.

---

**Next:** [Chapter 6](../06-xxx/README.md) →
