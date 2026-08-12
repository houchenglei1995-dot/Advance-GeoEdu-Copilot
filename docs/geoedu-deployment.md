# Advance GeoEdu-Copilot 部署说明

本项目沿用 OpenMAIC 的 Next.js 运行时和模型供应商体系，GeoEdu 集成本身不增加独立 Python 服务或额外数据库要求。

## 1. 环境要求

- Node.js `>= 20.9`
- pnpm `>= 10`
- 至少一个 OpenMAIC 支持的 LLM 供应商

## 2. 本地部署

```bash
git clone https://github.com/houchenglei1995-dot/Advance-GeoEdu-Copilot.git
cd Advance-GeoEdu-Copilot
pnpm install
cp .env.example .env.local
```

配置至少一个模型，例如：

```env
OPENAI_API_KEY=sk-...
DEFAULT_MODEL=openai:gpt-5.5
```

启动开发服务器：

```bash
pnpm dev
```

GeoEdu 入口：

```text
http://localhost:3000/geoedu
```

## 3. 生产构建

```bash
pnpm build
pnpm start
```

生产部署前建议执行：

```bash
pnpm check
pnpm lint
npx tsc --noEmit
pnpm test
```

## 4. Docker

根目录 `Dockerfile` 沿用 OpenMAIC 的容器化能力。常规构建：

```bash
docker build -t advance-geoedu-copilot .
docker run --rm -p 3000:3000 --env-file .env.local advance-geoedu-copilot
```

如果启用 OpenMAIC 的视频导出、外部存储或其他扩展服务，请继续按照仓库对应的 OpenMAIC 基础设施文档配置。

## 5. 运行检查

应用启动后建议检查：

```text
GET /api/geoedu/health
GET /api/geoedu/catalog
GET /api/health
```

`/api/geoedu/health` 只检查 GeoEdu 集成层和教学目录可加载状态；模型供应商、存储、媒体等运行状态由 OpenMAIC 原生接口与配置负责。

## 6. 安全建议

生产环境中：

- 模型 API Key 只放在服务端环境变量或 OpenMAIC 服务端供应商配置中；
- 不把校内身份凭据、学生明细或教师日志写入 `lib/geoedu/catalog.ts`；
- 如启用 `ACCESS_CODE`，沿用 OpenMAIC 的访问控制机制；
- 需要接入 LMS、统一身份认证或校内数据中台时，应单独设计权限和审计边界；
- GeoEdu 原仓库保持只读，不把课堂生成结果自动写回上游。

## 7. 教学目录升级

当 `GeoEdu-Copilot/platform_data/experiments.csv` 更新时：

1. 核验课程和实验变更；
2. 更新 `lib/geoedu/catalog.ts`；
3. 更新 `GEOEDU_INTEGRATION_VERSION`；
4. 更新目录和桥接测试；
5. 运行完整检查后部署。
