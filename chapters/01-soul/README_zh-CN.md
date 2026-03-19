# 🧠 给 AI 装上一个顶级 COO 的大脑

<p align="left">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue" alt="English" /></a>
</p>

## 🎯 你将收获

一个像 COO 一样思考的 AI——它会规划、执行、测试、自检，然后才向你汇报。

---

## 📖 故事

小王做了两个实验。

**实验一：** 小王对 AI 说"做一个 Todo API"。AI 写了些代码就说"做完了！"。小王一试——一半功能没有，没有错误处理，发了坏数据服务器就崩了。

**实验二：** 小王对 AI 说同样的话，但这次 AI 有了一个"COO 大脑"——它写了代码，跑了测试，发现了 bug，修好了，然后才说"做完了，24 个测试全部通过。"

同样的任务，同样的 AI，天差地别的结果。

差别在哪？小王给了 AI 一个**灵魂**——一套定义它该怎么思考和工作的指令。

---

## 🗣️ 你将说出的话

在第 0 章，你输入了一条裸命令，AI 帮你干了件事。现在你要给 AI 一个**系统指令**，把它从"写代码的工具"变成"COO"。

你在命令里加上这段：

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

## 🔍 为什么有效

我们做了对照实验。同样的任务，两种不同的指令：

| | 裸指令（空灵魂） | COO 指令（COO 灵魂） |
|--|-----------------|---------------------|
| 测试 | ❌ 无 | ✅ 24/24 通过 |
| 错误处理 | ❌ 基础 | ✅ 400/404/500 |
| 输入验证 | ❌ 无 | ✅ 完整 |
| 自动自检 | ❌ 做完就走 | ✅ 发现并修复了一个 bug |
| 软删除 | ❌ 没有 | ✅ 有 |

**COO 指令让同一个 AI 多产出了 460 行代码（包括测试），抓到了一个 bug，交付了生产级质量的代码。**

查看完整实验记录：[experiments/01-soul-comparison/](../../experiments/01-soul-comparison/)

---

## COO 灵魂模板

保存这个模板，以后每个任务都用它。

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

你的具体任务写在这里
```

### 每个部分的作用

| 部分 | 作用 | 类比 |
|------|------|------|
| Product Thinking | 让 AI 为用户着想，不只是写代码 | CEO 说"想想客户" |
| Quality Standards | 强制自检 | QA 部门说"全部测一遍" |
| Delivery | 要求汇报和问责 | COO 说"报告结果，不是报告意图" |

---

## ⚠️ 翻车 #1："直接告诉它做什么就行"

最常见的错误：跳过灵魂设置，直接下任务。

```
❌ "帮我做一个带用户认证的博客"
```

你可能会得到"也许能用"的代码。可能有 bug。没有测试。没有验证。

```
✅ [COO 灵魂模板] + "帮我做一个带用户认证的博客"
```

你会得到经过测试、验证的生产级代码。因为 AI 在动手之前就知道**什么是质量**。

## ⚠️ 翻车 #2："灵魂写得太模糊"

```
❌ "做好一点，测一下"
```

太模糊了。AI 会按自己的理解解释"好"。

```
✅ "用 Jest 写测试覆盖所有端点。跑 npm test。所有测试必须通过。"
```

具体。可衡量。AI 知道"好"到底是什么。

---

## 💰 花费预估

COO 指令大约多花 2-3 倍的 API token，因为 AI 要写测试、跑测试、可能还要修 bug。

| 方式 | 预估花费 | 质量 |
|------|---------|------|
| 裸指令 | ~$0.05 | 🟡 也许能用 |
| COO 指令 | ~$0.15 | 🟢 经过测试和验证 |

**多花 $0.10，从"也许能用"升级到"经过测试和验证"。值得。**

---

## 📝 话术模板

从现在开始，每个命令都用这个格式：

```
acpx --approve-all --allowed-tools "Write,Bash,Read,Edit,MultiEdit,Glob,Grep,LS" claude exec "
[复制 COO 灵魂模板到这里]

你的具体任务写在这里
"
```

---

## ➡️ 下一章：[🎯 第 2 章 —— 一句话造一个贪吃蛇](../02-snake-game/README_zh-CN.md)

现在你的 AI 有了 COO 的大脑。第 2 章，你要用这个新能力做一件很酷的事——只说一句话，让 AI 做出一个能玩的贪吃蛇游戏。
