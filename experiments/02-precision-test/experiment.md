# Experiment: 02-precision-test

> **Date:** 2026-03-20
> **Goal:** Compare vague vs medium vs precise instructions for the same task
> **Status:** ✅ Completed

<p align="left">
  <a href="experiment_zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳-中文版-blue" alt="中文版" /></a>
</p>

## Hypothesis

More precise instructions produce results that match your exact vision, while vague instructions produce "something that works but isn't what you imagined."

## Experiment Design

**Task:** Build a Snake game.

**Control A (Vague):** `"Make a snake game"`
**Control B (Medium):** `"Build a web-based Snake game using HTML, CSS, and JavaScript. The snake grows when it eats food. The game ends when the snake hits a wall or itself."`
**Control C (Precise):** Full specification with canvas size, colors, controls, game speed, file structure, and verification step (see full text in output.log).

## Results

| Metric | A (Vague) | B (Medium) | C (Precise) |
|--------|-----------|------------|-------------|
| **File size** | 5,457 bytes (182 lines) | 12,440 bytes (388 lines) | 8,997 bytes (309 lines) |
| **Canvas** | ✅ | ✅ | ✅ |
| **Game Over screen** | ✅ | ✅ | ✅ |
| **Dark bg (#1a1a2e)** | ✅ | ✅ | ✅ |
| **Score display** | ✅ | ✅ | ✅ |
| **Restart button** | ✅ | ✅ | ✅ |
| **Green snake (#00ff41)** | ❌ | ❌ | ✅ |
| **180° reversal prevention** | ❌ | ✅ | ✅ |
| **150ms game loop** | ❌ | ❌ | ✅ |
| **File verified after creation** | ❌ | ✅ (self-reported) | ✅ (verified with `ls`) |
| **Extra features** | — | Snake eyes, gradient body, high score, pause | — |

## Key Observations

### Control A (Vague): "Good enough"
- Produced a working Snake game with basic features
- Missing: color specifics, 180° reversal prevention, game speed control
- File name: `snake.html` (AI chose)
- No verification step

### Control B (Medium): "Over-delivered"
- Produced the most code (388 lines) with bonus features like gradient snake body, eyes, high score, pause
- Missing: exact colors (#00ff41), exact game speed (150ms)
- File name: `snake.html` (AI chose)
- AI added creative features that weren't requested

### Control C (Precise): "Exactly what was asked"
- Matched every specification exactly
- Correct colors, correct speed, correct controls
- File name: `index.html` (as requested)
- Ran verification (`ls -la`) to confirm file creation

### The Precision Paradox

Interestingly, B produced MORE code than C. This is because precise instructions constrain the output, while medium instructions leave room for AI creativity. Whether this is good or bad depends on your goal:

| Goal | Best Approach |
|------|--------------|
| "Make something cool, surprise me" | B (Medium) |
| "Make exactly this, no more, no less" | C (Precise) |
| "Just get something working" | A (Vague) |

## Conclusion

**Hypothesis confirmed, with a nuance.**

- **Precision = control.** If you want exact colors, speed, and behavior, you must specify them.
- **Vagueness = delegation.** The AI will make decisions for you. Sometimes that's fine, sometimes it's not.
- **The sweet spot:** Start medium for creative tasks, go precise when you have a specific vision.

**For a One-Person CEO:** You usually want precision. You're the product visionary — AI should execute your vision, not improvise.
