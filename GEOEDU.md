# GeoEdu-Copilot Enhanced Runtime

`Advance-GeoEdu-Copilot` 是 GeoEdu-Copilot 的 OpenMAIC 增强运行时。

## 一句话架构

```text
GeoEdu 课程与实验语义（只读）
        → GeoEdu Catalog / Bridge
        → OpenMAIC 原生课堂生成管线
        → 多智能体自然资源遥感实践课堂
```

## 当前集成

- 7 门自然资源遥感相关课程
- 19 个版本化实验预设
- `experimentId` 一键生成课堂
- 自定义课程任务与字段覆盖
- OpenMAIC 多智能体、Slides、Quiz、Interactive、PBL、Whiteboard、TTS 等能力
- Web 检索、图像生成、多模型路由与课堂持久化
- 教学目录 API 与集成健康检查

## 代码入口

- `lib/geoedu/catalog.ts`：课程、19 个实验预设、OpenMAIC 能力映射
- `lib/geoedu/bridge.ts`：GeoEdu 教学语义 → `GenerateClassroomInput`
- `app/geoedu/`：教师端课堂生成入口
- `app/api/geoedu/catalog/`：教学目录
- `app/api/geoedu/classroom/`：课堂生成 API
- `app/api/geoedu/health/`：集成健康状态

## 运行入口

```text
/geoedu
/api/geoedu/catalog
/api/geoedu/health
/api/geoedu/classroom
```

完整说明见 [`README.md`](README.md) 和 [`docs/geoedu-integration.md`](docs/geoedu-integration.md)。

## 仓库边界

`houchenglei1995-dot/GeoEdu-Copilot` 仅作为教学领域来源读取，不由本仓库写入或修改。OpenMAIC 核心代码也尽量保持上游结构，GeoEdu 定制集中在独立目录中，以降低后续同步 `THU-MAIC/OpenMAIC` 的冲突。
