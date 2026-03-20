<p align="left"><a href="experiment.md">English</a></p>

# 第五章实验：认证系统

## 目标

为现有的课程平台添加用户注册和登录功能。这是第四章模块化架构重构之后的**第一个新增功能**——对架构是否真正有效的实战检验。

## 初始状态

- **起点：** 模块化课程平台（34个测试全部通过）
- **任务：** 添加完整的认证系统——注册、登录、登出、获取当前用户
- **约束条件：** 零修改现有模块
- **可用依赖：** Express、TypeScript、Jest、现有共享类型

## CEO 输入

> 继续阶段七

一句话。COO 将其分解为完整的认证模块规格。

## 构建内容

### 认证模块 (`src/features/auth/`)
| 文件 | 用途 |
|------|------|
| `types.ts` | 认证相关类型定义 |
| `store.ts` | 内存用户存储（bcrypt密码哈希） |
| `service.ts` | 业务逻辑——注册、登录、令牌验证 |
| `routes.ts` | Express路由（含输入验证） |
| `auth.test.ts` | 31个测试，覆盖所有端点和边界情况 |

### API 端点
| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/auth/register` | POST | 用邮箱、密码、姓名创建账户 |
| `/api/auth/login` | POST | 认证，返回JWT（httpOnly cookie） |
| `/api/auth/me` | GET | 从令牌返回当前用户（受保护） |
| `/api/auth/logout` | POST | 清除认证cookie |

### 新增依赖
- `jsonwebtoken` — JWT令牌创建和验证
- `bcryptjs` — 密码哈希（含 `@types/bcryptjs`）

### 共享类型
在 `src/lib/types/index.ts` 中添加了 `AuthUser`、`RegisterInput`、`LoginInput`。

## 结果

| 指标 | 结果 |
|------|------|
| 构建 (`npm run build`) | ✅ 零错误 |
| 测试 (`npm test`) | ✅ **65/65 通过**（34课程 + 31认证） |
| 对 `src/features/courses/` 的修改 | ✅ **零**（通过 `git diff` 验证） |
| TODO/FIXME/console.log | ✅ 无 |
| 新增文件 | 5 |
| 新增依赖 | 2（+ 1个类型包） |
| 耗时 | ~10分钟 |
| CEO工作量 | 1句话 |
| 遇到bug | 1个（自动修复） |

## Bug 记录

**`routes.ts` 中的 TypeScript 类型收窄错误：**
- **问题：** `result.errors` 类型为 `unknown`——TypeScript 在 `instanceof ZodError` 检查后无法收窄类型
- **修复：** Claude Code 读取文件，识别类型收窄问题，添加显式类型断言
- **解决：** 自动修复，重新构建，所有测试通过——无需人工干预

## 核心洞察

### 1. 模块化架构有效
添加认证（5个文件、4条路由、31个测试、2个依赖）没有触碰课程代码的任何一行。34个已有测试无需修改直接通过。这验证了第四章的**原则10：模块化架构**。

### 2. COO的8步流程交付可靠
接受→分解→架构→规格→执行→验证→保留→报告，一次产出生产级代码，无需迭代。

### 3. 功能隔离是真实的
`git diff` 显示对 `src/features/courses/` 零修改。唯一的共享修改是在 `src/lib/types/index.ts` 中添加类型——这是单向流动（features → lib），不存在循环依赖风险。

### 4. 认证复杂但可控
密码哈希、JWT令牌、httpOnly cookie、输入验证、错误处理——五个独立关注点在一个模块中处理，不影响平台其他部分。

### 5. 代码自愈
出现一个bug，Claude Code自主修复。读取文件、诊断TypeScript类型收窄问题、应用修复、重新构建。CEO全程无感知。

## COO 验收标准（12/12 通过）

1. ✅ 用户可通过邮箱、密码和姓名注册
2. ✅ 密码使用bcrypt哈希
3. ✅ 登录在httpOnly cookie中返回JWT
4. ✅ `/api/auth/me` 在已认证时返回当前用户数据
5. ✅ `/api/auth/me` 在未认证时返回401
6. ✅ 登出清除认证cookie
7. ✅ 注册拒绝重复邮箱
8. ✅ 注册验证输入（邮箱格式、密码长度）
9. ✅ 所有端点返回正确的HTTP状态码
10. ✅ 错误响应遵循一致格式
11. ✅ 认证模块有完整测试覆盖
12. ✅ 未修改课程模块

## 结论

第四章的模块化架构重构立即获得了回报。第一个新增功能——一个复杂的认证系统——干净地集成到现有代码旁边。65个测试通过。零回归。CEO只说了一句话。
