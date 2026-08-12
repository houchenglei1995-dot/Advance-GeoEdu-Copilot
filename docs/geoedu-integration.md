# GeoEdu-Copilot × OpenMAIC 接入说明

本文档记录 `Advance-GeoEdu-Copilot` 中 GeoEdu 教学目录与 OpenMAIC 课堂生成流程的接入方式。

## 1. 整体流程

```text
GeoEdu-Copilot
platform_data/experiments.csv
        │
        ▼
lib/geoedu/catalog.ts
        │
        ▼
lib/geoedu/bridge.ts
        │
        ▼
GenerateClassroomInput
        │
        ▼
OpenMAIC classroom generation
        │
        ├─ model routing
        ├─ agents
        ├─ slides
        ├─ quiz
        ├─ interactive scene
        ├─ PBL
        ├─ media / TTS
        └─ persistence / playback
        │
        ▼
遥感实践课堂
```

GeoEdu-Copilot 提供课程和实验信息。Advance 保存一份经过类型约束和测试的教学目录快照，并通过 `bridge.ts` 转换成 OpenMAIC 的课堂生成输入。

## 2. 教学目录

当前版本：`2026.08`

来源文件：

```text
GeoEdu-Copilot/platform_data/experiments.csv
```

当前快照对应 GeoEdu-Copilot commit：

```text
dddb780d248cfafbd025e00fd496d86311b839cd
```

目录包含：

- 7 门课程
- 19 个实验
- 实验编号
- 课程名
- 实验标题
- 数据源
- 工具
- 难度
- 预期成果
- Rubric

运行时直接读取 `lib/geoedu/catalog.ts`，不依赖 GitHub 网络访问。前端和 API 使用同一份目录。

## 3. 课堂请求

`POST /api/geoedu/classroom` 支持实验预设和自定义任务。

### 使用实验预设

```json
{
  "experimentId": "EXP-S1-008",
  "knowledgePoint": "RVI / DpRVIc",
  "region": "鲁西北平原",
  "enableTTS": true
}
```

`experimentId` 有效时，会自动补全课程、实验标题、数据源、工具、难度、预期成果和 Rubric。

请求中的显式字段可以覆盖预设。例如：

```json
{
  "experimentId": "EXP-S1-008",
  "dataSource": "教师指定的 Sentinel-1 GRD 教学数据",
  "extraRequirement": "增加地形影响讨论"
}
```

字段优先级：

```text
请求字段 > 实验预设 > 未提供
```

### 使用自定义任务

```json
{
  "course": "微波遥感",
  "experimentTitle": "SAR 后向散射与双极化特征实验",
  "dataSource": "Sentinel-1 GRD",
  "tools": ["SNAP", "Python"],
  "difficulty": "中级",
  "expectedOutputs": ["后向散射图", "分析记录"],
  "rubric": "流程40%;结果解释40%;反思20%"
}
```

请求至少包含 `course` 或有效的 `experimentId`。

## 4. 课堂生成内容

`bridge.ts` 会把以下信息写入 OpenMAIC `requirement`：

- 课程名称
- 实验任务
- 知识点
- 数据源
- 工具
- 难度
- 研究区
- 预期成果
- Rubric
- 教师补充要求

遥感实践课堂默认强调方法步骤、错误诊断、结果解释和反思。涉及代码时，会要求说明输入、输出、处理逻辑和常见问题。

## 5. API

### `GET /api/geoedu/catalog`

返回课程、实验和 OpenMAIC 能力目录，并附带 GeoEdu 来源文件和源 commit。

### `GET /api/geoedu/health`

返回当前集成版本、目录数量、OpenMAIC 运行时标识和 GeoEdu 源 commit。

### `POST /api/geoedu/classroom`

创建课堂生成任务，成功时返回 `202 Accepted`：

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

随后按 `pollUrl` 查询 OpenMAIC 的课堂生成状态。

常见请求错误：

- 缺少 `course` 和 `experimentId`：`400 MISSING_REQUIRED_FIELD`
- 未知 `experimentId`：`400 INVALID_REQUEST`
- 字段类型不正确：`400 INVALID_REQUEST`

## 6. 教师端入口

`/geoedu` 的使用流程：

1. 选择课程；
2. 选择实验预设或自定义任务；
3. 根据需要补充知识点、研究区和教学要求；
4. 选择 Web 检索、图像、视频或 TTS；
5. 提交课堂生成任务；
6. 查看生成进度并进入课堂。

实验预设选中后，页面会显示该实验的数据源、工具、难度、预期成果和 Rubric。

## 7. 数据说明

当前接入只使用课程和实验目录。学生明细、教师日志、成绩和平台审计数据没有写入教学目录，也不会自动发送给 OpenMAIC。

GeoEdu-Copilot 原仓库未作修改。教学目录更新时，从 `platform_data/experiments.csv` 核对内容后更新 Advance 中的快照。

## 8. 测试

`lib/geoedu/catalog.test.ts` 检查：

- 课程数量
- 实验数量
- 实验编号唯一性
- 课程筛选
- 实验编号查询

`lib/geoedu/bridge.test.ts` 检查：

- 实验预设解析
- 字段覆盖
- 请求校验
- OpenMAIC 功能开关传递

完整检查：

```bash
pnpm check
pnpm lint
npx tsc --noEmit
pnpm test
```

## 9. 更新 OpenMAIC

GeoEdu 相关代码主要位于：

```text
lib/geoedu/
app/geoedu/
app/api/geoedu/
```

同步 OpenMAIC 后，重点检查 `GenerateClassroomInput`、课堂 Job API、模型路由和存储接口是否有变化，再运行 GeoEdu 相关测试。

OpenMAIC 的同步记录见 [`docs/upstream-sync.md`](upstream-sync.md)。
