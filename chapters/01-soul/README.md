# 🧠 Give AI a Top-Tier COO Brain

<p align="left">
  <a href="README_zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳-中文版-blue" alt="中文版" /></a>
</p>

## 🎯 You'll Get This

An AI that thinks like a COO — it plans, builds, tests, and self-verifies before reporting back to you.

---

## 📖 The Story

Meet Sam. Sam runs two experiments:

**Experiment 1:** Sam tells AI "Build me a Todo API." AI writes some code and says "Done!" Sam tries it — half the features are missing, no error handling, and when Sam sends bad data, the server crashes.

**Experiment 2:** Sam tells AI the same thing, but this time AI has a "COO brain" — it writes code, runs tests, finds a bug, fixes it, and only then says "Done. All 24 tests pass."

Same task. Same AI. Wildly different results.

The difference? Sam gave the AI a **soul** — a set of instructions that defines how it should think and work.

---

## 🗣️ What You'll Say

In Chapter 0, you typed a bare command and AI did something. Now you'll give AI a **system prompt** that transforms it from a code monkey into a COO.

You'll add this to your command:

```
acpx --approve-all --allowed-tools "Write,Bash,Read,Edit,MultiEdit,Glob,Grep,LS" claude exec "
You are building a product, not just writing code. Follow these rules:

## Product Thinking
- Consider the user: what would break? what edge cases exist?
- Build for production: proper error handling, input validation

## Quality Standards
- Write automated tests for everything
- Run tests after writing code. If tests fail, fix them before finishing.
- TypeScript must compile with zero errors.

## Delivery
- Report what you built, how many tests pass, and any issues found.

Now, build a Todo REST API with Express and TypeScript.
"
```

## 🔍 Why This Works

We tested this with a controlled experiment. Same task, two different instructions:

| | Bare Instruction (Empty Soul) | COO Instruction (COO Soul) |
|--|------------------------------|----------------------------|
| Tests | ❌ None | ✅ 24/24 passed |
| Error handling | ❌ Minimal | ✅ 400/404/500 |
| Input validation | ❌ None | ✅ Full |
| Self-verification | ❌ Finished immediately | ✅ Found & fixed a bug |
| Soft delete | ❌ No | ✅ Yes |

**The COO instruction produced 460 more lines (including tests), caught a bug, and delivered production-quality code — from the same AI.**

See the full experiment: [experiments/01-soul-comparison/](../../experiments/01-soul-comparison/)

---

## The COO Soul Template

Here's the template. Save it. Use it for every task.

```
You are building a product, not just writing code. Follow these rules:

## Product Thinking
- Consider the user: what would break? what edge cases exist?
- Build for production: proper error handling, input validation

## Quality Standards
- Write automated tests for everything you build
- Run tests after writing code. If tests fail, fix them before finishing.
- Your code must compile/build with zero errors.

## Delivery
- Report what you built, how many tests pass, and any issues found.
- If something is unclear or risky, tell me before proceeding.

YOUR TASK HERE
```

### What Each Section Does

| Section | Purpose | Analogy |
|---------|---------|---------|
| Product Thinking | Makes AI think about users, not just code | CEO says "think about the customer" |
| Quality Standards | Forces self-verification | QA department says "test everything" |
| Delivery | Creates accountability | COO says "report results, not intentions" |

---

## ⚠️ Pitfall #1: "Just Tell It What to Do"

The most common mistake: skipping the soul and going straight to the task.

```
❌ "Build me a blog with user authentication"
```

This gets you code that might work. Maybe. Probably with bugs. No tests. No verification.

```
✅ [COO soul template] + "Build me a blog with user authentication"
```

This gets you tested, verified, production-quality code. Because the AI knows **what quality means** before it starts.

## ⚠️ Pitfall #2: The Soul Is Too Vague

```
❌ "Do a good job and test your work"
```

Too vague. AI will interpret "good" however it wants.

```
✅ "Write Jest tests covering all endpoints. Run npm test. All tests must pass."
```

Specific. Measurable. The AI knows exactly what "good" means.

---

## 💰 Cost Estimate

The COO instruction costs about 2-3x more in API tokens because the AI writes tests, runs them, and potentially fixes bugs.

| Approach | Estimated Cost | Quality |
|----------|---------------|---------|
| Bare instruction | ~$0.05 | 🟡 Might work |
| COO instruction | ~$0.15 | 🟢 Tested & verified |

**$0.10 more to go from "might work" to "tested and verified."** Worth it.

---

## 📝 Talk Template

Use this format for every command from now on:

```
acpx --approve-all --allowed-tools "Write,Bash,Read,Edit,MultiEdit,Glob,Grep,LS" claude exec "
[Copy the COO soul template here]

YOUR SPECIFIC TASK HERE
"
```

---

## ➡️ Next: [🎯 Chapter 2 — Build a Snake game with one sentence](../02-snake-game/)

Now your AI thinks like a COO. In Chapter 2, you'll test your new power by building a playable Snake game — with just one sentence.
