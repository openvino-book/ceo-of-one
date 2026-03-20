<p align="left"><a href="README_zh-CN.md">简体中文</a></p>

# Chapter 3: Make AI Check Its Own Work

The snake game worked. The CEO was happy. The COO was proud.

Then someone asked: "How do you know it's actually done?"

Silence.

---

## 🎯 You'll Learn

- Why "it works" and "it's done" are completely different things
- How to write acceptance criteria that even an AI can evaluate objectively
- The quality checklist that turned a happy demo into a trustworthy deliverable

> **The most dangerous phrase in AI-assisted development is "it looks good to me."** Because "me" is biased. "Me" wants to believe it works. You need checks that don't care about your feelings.

---

## 🗣️ What the CEO Said

> 帮我做个贪吃蛇游戏。

*"Make me a Snake game."*

Simple. Vague. Delivered. The game ran. Arrows moved the snake. Food appeared. Score counted. By every human eyeball test, this was done.

But the COO knew better. Or should have.

---

## 🏗️ The Problem with "Looks Good"

When you build something with AI and it works when you click through it, you feel great. The snake moves. The page loads. The button does something. You show your friend. They say "cool." Ship it.

Then the first real user opens it on their phone and the layout is broken. Or someone resizes the window and everything overlaps. Or they click fast and the game crashes because two pieces of food spawn on the same spot.

These aren't edge cases. They're predictable problems that a checklist would have caught in 30 seconds. The COO didn't have a checklist.

Chapter 2 built the snake game without acceptance criteria. Chapter 3 is about not making that mistake again.

---

## 🔍 What the COO Should Have Done

Here's the quality control layer that should have been part of every build from the start:

**1. Define "done" before you start.** Before the engineer writes a single line, write down what "done" means. Not "it works" — that's subjective. Write things you can verify with a yes or no answer. Does the build pass? Does the snake wrap around the edges? Does the score persist after game over? Does the layout work on a phone screen? Each of these is a binary check: pass or fail.

**2. Give the checklist to the engineer.** The engineer needs to know what they're aiming for. If you say "make a snake game," you get a snake game that the engineer thinks is good enough. If you say "make a snake game, and here are the 8 things I will check before accepting it," you get a snake game that actually passes all 8 checks.

**3. Verify with the checklist, not your eyes.** After the engineer builds, run every item on the checklist. Don't browse the result and say "looks fine." Run the build command. Run the linter. Check for console errors. Open it on your phone. The checklist doesn't have opinions. It has checkboxes.

**4. No item, no acceptance.** If something isn't on the checklist, it's not required. If it is on the checklist, it's not optional. This prevents two failure modes: the COO accepting work that isn't good enough (because they didn't define "good enough"), and the COO moving the goalposts after the fact (because they keep thinking of new requirements).

---

## 📋 What a Real Quality Checklist Looks Like

For the snake game, a proper checklist would include:

- Build passes with zero errors
- No console warnings or errors
- No placeholder text anywhere
- Snake wraps or dies at walls (pick one, specify it)
- Score displays correctly
- Game over triggers properly and resets cleanly
- Layout works at both mobile and desktop widths
- No TODO or FIXME comments left behind
- Touch controls work on mobile (if applicable)

That's not a lot. It takes 30 seconds to write. It would have caught every problem that Chapter 2 swept under the rug.

---

## 💡 The Bigger Insight

Acceptance criteria aren't about being picky. They're about making the conversation between CEO, COO, and engineer **objective** instead of subjective.

Without criteria, the COO says "looks good" and sends it to the CEO, who says "looks good" and ships it. Two people's opinions. Zero data points.

With criteria, the COO runs 10 checks, 10 pass, and reports: "10/10 acceptance criteria met. Ready for review." The CEO doesn't have to trust the COO's judgment. The CEO trusts the checklist.

This is especially important with AI engineers. An AI will always try to deliver something that seems complete. It'll leave TODOs, skip edge cases, and make assumptions that feel reasonable but aren't what you wanted. The checklist is your defense against reasonable-looking incompleteness.

---

## 🎓 Chapter Takeaway

> **Define "done" before you start. Verify with a checklist, not your feelings.** Quality isn't about being demanding — it's about being specific. The moment you write acceptance criteria, you've already improved your output. Because now everyone — CEO, COO, and engineer — agrees on what "good" means.

The quality checklist is the cheapest, highest-ROI tool in the CEO of One toolkit. It costs almost nothing to create, takes seconds to verify, and prevents the entire class of problems where "it works" turns into "it works... sometimes."

---

📖 **Hands-on:** See the full experiment breakdown in [`experiment.md`](experiment.md)
⬅️ **Previous:** [Chapter 2: Snake Game](../02-snake-game/README.md) | [README](../../README.md) | **Next:** [Chapter 3: Quality Checklist](../03-quality-checklist/README.md) →
