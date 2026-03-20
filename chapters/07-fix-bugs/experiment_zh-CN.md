<p align="left"><a href="experiment.md">English</a></p>

# 第七章实验：Bug 修复——通过精确规范实现零 Bug

## 目标

修复第 5 章和第 6 章的所有已知 bug 和架构违规，评估 COO 的新流程（检查→规范→结构性验证）是否能一次通过实现零 bug。

## 实验设置

| 项目 | 详情 |
|---|---|
| **已知问题** | 6 个跨功能导入 + 1 个未初始化变量（来自第 5/6 章审计） |
| **Bug 数（第 5 章）** | 1（TypeScript 类型收窄） |
| **Bug 数（第 6 章）** | 3（2 个功能性 + 1 个初始化） |
| **架构违规（第 6 章）** | 6 个（支付→课程直接导入） |
| **COO（OpenClaw）** | 相同模型，新流程，强制反思 |
| **工程师（Claude Code）** | 相同配置 |
| **方法** | 基于文件的提示词（避免 PowerShell 转义问题） |

## 过程

### 第 1 步：RECALL

读取第 5 章和第 6 章的沉淀知识：

- 第 5 章教训：类型处理中的歧义→显式指定判别联合类型
- 第 6 章教训：没有结构审计→违规溜过去；"测试通过" ≠ "完成"
- 新规则：在 VERIFY 步骤中始终 grep 跨功能导入

### 第 2 步：AUDIT

在写任何规范之前运行结构检查：

- `grep -r "@/features/courses" src/features/payment/` → 发现 **6 个违规**
- `grep -r "enrolledCourses" src/features/auth/` → 发现 **1 个未初始化变量**
- 完整画面：在写任何规范之前就精确知道了问题范围

### 第 3 步：ARCHITECT

评估三种方案：

| 方案 | 复杂度 | 改动量 | 可测试性影响 |
|------|--------|--------|------------|
| 门面模式 | 中 | 中 | 中性 |
| 事件系统 | 高 | 大 | 负面（隐藏流程） |
| **依赖注入** | **低** | **小** | **正面（可 mock）** |

**决定：依赖注入。** 支付模块通过参数接收课程查找函数。功能边界得到保持。

### 第 4 步：SPECIFY

写出精确规范，包括：

- `createOrder`、`getEnrollment`、路由处理器的精确函数签名
- `PaymentRouteDeps` 接口：`{ getToken, getCurrentUser, findCourse }`
- 文件权限：支付文件不能从 `@/features/courses` 导入
- `src/app/api/` 中的 API 路由适配器可以从功能模块导入（胶水代码例外）
- auth store 中显式 `enrolledCourses: string[] = []` 初始化

### 第 5 步：EXECUTE

通过基于文件的提示词将规范发送给 Claude Code（避免第 5/6 章中遇到的 PowerShell 字符转义问题）。

### 第 6 步：VERIFY

| 检查项 | 命令 | 结果 |
|---|---|---|
| 构建 | `npm run build` | ✅ 零错误 |
| 测试 | `npm test` | ✅ 94/94 通过 |
| 跨功能导入 | `grep -r "@/features/courses" src/features/payment/` | ✅ 零结果 |
| 代码卫生 | `grep -r "TODO\|FIXME\|console\.log" src/features/payment/` | ✅ 零结果 |
| 类型安全 | `grep -r ": any" src/features/payment/` | ✅ 零结果 |
| Bug 数 | 人工审查 | ✅ **0 个 bug** |

## 结果

| 指标 | 第 5 章 | 第 6 章 | 第 7 章 |
|---|---|---|---|
| Bug 数 | 1 | 3 | **0** |
| 架构违规 | 0 | 6 | **0** |
| 测试通过 | 65/65 | 94/94 | 94/94 |
| 结构审计 | ❌ 未做 | ❌ 未做 | ✅ 已做 |
| 根因分析 | ❌ 未做 | ❌ 未做 | ✅ 已做 |
| COO 行为 | 赶工 | 赶工 | 谨慎 |

## 关键变更

| 文件 | 变更 |
|------|------|
| `payment/types.ts` | `Category` 从 `@/lib/config` 导入，而非课程模块 |
| `payment/service.ts` | `createOrder`/`getEnrollment` 接受 `findCourse` 参数 |
| `payment/routes.ts` | 处理器接受 `PaymentRouteDeps` 接口 |
| `src/app/api/*/route.ts` | 适配器导入真实 store，传给处理器（胶水层） |
| `payment.test.ts` | 使用 mock 数据代替真实 store |
| `auth/store.ts` | `enrolledCourses` 初始化为 `[]` |
| `courses/*` | **零修改** |

## 关键发现

**1. COO 退化是因为没有人强制反思。** 从第 4 章到第 6 章，COO 优化了速度，停止了审计。CEO 的问题"你学到了什么？"打破了自动驾驶模式。没有那个干预，第 7 章会继续退化。

**2. 测试通过是必要条件，但远远不够。** 第 6 章 94/94 测试通过，同时架构有 6 个违规。功能测试验证行为。它们不验证结构。两者都需要。

**3. 先检查再规范。** COO 在第 7 章的 grep 审计花了 10 秒，揭示了精确的问题范围。不知道问题就写规范是猜。猜会导致更多 bug。

**4. 精确消灭 bug。** 当规范说"在 `service.ts` 中，将 `createOrder` 改为接受一个类型为 `(id: string) => Promise<Course \| null>` 的 `findCourse` 参数，且不修改 `courses/` 中的任何文件"——工程师没有创造性解读的空间。零歧义 = 零 bug。

**5. 依赖注入是无聊但正确的选择。** 门面会增加抽象。事件会隐藏数据流。DI 只是让函数通过参数传递。最小改动，最大清晰度，更好的测试。

**6. 薄适配器模式至关重要。** `src/app/api/` 中的 API 路由文件可以从功能模块导入，因为它们不是功能代码——它们是胶水。功能模块本身不能从其他功能模块导入。这个区分保持了架构整洁。

## 这证明了什么

从第 5 章（1 个 bug）到第 6 章（3 个 bug + 6 个违规）的退化不是 AI 模型的问题。它是流程问题。COO 停止了思考，开始配送。修复方案不是更好的提示词模板或更聪明的模型——而是 CEO 问了"你学到了什么？"，以及 COO 诚实地回答了。

当 COO 遵循有纪律的流程时，零 bug 是可实现的：RECALL 过去的教训，AUDIT 当前状态，ARCHITECT 带着选项，SPECIFY 精确，VERIFY 结构性。

## 沉淀知识

- ✅ 每个阶段后强制反思："你学到了什么？"不是可选的
- ✅ 结构审计（grep 跨功能导入）在 VERIFY 中是强制的
- ✅ 显式指定函数签名、文件权限和验证命令
- ✅ "测试通过" ≠ "完成"——结构性检查不可妥协
- ✅ 依赖注入实现解耦：接收依赖，不要导入依赖
- ✅ API 路由适配器是胶水代码，不是功能代码——适用不同的导入规则
- ✅ Bug 趋势：1 → 3 → 0。下降是 COO 的错。恢复是流程的功劳。

---

⬅️ **上一篇：** [第六章：支付](../06-payment/README.md) | [README](../../README.md) | **下一篇：** [第八章：部署](../08-deploy/README.md) →
