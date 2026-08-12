# GeoEdu 接入速查

`Advance-GeoEdu-Copilot` 已接入 GeoEdu-Copilot 的课程和实验目录，并使用 OpenMAIC 生成和运行多智能体课堂。

## 流程

```text
GeoEdu 课程与实验
        ↓
lib/geoedu/catalog.ts
        ↓
lib/geoedu/bridge.ts
        ↓
OpenMAIC classroom generation
        ↓
遥感实践课堂
```

## 当前目录

- 7 门课程
- 19 个实验预设
- 支持 `experimentId` 直接生成课堂
- 支持自定义课程和实验任务
- 每个预设包含数据源、工具、难度、预期成果和 Rubric

目录来源：

```text
GeoEdu-Copilot/platform_data/experiments.csv
```

当前快照对应 GeoEdu-Copilot commit：

```text
dddb780d248cfafbd025e00fd496d86311b839cd
```

## OpenMAIC 能力

当前接入使用 OpenMAIC 的：

- 多智能体课堂
- Slides
- Quiz
- Interactive Scene
- PBL
- Whiteboard
- TTS
- Web 检索
- 图像和多媒体生成
- 多模型路由
- 课堂保存与播放

## 代码位置

- `lib/geoedu/catalog.ts`：课程和实验目录
- `lib/geoedu/bridge.ts`：转换为 `GenerateClassroomInput`
- `app/geoedu/`：教师端入口
- `app/api/geoedu/catalog/`：目录 API
- `app/api/geoedu/classroom/`：课堂生成 API
- `app/api/geoedu/health/`：状态检查

## 运行入口

```text
/geoedu
/api/geoedu/catalog
/api/geoedu/health
/api/geoedu/classroom
```

GeoEdu-Copilot 原仓库未作修改。课程目录更新时，在本仓库同步教学快照和测试即可。

详细说明见 [`README.md`](README.md) 和 [`docs/geoedu-integration.md`](docs/geoedu-integration.md)。
