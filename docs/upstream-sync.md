# OpenMAIC 上游同步策略

`Advance-GeoEdu-Copilot` 以 `THU-MAIC/OpenMAIC` 为能力底座，同时维护 GeoEdu 专用集成层。同步上游时应尽量避免把 GeoEdu 定制扩散到 OpenMAIC 核心目录。

## 推荐 Git remote

```bash
git remote -v
git remote add upstream https://github.com/THU-MAIC/OpenMAIC.git
git fetch upstream
```

如果已经存在 `upstream`，只需：

```bash
git fetch upstream
```

## 推荐同步方式

主分支已经包含 Advance 自定义提交，因此推荐使用普通 merge，而不是重写 `main` 历史：

```bash
git checkout main
git pull origin main
git merge upstream/main
```

解决冲突后运行：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm lint
npx tsc --noEmit
pnpm test
```

然后：

```bash
git push origin main
```

不建议对共享的 `main` 强制推送。

## 冲突处理原则

GeoEdu 定制目前应主要集中在：

```text
lib/geoedu/
app/geoedu/
app/api/geoedu/
GEOEDU.md
README.md
README-zh.md
docs/geoedu-*.md
```

OpenMAIC 核心目录如果没有明确的 GeoEdu 需求，应优先保留上游版本。

特别关注以下上游契约变化：

- `GenerateClassroomInput`
- `runClassroomGenerationJob`
- classroom job store / polling response
- 模型路由和供应商配置
- scene / PBL / media generation
- persistence / storage

如果这些契约发生变化，优先修改 `lib/geoedu/bridge.ts` 和 GeoEdu API，而不是复制或冻结旧版 OpenMAIC 实现。

## GeoEdu 上游同步

`houchenglei1995-dot/GeoEdu-Copilot` 与 OpenMAIC 上游不同：它是教学领域来源，不作为代码 merge 目标。

GeoEdu 更新时，只核验需要同步的课程、实验、数据契约和评价字段，并更新 Advance 的版本化教学目录快照。不要把 GeoEdu 的 Streamlit UI 或运行代码直接合并进本仓库。
