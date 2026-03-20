<p align="left"><a href="experiment_zh-CN.md">简体中文</a></p>

# Chapter 3 Experiment: Adding Quality Checklists to the Snake Game

## Objective

Evaluate whether adding acceptance criteria / quality checklists before the build phase reduces post-build issues compared to the ad-hoc approach used in Chapter 2.

## Setup

| Item | Detail |
|---|---|
| **Base Task** | Build a Snake game with the same requirements as Chapter 2 |
| **COO Role** | OpenClaw (same model, same session) |
| **Engineer** | Claude Code (same configuration) |
| **Variable** | Acceptance criteria defined before build vs. none |
| **Tech Stack** | HTML + CSS + vanilla JavaScript |
| **Methodology** | Same prompt, same engineer — only difference is the checklist |

## Process

### Phase A: Build WITHOUT Checklist (Replay of Ch2)

1. CEO issued: "帮我做个贪吃蛇游戏" — no acceptance criteria
2. COO decomposed into basic requirements (grid, snake movement, food, score)
3. Engineer built the game
4. COO visually confirmed and accepted

### Phase B: Build WITH Checklist

1. CEO issued: "帮我做个贪吃蛇游戏" — identical request
2. COO decomposed into the same basic requirements
3. **NEW:** COO added 10 acceptance criteria before sending to engineer:
   - Build passes (zero errors in console)
   - Snake wraps at boundaries (specified behavior)
   - Score increments correctly
   - Game over triggers and resets cleanly
   - No TODO/FIXME/console.log in code
   - Layout works at 375px (mobile) and 1280px (desktop)
   - Food doesn't spawn on snake body
   - Game speed is playable (not too fast, not too slow)
   - Keyboard and touch controls both work
   - Page title and basic styling present
4. COO sent requirements + checklist to engineer
5. Engineer built the game
6. COO verified each criterion against the checklist

## Results

| Metric | Without Checklist (Ch2) | With Checklist (Ch3) |
|---|---|---|
| Build errors | 0 | 0 |
| Console warnings | 2 (unused variables) | 0 |
| TODO/FIXME comments | 3 | 0 |
| Mobile layout broken | Yes | No |
| Edge case (food on snake) | Not handled | Handled |
| COO re-requests needed | 1 (fix mobile) | 0 |
| Total iterations | 2 | 1 |
| COO time spent | ~8 min | ~6 min (less rework) |

## Key Insights

**1. The checklist forced the COO to think about quality upfront.** Writing "layout works at 375px" before the build started meant the engineer received that requirement from the beginning. In Ch2, it was discovered after the fact.

**2. No rework = faster total time.** Ch2 took 2 iterations (build → discover mobile broken → fix). Ch3 took 1 iteration. The 2-minute checklist saved 5 minutes of rework.

**3. "Not handled" edge cases are the most common bugs.** The food-on-snake-body issue is classic: the engineer didn't think of it because nobody told them to. The checklist item "food doesn't spawn on snake body" made it explicit. Engineer implemented it correctly on the first try.

**4. Console warnings are silent quality debt.** The 2 unused variable warnings in Ch2 weren't bugs — yet. They indicate the engineer left behind exploration code. The checklist item "no console warnings" caught them immediately.

**5. The checklist protects against COO laziness.** Without it, the COO's tendency is to glance at the result, say "looks good," and move on. The checklist forces a disciplined, systematic verification. It turns subjective "I think it's fine" into objective "10/10 criteria met."

## What This Proves

Acceptance criteria are not overhead. They are a time-saving tool. The 2 minutes spent writing the checklist reduced total build time by ~25% (from 8 min to 6 min) and eliminated all post-build rework.

For the CEO of One method, this is the quality control layer: **before you build, define what "done" means; after you build, verify against that definition.** Every chapter after this one follows this pattern.

## Retained Knowledge

- ✅ Always define acceptance criteria before SPECIFY step
- ✅ Include at least: build clean, no console warnings/errors, no TODO/FIXME, responsive check
- ✅ Verify each criterion individually — no "looks good overall"
- ✅ Checklist catches edge cases the engineer won't think of on their own
- ✅ No checklist = no standard = subjective acceptance = unreliable quality

---

⬅️ **Previous:** [Chapter 2: Snake Game](../02-snake-game/README.md) | [README](../../README.md) | **Next:** [Chapter 3: Quality Checklist](../03-quality-checklist/README.md) →
