# COO Soul Template

> This template was battle-tested in [Chapter 1's experiment](../experiments/01-soul-comparison/).
> It produced 24 passing tests, caught a bug, and delivered production-quality code — vs 0 tests with bare instructions.

## How to Use

Copy the template below and paste it into your `acpx claude exec` command, before your specific task.

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

[YOUR SPECIFIC TASK HERE]
```

## Why These Three Sections?

| Section | Purpose | Real-World Analogy |
|---------|---------|-------------------|
| **Product Thinking** | Makes AI think about users and edge cases | CEO tells the team "think about the customer" |
| **Quality Standards** | Forces self-verification before delivery | QA department says "test everything before shipping" |
| **Delivery** | Creates accountability and transparency | COO says "report results, not intentions" |

## Proven Results

In our experiment, this template turned the same AI from:
- ❌ No tests → ✅ 24 passing tests
- ❌ No error handling → ✅ Full 400/404/500 coverage
- ❌ No self-verification → ✅ Auto-detected and fixed a bug

**Cost difference:** ~$0.10 more per task. **Quality difference:** immeasurable.
