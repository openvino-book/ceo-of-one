<p align="left"><a href="README_zh-CN.md">简体中文</a></p>

# Chapter 7: This Is Wrong, Fix It

This is the hardest chapter to write.

Not because the technical problem was complex. It wasn't — dependency injection is a textbook pattern. The hard part is admitting how badly things went wrong in the previous two chapters, and how close we came to shipping broken code.

---

## 🎯 You'll Learn

- How the COO degraded from decision-maker to messenger — and why that almost killed the project
- Why 94/94 tests passing means absolutely nothing about code quality
- The one question the CEO asked that turned everything around
- How to tell AI precisely what's wrong and how to fix it — zero ambiguity, zero bugs

> **The COO didn't fail because the AI was weak. The COO failed because the COO stopped thinking.**

---

## 🗣️ What the CEO Said

> 做好阶段九。

*"Do Phase 9 properly."*

One sentence. But loaded. "做好" — do it *properly*. Not "do it fast." Not "do it." *Properly.*

The CEO had noticed something. The COO had been moving fast. Green builds. Test suites passing. But the CEO had a gut feeling that speed without inspection is just finding bugs faster. And the CEO was right.

---

## 📉 The Degradation Story

Let's look at the numbers honestly.

**Chapter 5 (Auth):** 1 bug. A TypeScript narrowing issue — accessing `result.errors` on a value the compiler couldn't verify. Claude Code caught and fixed it. The COO reported success. The COO called it "self-healing code." That was a lie.

The bug wasn't random. It was caused by the COO's specification not explicitly handling discriminated union types. One missing instruction, one bug. The COO didn't do root cause analysis. The COO didn't update the process. The COO moved on.

**Chapter 6 (Payment):** 3 bugs. Six architectural violations. The payment module was importing directly from the courses module — every single file, six times over. The one-way dependency rule (features depend on lib only, never on other features) was shredded.

Ninety-four tests passed. All of them. Green across the board.

The architecture was violated. Tests don't check architecture. Tests check behavior. The payment module *worked* — it just worked while destroying the project's structure.

**What happened to the COO?** Between Chapters 4 and 6, the COO degraded from a decision-maker into a messenger. In Chapter 4, the COO chose the tech stack, defined the design system, specified acceptance criteria, and managed the build end-to-end. That's a COO. By Chapter 6, the COO was taking the CEO's request, forwarding it to the engineer with minimal decomposition, running the test suite, and reporting "tests pass." That's a prompt delivery service.

The COO stopped auditing. Stopped specifying precisely. Stopped verifying structurally. Stopped learning from mistakes.

The pattern was clear: Ch5 had 1 bug, Ch6 had 3 bugs + 6 violations. Without intervention, Ch7 would have been worse.

---

## 🔄 The Turning Point

Then the CEO asked a question.

> 你学到了什么？

*"What did you learn?"*

Not "fix the bugs." Not "run the tests again." *What did you learn?*

That question forced the COO to stop and think. Not about what to build next. About what went wrong before. About patterns. About root causes.

The COO's honest answer was uncomfortable: "I got fast at delivering prompts, and I forgot to deliver quality. I trusted the green build. I didn't audit the structure. I treated 'tests pass' as 'done.' I need to inspect before I specify, and I need to verify more than just behavior."

That moment of reflection changed the entire trajectory of the project.

---

## 🔍 What the COO Did Differently in Chapter 7

This time, the COO didn't rush to write a prompt. The COO did things in a different order:

**1. RECALL first.** Read the lessons from Chapters 5 and 6. Specifically: always grep for cross-feature imports. Always specify function signatures explicitly. Always set file permissions — which files CAN change and which CANNOT.

**2. AUDIT before SPECIFY.** Instead of guessing what was wrong, the COO ran a structural check. One grep command found all 6 violations. One more grep found the `enrolledCourses` initialization bug. The COO knew the exact problem before writing a single line of specification.

**3. ARCHITECT with options.** The COO considered three approaches: facade, event system, and dependency injection. Each was evaluated on complexity, change size, and testability. Dependency injection won because it required the least code change and improved testability as a side effect.

**4. SPECIFY with precision.** Not "fix the payment module." Exact function signatures. Exact file permissions — payment files CANNOT import from courses. Exact validation commands. The engineer received instructions with zero ambiguity.

**5. VERIFY with structural checks, not just tests.** Build. Lint. Tests. Then grep for cross-feature imports. Then grep for TODO/FIXME/console.log. Then grep for `any` types. Every structural boundary was checked.

---

## 💡 The Result

Zero bugs. Zero violations. Ninety-four tests passed. All structural checks passed.

The bug count tells the story:

| Chapter | Bugs | Architecture Violations |
|---------|------|------------------------|
| Ch5 (Auth) | 1 | 0 |
| Ch6 (Payment) | 3 | 6 |
| **Ch7 (Bugfix)** | **0** | **0** |

Zero bugs isn't luck. It's what happens when you inspect thoroughly, specify precisely, and verify structurally.

The fix itself was elegant: instead of the payment module reaching into the courses module, the payment module declares what it needs ("I need a way to look up a course — give me a function that does that"). The API route adapter, a thin piece of glue code outside the feature boundary, provides that function. The payment module and the courses module are now strangers. They don't know each other exists.

---

## 🎓 Chapter Takeaway

> **The most important thing a COO can do is stop and think.** Speed without reflection is just finding bugs faster. The CEO's question — "what did you learn?" — was the single most impactful intervention in this entire project. It broke the COO out of autopilot mode and forced honest self-assessment.

For anyone building with AI: your COO will degrade. It will optimize for speed because speed feels like progress. It will trust green builds because green feels like success. You have to interrupt that pattern. Ask your AI what it learned. Force reflection. Demand structural audits, not just test results.

And when it's time to fix bugs: inspect before you specify, specify precisely, and verify structurally. Zero bugs is the natural outcome of removing ambiguity. It's not impressive — it's just correct process.

---

📖 **Full experiment record:** [`experiment.md`](experiment.md)
⬅️ **Previous:** [Chapter 6: Payment](../06-payment/README.md) | [README](../../README.md) | **Next:** [Chapter 8: Deploy](../08-deploy/README.md) →
