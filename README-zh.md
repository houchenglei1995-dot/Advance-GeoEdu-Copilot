# Advance GeoEdu-Copilot

中文项目说明已统一维护在仓库根目录的 [`README.md`](./README.md)，避免 `README.md` 与 `README-zh.md` 两份文档长期出现版本漂移。

本项目的定位是：**以 GeoEdu-Copilot 作为自然资源遥感课程与实验语义来源，以 OpenMAIC 作为多模型、多智能体课堂能力底座，在 Advance-GeoEdu-Copilot 中提供二者的适配层、教学入口和增强运行时。**

主要入口：

- [`README.md`](./README.md)：完整项目说明、架构、部署与 API
- [`GEOEDU.md`](./GEOEDU.md)：GeoEdu 集成快速索引
- [`docs/geoedu-integration.md`](./docs/geoedu-integration.md)：集成设计与接口约定
- `/geoedu`：运行后的自然资源遥感多智能体课堂入口
- `/api/geoedu/catalog`：7 门课程与 19 个实验预设
- `/api/geoedu/health`：集成健康状态

上游项目：

- GeoEdu-Copilot：`houchenglei1995-dot/GeoEdu-Copilot`
- OpenMAIC：`THU-MAIC/OpenMAIC`

`GeoEdu-Copilot` 在本集成中保持只读和独立，所有增强代码仅维护在 `Advance-GeoEdu-Copilot`。
