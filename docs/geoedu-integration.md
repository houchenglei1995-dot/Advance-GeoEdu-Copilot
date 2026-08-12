# GeoEdu-Copilot × OpenMAIC 集成设计

本文档说明 `Advance-GeoEdu-Copilot` 如何把 GeoEdu-Copilot 的自然资源遥感教学语义接入 OpenMAIC 的多智能体课堂运行时。

## 1. 设计目标

集成遵循三个边界：

1. **GeoEdu-Copilot 保持独立。** 本仓库不写入、不要求修改 GeoEdu 原仓库。
2. **OpenMAIC 继续作为能力底座。** 不重复实现模型路由、多智能体、PBL、课件、测验、白板、媒体或课堂持久化。
3. **领域逻辑集中在 GeoEdu 层。** 自然资源遥感课程、实验、数据、成果要求和 Rubric 由 `lib/geoedu/` 负责适配。

## 2. 架构

```text
houchenglei1995-dot/GeoEdu-Copilot
(read-only domain source)
        │
        │ experiments.csv / course semantics
        ▼
lib/geoedu/catalog.ts
(versioned teaching catalog snapshot)
        │
        ▼
lib/geoedu/bridge.ts
(domain request normalization)
        │
        │ GenerateClassroomInput
        ▼
OpenMAIC native generation pipeline
        │
        ├─ model routing
        ├─ agent profiles
        ├─ scene outline/content/actions
        ├─ quiz / interactive / PBL
        ├─ media / TTS
        └─ persistence / playback
        ▼
Multi-agent remote-sensing classroom
```

## 3. 教学目录

当前集成版本：`2026.08`。

来源路径：

```text
GeoEdu-Copilot/platform_data/experiments.csv
```

Advance 中维护一份经过类型约束和单元测试的运行时快照，当前包含：

- 7 门课程
- 19 个实验
- 每个实验的 `id`
- 课程名
- 实验标题
- 数据源
- 工具链
- 难度
- 预期成果
- Rubric

这样设计而不是运行时直接从 GitHub 拉取 CSV，主要为了保证课堂生成的稳定性、可复现性和离线可部署性。

## 4. 请求解析规则

`POST /api/geoedu/classroom` 支持两种调用方式。

### 4.1 实验预设模式

```json
{
  "experimentId": "EXP-S1-008",
  "knowledgePoint": "RVI / DpRVIc",
  "region": "鲁西北平原",
  "enableTTS": true
}
```

只要 `experimentId` 有效，桥接层会从目录补全课程、实验标题、数据源、工具链、难度、预期成果和 Rubric。

调用者可以覆盖任意预设字段。例如：

```json
{
  "experimentId": "EXP-S1-008",
  "dataSource": "教师指定的 Sentinel-1 GRD 教学数据",
  "extraRequirement": "增加地形影响讨论"
}
```

覆盖优先级：

```text
请求显式字段 > GeoEdu 实验预设 > 未提供
```

### 4.2 自定义任务模式

```json
{
  "course": "微波遥感",
  "experimentTitle": "自定义 SAR 实践任务",
  "dataSource": "Sentinel-1 GRD",
  "tools": ["SNAP", "Python"],
  "difficulty": "中级",
  "expectedOutputs": ["后向散射图", "分析记录"],
  "rubric": "流程40%;结果解释40%;反思20%"
}
```

至少需要 `course` 或有效 `experimentId` 之一。

## 5. OpenMAIC 课堂约束

桥接层会在 OpenMAIC `requirement` 中加入 GeoEdu 教学约束：

- 以真实遥感实践任务为主线，而不是泛化知识讲授；
- 教师智能体负责方法和规范；
- 助教或学习同伴负责追问、纠错、结果解释和反思；
- 优先组织“任务导入—方法与数据—分步实践—错误诊断—结果解释—测验/检查—总结反思”的教学闭环；
- 不虚构学校内部数据、学生成绩或专有数据；
- 遥感代码强调可复现逻辑、输入输出和常见错误，不直接替学生完成整份作业。

这些要求进入 OpenMAIC 原生生成流程，而不是通过单独的大模型服务生成静态答案。

## 6. API

### `GET /api/geoedu/catalog`

返回：

- 集成版本
- GeoEdu 来源仓库和来源路径
- 课程数量和实验数量
- 7 门课程
- 19 个实验预设
- OpenMAIC 能力标识
- 面向 UI 的能力说明

### `GET /api/geoedu/health`

用于确认 GeoEdu 集成层是否可加载，返回目录数量、集成版本、运行时和只读上游模式。

它不等价于模型供应商健康检查。模型密钥、媒体供应商和存储状态仍由 OpenMAIC 原生健康与配置机制负责。

### `POST /api/geoedu/classroom`

创建异步课堂生成任务，返回 `202`：

```json
{
  "success": true,
  "integration": "geoedu-openmaic",
  "integrationVersion": "2026.08",
  "experimentId": "EXP-S1-008",
  "course": "微波遥感",
  "jobId": "...",
  "status": "...",
  "step": "...",
  "message": "...",
  "pollUrl": "...",
  "pollIntervalMs": 5000
}
```

之后使用返回的 `pollUrl` 轮询 OpenMAIC 原生课堂任务状态。

错误约定：

- 未提供 `course` 和 `experimentId`：`400 MISSING_REQUIRED_FIELD`
- 未知 `experimentId`：`400 INVALID_REQUEST`
- 课堂任务创建异常：`500 INTERNAL_ERROR`

## 7. 前端入口

`/geoedu` 提供教师端入口：

1. 选择课程；
2. 选择该课程已有实验预设，或切换自定义任务；
3. 可增加知识点、研究区和补充教学要求；
4. 可启用 Web 检索、图像生成和 TTS；
5. 提交后显示 OpenMAIC 异步生成阶段和进度；
6. 完成后进入生成的课堂。

前端使用的目录与服务端桥接层来自同一 `lib/geoedu/catalog.ts`，避免 UI 与 API 各自维护一套课程清单。

## 8. 安全与数据治理

本集成默认遵循最小数据原则：

- 不自动读取 GeoEdu 的学生明细、教师日志或平台审计数据；
- 不把学生敏感数据嵌入静态教学目录；
- 不向 GeoEdu 原仓库写回课堂结果；
- 只在明确批准的部署中接入校内身份、LMS、对象存储或学生过程数据；
- 模型密钥和供应商配置继续使用 OpenMAIC 的服务端配置机制。

## 9. 测试

`lib/geoedu/catalog.test.ts` 检查：

- 7 门课程；
- 19 个实验；
- 实验编号唯一；
- 课程筛选；
- 实验编号查询。

`lib/geoedu/bridge.test.ts` 检查：

- 显式教学字段映射；
- `experimentId` 预设解析；
- 缺失/未知请求校验；
- OpenMAIC 功能开关传递。

完整检查命令：

```bash
pnpm check
pnpm lint
npx tsc --noEmit
pnpm test
```

## 10. 上游维护

OpenMAIC 更新时，应优先保持其核心模块原样同步。GeoEdu 定制尽量限制在：

```text
lib/geoedu/
app/geoedu/
app/api/geoedu/
README.md
GEOEDU.md
docs/geoedu-*.md
```

如果 OpenMAIC 修改 `GenerateClassroomInput`、课堂 Job API、模型路由或持久化契约，应优先更新 GeoEdu Bridge 和测试，而不是复制旧版 OpenMAIC 代码。

GeoEdu 教学目录变化时，应先核验 `platform_data/experiments.csv`，再更新 `GEOEDU_INTEGRATION_VERSION`、目录快照和相关测试。
