# GeoEdu-Copilot Enhanced Runtime

This repository extends OpenMAIC for the GeoEdu-Copilot natural-resources remote-sensing teaching platform.

## Start here

Run OpenMAIC normally, then open:

```text
/geoedu
```

The GeoEdu launcher converts course, experiment, knowledge-point and data-source semantics into an OpenMAIC multi-agent classroom generation job.

## Division of responsibility

- **GeoEdu-Copilot:** remote-sensing courses, experiments, teaching semantics and evaluation context.
- **OpenMAIC:** multi-agent orchestration, slides, quizzes, interactive scenes, PBL, whiteboard, TTS/media, model routing and classroom persistence.
- **Advance-GeoEdu-Copilot:** the bridge and enhanced runtime that connects the two.

The original `houchenglei1995-dot/GeoEdu-Copilot` repository is not modified by this integration.

For API usage and architecture details, see [`docs/geoedu-integration.md`](docs/geoedu-integration.md).
