# GeoEdu-Copilot × OpenMAIC Integration

`Advance-GeoEdu-Copilot` is the enhanced runtime that connects GeoEdu-Copilot's natural-resources remote-sensing teaching semantics with OpenMAIC's multi-agent classroom capabilities.

The upstream repository `houchenglei1995-dot/GeoEdu-Copilot` remains independent and is not modified by this integration.

## Architecture

```text
GeoEdu-Copilot
(course / experiment / knowledge point / data source / rubric)
        │
        ▼
GeoEdu Bridge
(lib/geoedu/bridge.ts)
        │
        ▼
OpenMAIC native classroom generation
(model routing / agents / scenes / media / PBL / persistence)
        │
        ▼
Multi-agent remote-sensing classroom
```

GeoEdu is treated as the teaching-domain source. OpenMAIC is the capability and runtime layer. The bridge translates GeoEdu teaching fields into OpenMAIC's existing `GenerateClassroomInput` instead of introducing a second AI stack.

## User entry

Open:

```text
/geoedu
```

The launcher lets a teacher select a GeoEdu course and describe an experiment, knowledge point, data source, region and additional teaching requirements. The request is converted to an OpenMAIC multi-agent classroom job and uses the existing classroom runtime once generation completes.

## API

### Capability catalog

```http
GET /api/geoedu/catalog
```

Returns the GeoEdu course family and the OpenMAIC capabilities exposed by this runtime.

### Generate a GeoEdu classroom

```http
POST /api/geoedu/classroom
Content-Type: application/json
```

Example:

```json
{
  "course": "微波遥感",
  "experimentTitle": "基于 Sentinel-1 的双极化植被指数实践实验",
  "knowledgePoint": "RVI / DpRVIc",
  "dataSource": "Sentinel-1 GRD VV/VH",
  "tools": ["SNAP", "GEE", "Python"],
  "difficulty": "中级",
  "expectedOutputs": ["VV/VH 合成图", "植被指数图", "错误诊断记录"],
  "rubric": "预处理规范25%;公式正确25%;结果解释25%;错误处理15%;反思10%",
  "enableTTS": true,
  "agentMode": "generate"
}
```

The response is `202 Accepted` and contains a `pollUrl`. Poll that URL with OpenMAIC's existing classroom job API until `done` is `true`.

## What OpenMAIC contributes

The GeoEdu bridge reuses OpenMAIC's existing capabilities, including:

- multi-agent teacher / assistant / learner orchestration;
- slide and quiz generation;
- interactive scenes and PBL;
- whiteboard and classroom actions;
- TTS and media generation;
- per-stage model routing;
- asynchronous classroom jobs and persistence;
- document parsing and optional web research.

## Teaching constraints applied by the bridge

Generated classrooms are instructed to:

- use authentic remote-sensing practice tasks rather than generic lectures;
- follow a task → method/data → practice → error diagnosis → interpretation → check → reflection loop;
- make missing parameters explicit rather than inventing institution-specific data;
- emphasize reproducible workflows, input/output and common errors;
- avoid directly completing an entire student assignment.

## Repository boundary

This integration follows a strict boundary:

- **Read/reference:** `houchenglei1995-dot/GeoEdu-Copilot`
- **Modify/run:** `houchenglei1995-dot/Advance-GeoEdu-Copilot`

No write path to the original GeoEdu-Copilot repository is required.
