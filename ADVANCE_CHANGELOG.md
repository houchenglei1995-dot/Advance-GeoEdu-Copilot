# Advance GeoEdu-Copilot Changelog

本文件只记录 `Advance-GeoEdu-Copilot` 相对 OpenMAIC 上游新增的 GeoEdu 集成与产品化改动。OpenMAIC 原生版本变化继续查看根目录 `CHANGELOG.md`。

## 2026.08 — GeoEdu × OpenMAIC integrated runtime

### Teaching domain

- 建立 GeoEdu 版本化教学目录。
- 纳入 7 门自然资源遥感相关课程、19 个实验预设。
- 实验预设包含数据源、工具链、难度、预期成果和 Rubric。
- GeoEdu 原仓库保持只读，不修改其 Streamlit 应用和源代码。

### OpenMAIC bridge

- 新增 `lib/geoedu/bridge.ts`。
- 支持通过 `experimentId` 自动解析完整教学任务。
- 支持请求字段覆盖实验预设。
- 把 GeoEdu 教学语义转换为 OpenMAIC 原生 `GenerateClassroomInput`。
- 复用 OpenMAIC 原生异步 classroom job runner，不建立第二套 AI 服务。

### APIs

- `GET /api/geoedu/catalog`
- `GET /api/geoedu/health`
- `POST /api/geoedu/classroom`

### User experience

- 升级 `/geoedu` 为课程 + 实验预设的教师端生成入口。
- 增加生成阶段、进度和课堂跳转反馈。
- OpenMAIC 根首页增加只在 `/` 显示的 GeoEdu 入口，不侵入课堂和编辑器页面。
- 应用 metadata 更新为 Advance GeoEdu-Copilot。

### Quality and maintenance

- 增加 GeoEdu catalog 和 bridge 单元测试。
- 重写项目 README 和中文说明。
- 增加部署、集成架构和 OpenMAIC 上游同步文档。
- GeoEdu 定制保持在独立目录，降低后续 OpenMAIC 同步冲突。

### OpenMAIC upstream

- 已同步 `THU-MAIC/OpenMAIC` 主线至 commit `019fe6e6ac4eee75128746ea767f73bfc3ca2532`。
- 上游同步通过 fork 网络共享 commit 对象完成，未复制或改写 OpenMAIC 历史。
