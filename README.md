# Advance GeoEdu-Copilot

**GeoEdu-Copilot × OpenMAIC：面向自然资源遥感实践教学的多智能体课堂平台。**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![OpenMAIC](https://img.shields.io/badge/runtime-OpenMAIC-blue)](https://github.com/THU-MAIC/OpenMAIC)
[![GeoEdu-Copilot](https://img.shields.io/badge/course_data-GeoEdu--Copilot-0f766e)](https://github.com/houchenglei1995-dot/GeoEdu-Copilot)

Advance GeoEdu-Copilot 将 GeoEdu-Copilot 的课程、实验和评价信息接入 OpenMAIC。教师可以从已有遥感实验中直接选择任务，由 OpenMAIC 生成包含多智能体讲解、课件、测验、交互内容、PBL、白板和语音等内容的课堂。

当前 GeoEdu 教学目录以版本化快照保存在本仓库，GeoEdu-Copilot 原仓库未作修改。OpenMAIC 继续提供课堂生成和运行所需的基础能力。

## 当前内容

内置 **7 门课程、19 个实践实验**：

- 农情遥感监测
- 遥感原理与应用
- 微波遥感
- 热红外遥感
- 自然资源低空监测原理与应用
- 遥感数字图像处理
- 遥感影像深度学习与智能解译

实验覆盖 Sentinel-1/2、Landsat、SAR/InSAR、TVDI、地表温度、无人机正射与图斑核查、监督分类、语义分割、目标检测和可解释性分析。每个实验记录数据源、工具、难度、预期成果和 Rubric。

课堂侧直接使用 OpenMAIC 已有能力：

- 多智能体教师、助教与学习同伴
- Slides、Quiz、Interactive Scene、PBL
- 白板、TTS、图像和多媒体
- Web 检索与多模型路由
- 异步课堂生成、课堂保存与播放
- 文档解析和课堂导出

## 工作流程

```text
GeoEdu-Copilot / platform_data/experiments.csv
                    │
                    ▼
           lib/geoedu/catalog.ts
                    │
                    ▼
            lib/geoedu/bridge.ts
                    │
                    ▼
        OpenMAIC classroom generation
                    │
                    ▼
          多智能体遥感实践课堂
```

`catalog.ts` 保存课程和实验目录；`bridge.ts` 把课程、实验、数据源、工具、成果要求和 Rubric 转换为 OpenMAIC 的 `GenerateClassroomInput`。

## 使用入口

启动项目后可访问：

- `/geoedu`：遥感实践课堂生成入口
- `/`：OpenMAIC 通用入口
- `/api/geoedu/catalog`：课程和实验目录
- `/api/geoedu/health`：集成状态
- `/api/geoedu/classroom`：课堂生成 API

在 `/geoedu` 中选择课程和实验后，系统会自动带入该实验的数据源、工具、难度、成果要求和评分标准。知识点、研究区和补充要求可以继续调整。

## 快速开始

环境要求：

- Node.js `>= 20.9`
- pnpm `>= 10`

安装：

```bash
git clone https://github.com/houchenglei1995-dot/Advance-GeoEdu-Copilot.git
cd Advance-GeoEdu-Copilot
pnpm install
cp .env.example .env.local
```

至少配置一个 OpenMAIC 支持的模型供应商。例如：

```env
OPENAI_API_KEY=sk-...
DEFAULT_MODEL=openai:gpt-5.5
```

也可以使用 Azure OpenAI、Anthropic、Gemini、DeepSeek、Qwen、Kimi、MiniMax、GLM、Ollama、Lemonade 或其他 OpenAI-compatible 服务。具体变量见 `.env.example`。

启动开发环境：

```bash
pnpm dev
```

打开：

```text
http://localhost:3000/geoedu
```

生产构建：

```bash
pnpm build
pnpm start
```

## API 示例

使用已有实验：

```bash
curl -X POST http://localhost:3000/api/geoedu/classroom \
  -H "Content-Type: application/json" \
  -d '{
    "experimentId": "EXP-S1-008",
    "knowledgePoint": "RVI / DpRVIc",
    "region": "鲁西北平原",
    "enableTTS": true
  }'
```

使用自定义任务：

```json
{
  "course": "微波遥感",
  "experimentTitle": "SAR 后向散射与双极化特征实验",
  "dataSource": "Sentinel-1 GRD",
  "tools": ["SNAP", "Python"],
  "knowledgePoint": "散射机理与双极化特征"
}
```

接口返回 `202 Accepted` 和 `pollUrl`，随后按 `pollUrl` 查询生成状态。

## 教学目录

当前目录版本：`2026.08`

来源文件：

```text
houchenglei1995-dot/GeoEdu-Copilot
platform_data/experiments.csv
```

当前快照对应 GeoEdu-Copilot commit：

```text
dddb780d248cfafbd025e00fd496d86311b839cd
```

更新课程或实验时，先核对 GeoEdu-Copilot 中的 `experiments.csv`，再同步 `lib/geoedu/catalog.ts`、版本号和相关测试。课堂运行不需要实时访问 GitHub。

## 主要代码

```text
app/geoedu/                         教师端入口
app/api/geoedu/catalog/             教学目录 API
app/api/geoedu/classroom/           课堂生成 API
app/api/geoedu/health/              状态检查
lib/geoedu/catalog.ts               课程和实验目录
lib/geoedu/bridge.ts                OpenMAIC 输入转换
lib/geoedu/*.test.ts                集成测试
```

详细说明：

- [`GEOEDU.md`](GEOEDU.md)
- [`docs/geoedu-integration.md`](docs/geoedu-integration.md)
- [`docs/geoedu-deployment.md`](docs/geoedu-deployment.md)
- [`docs/upstream-sync.md`](docs/upstream-sync.md)
- [`ADVANCE_CHANGELOG.md`](ADVANCE_CHANGELOG.md)

## 测试

```bash
pnpm check
pnpm lint
npx tsc --noEmit
pnpm test
```

## OpenMAIC 上游

本仓库是 [THU-MAIC/OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) 的 fork。GeoEdu 相关代码主要放在 `lib/geoedu/`、`app/geoedu/` 和 `app/api/geoedu/`，方便后续继续同步 OpenMAIC。

当前已同步 OpenMAIC commit：

```text
019fe6e6ac4eee75128746ea767f73bfc3ca2532
```

## License

MIT License。

相关项目：

- [THU-MAIC/OpenMAIC](https://github.com/THU-MAIC/OpenMAIC)
- [houchenglei1995-dot/GeoEdu-Copilot](https://github.com/houchenglei1995-dot/GeoEdu-Copilot)
