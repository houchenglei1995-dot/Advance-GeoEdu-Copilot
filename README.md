# Advance GeoEdu-Copilot

**GeoEdu-Copilot × OpenMAIC：面向自然资源遥感实践教学的多智能体课堂运行平台。**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![OpenMAIC](https://img.shields.io/badge/runtime-OpenMAIC-blue)](https://github.com/THU-MAIC/OpenMAIC)
[![GeoEdu-Copilot](https://img.shields.io/badge/domain-GeoEdu--Copilot-0f766e)](https://github.com/houchenglei1995-dot/GeoEdu-Copilot)

Advance GeoEdu-Copilot 不是把两个仓库简单拼接在一起，而是在 **OpenMAIC 的多模型、多智能体、课件、测验、PBL、白板、语音和课堂运行能力**之上增加一层面向自然资源遥感课程的 GeoEdu 教学语义适配。

- `GeoEdu-Copilot`：课程、实验、数据、知识点、评价和教学治理的领域来源。
- `OpenMAIC`：多智能体课堂生成与运行能力底座。
- `Advance-GeoEdu-Copilot`：二者之间的增强运行时、教学入口和适配层。

> **仓库边界：** 本仓库不会写入 `GeoEdu-Copilot`。GeoEdu 上游仅作为教学领域来源读取和参考，所有增强代码均保存在本仓库。

## 当前能力

### GeoEdu 教学层

当前内置 GeoEdu 教学目录快照包含 **7 门课程、19 个实践实验**：

- 农情遥感监测
- 遥感原理与应用
- 微波遥感
- 热红外遥感
- 自然资源低空监测原理与应用
- 遥感数字图像处理
- 遥感影像深度学习与智能解译

实验覆盖 Sentinel-1/2、Landsat、SAR/InSAR、TVDI、地表温度、无人机正射与图斑核查、监督分类、语义分割、目标检测和可解释性分析等场景。每个预设包含数据源、工具链、难度、预期成果和 Rubric。

### OpenMAIC 能力层

GeoEdu 教学任务直接复用 OpenMAIC 原生能力，包括：

- 多智能体教师、助教与学习同伴
- Slides、Quiz、Interactive Scene 与 PBL
- 白板、TTS、图像与多媒体能力
- Web 检索与多模型供应商路由
- 分阶段模型路由与推理配置
- 异步课堂生成任务、课堂持久化与播放运行时
- 文档解析、课堂导出及 OpenMAIC 的其他原生能力

## 架构

```text
GeoEdu-Copilot（只读领域来源）
        │
        │ course / experiment / data / rubric
        ▼
GeoEdu Teaching Catalog
lib/geoedu/catalog.ts
        │
        ▼
GeoEdu Bridge
lib/geoedu/bridge.ts
        │
        │ GenerateClassroomInput
        ▼
OpenMAIC Native Generation Pipeline
model routing / agents / scenes / PBL / media / persistence
        │
        ▼
自然资源遥感多智能体实践课堂
```

核心原则是 **“领域语义与能力运行时分离”**：不复制 GeoEdu 的 Streamlit 应用，也不另建一套大模型调用链，而是把 GeoEdu 教学任务转换为 OpenMAIC 已有的课堂生成契约。

## 使用入口

启动项目后：

- `/geoedu`：GeoEdu 遥感多智能体课堂入口
- `/`：OpenMAIC 原生通用课堂入口
- `/api/geoedu/catalog`：GeoEdu 课程、19 个实验预设及能力目录
- `/api/geoedu/health`：GeoEdu × OpenMAIC 集成健康状态
- `/api/geoedu/classroom`：创建 GeoEdu 遥感课堂任务

### 课堂 API 示例

只需要实验编号即可调用完整预设：

```bash
curl -X POST http://localhost:3000/api/geoedu/classroom \
  -H "Content-Type: application/json" \
  -d '{
    "experimentId": "EXP-S1-008",
    "knowledgePoint": "RVI / DpRVIc",
    "region": "鲁西北平原",
    "enableWebSearch": false,
    "enableTTS": true
  }'
```

也可以完全自定义：

```json
{
  "course": "微波遥感",
  "experimentTitle": "自定义 SAR 实践任务",
  "dataSource": "Sentinel-1 GRD",
  "knowledgePoint": "散射机理与双极化特征",
  "extraRequirement": "重点训练错误诊断和结果解释"
}
```

接口返回 `202 Accepted` 和 `pollUrl`，后续沿用 OpenMAIC 原生课堂任务接口轮询生成进度。

## 快速开始

### 环境要求

- Node.js `>= 20.9`
- pnpm `>= 10`

### 安装

```bash
git clone https://github.com/houchenglei1995-dot/Advance-GeoEdu-Copilot.git
cd Advance-GeoEdu-Copilot
pnpm install
```

### 配置模型

```bash
cp .env.example .env.local
```

至少配置一个 OpenMAIC 支持的模型供应商。例如：

```env
OPENAI_API_KEY=sk-...
DEFAULT_MODEL=openai:gpt-5.5
```

也可以使用 OpenAI-compatible、Azure OpenAI、Anthropic、Gemini、DeepSeek、Qwen、Kimi、MiniMax、GLM、Ollama、Lemonade 等 OpenMAIC 已支持的供应商。详细变量以 `.env.example` 和 OpenMAIC 原生配置为准。

### 启动

```bash
pnpm dev
```

访问：

```text
http://localhost:3000/geoedu
```

### 生产构建

```bash
pnpm build
pnpm start
```

Docker 部署沿用仓库现有 `Dockerfile` 与 OpenMAIC 基础设施。

## GeoEdu 目录维护

当前目录版本标识为 `2026.08`，来源于：

```text
GeoEdu-Copilot/platform_data/experiments.csv
```

在 Advance 中维护为版本化、可测试的快照，原因是：

1. 课堂运行不依赖 GitHub 实时网络访问；
2. 前端、API 与服务端桥接共用同一份教学契约；
3. GeoEdu 原仓库始终保持独立，不需要为了 OpenMAIC 集成而修改代码；
4. 上游教学数据变化可以经过核验后再同步到运行时。

## 代码结构

```text
app/
├── geoedu/                         # GeoEdu 教师端课堂入口
└── api/geoedu/
    ├── catalog/                    # 课程、实验与能力目录
    ├── classroom/                  # GeoEdu → OpenMAIC 课堂生成
    └── health/                     # 集成健康状态
lib/geoedu/
├── catalog.ts                      # 7 门课程、19 个实验、能力映射
├── catalog.test.ts
├── bridge.ts                       # GeoEdu → GenerateClassroomInput
└── bridge.test.ts
docs/
└── geoedu-integration.md           # 详细集成说明
```

OpenMAIC 原有 `app/`、`lib/`、`packages/@openmaic/*`、课堂编辑器、媒体、存储和模型供应商体系保持原生结构，减少后续同步上游时的冲突。

## 开发检查

```bash
pnpm check
pnpm lint
npx tsc --noEmit
pnpm test
```

GeoEdu 集成测试覆盖教学目录数量与唯一性、课程筛选、实验预设解析、字段覆盖、请求校验和 OpenMAIC 功能开关传递。

## 与 OpenMAIC 上游的关系

本项目建立在 [THU-MAIC/OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) 之上，并保留其 MIT License 和原项目归属。Advance 的定制尽量集中在 `lib/geoedu/`、`app/geoedu/`、`app/api/geoedu/` 和本项目文档中，避免无必要修改 OpenMAIC 核心模块。

需要同步 OpenMAIC 新版本时，应优先更新能力底座，再验证 GeoEdu Bridge 与教学目录测试，避免将 GeoEdu 领域逻辑直接侵入上游核心代码。

OpenMAIC 原始论文、功能说明、社区与完整供应商配置请参阅其上游仓库。

## 许可证与致谢

本仓库沿用 MIT License。

- OpenMAIC：THU-MAIC/OpenMAIC
- GeoEdu-Copilot：houchenglei1995-dot/GeoEdu-Copilot

Advance GeoEdu-Copilot 的新增工作聚焦于自然资源遥感课程语义、实验预设、教学入口以及 GeoEdu 与 OpenMAIC 之间的适配与运行集成。
