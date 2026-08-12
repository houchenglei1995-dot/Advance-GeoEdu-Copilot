import { after, type NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { apiError, apiSuccess } from '@/lib/server/api-response';
import { buildRequestOrigin } from '@/lib/server/classroom-storage';
import { createClassroomGenerationJob } from '@/lib/server/classroom-job-store';
import { runClassroomGenerationJob } from '@/lib/server/classroom-job-runner';
import {
  buildGeoEduClassroomInput,
  type GeoEduClassroomRequest,
} from '@/lib/geoedu/bridge';
import {
  findGeoEduExperiment,
  GEOEDU_INTEGRATION_VERSION,
} from '@/lib/geoedu/catalog';

export const maxDuration = 30;

const STRING_FIELDS = [
  'experimentId',
  'course',
  'experimentTitle',
  'knowledgePoint',
  'dataSource',
  'difficulty',
  'rubric',
  'region',
  'extraRequirement',
] as const;

const BOOLEAN_FIELDS = [
  'enableWebSearch',
  'enableImageGeneration',
  'enableVideoGeneration',
  'enableTTS',
] as const;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export async function POST(req: NextRequest) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return apiError('INVALID_REQUEST', 400, 'Request body must be valid JSON');
    }

    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return apiError('INVALID_REQUEST', 400, 'Request body must be a JSON object');
    }

    const record = rawBody as Record<string, unknown>;
    const invalidStringField = STRING_FIELDS.find(
      (field) => record[field] != null && typeof record[field] !== 'string',
    );
    if (invalidStringField) {
      return apiError(
        'INVALID_REQUEST',
        400,
        `Field must be a string: ${invalidStringField}`,
      );
    }

    const invalidBooleanField = BOOLEAN_FIELDS.find(
      (field) => record[field] != null && typeof record[field] !== 'boolean',
    );
    if (invalidBooleanField) {
      return apiError(
        'INVALID_REQUEST',
        400,
        `Field must be a boolean: ${invalidBooleanField}`,
      );
    }

    for (const field of ['tools', 'expectedOutputs'] as const) {
      if (record[field] != null && !isStringArray(record[field])) {
        return apiError('INVALID_REQUEST', 400, `Field must be a string array: ${field}`);
      }
    }

    if (
      record.agentMode != null &&
      record.agentMode !== 'default' &&
      record.agentMode !== 'generate'
    ) {
      return apiError(
        'INVALID_REQUEST',
        400,
        'Field agentMode must be "default" or "generate"',
      );
    }

    const body = rawBody as Partial<GeoEduClassroomRequest>;
    const course = typeof body.course === 'string' ? body.course.trim() : '';
    const experimentId =
      typeof body.experimentId === 'string' ? body.experimentId.trim() : '';

    if (!course && !experimentId) {
      return apiError(
        'MISSING_REQUIRED_FIELD',
        400,
        'Missing required field: course or experimentId',
      );
    }

    if (experimentId && !findGeoEduExperiment(experimentId)) {
      return apiError('INVALID_REQUEST', 400, `Unknown GeoEdu experiment: ${experimentId}`);
    }

    const classroomInput = buildGeoEduClassroomInput(body as GeoEduClassroomRequest);
    const baseUrl = buildRequestOrigin(req);
    const jobId = nanoid(10);
    const job = await createClassroomGenerationJob(jobId, classroomInput);
    const pollUrl = `${baseUrl}/api/generate-classroom/${jobId}`;

    after(() => runClassroomGenerationJob(jobId, classroomInput, baseUrl));

    return apiSuccess(
      {
        integration: 'geoedu-openmaic',
        integrationVersion: GEOEDU_INTEGRATION_VERSION,
        experimentId: experimentId || undefined,
        course: course || findGeoEduExperiment(experimentId)?.course,
        jobId,
        status: job.status,
        step: job.step,
        message: job.message,
        pollUrl,
        pollIntervalMs: 5000,
      },
      202,
    );
  } catch (error) {
    return apiError(
      'INTERNAL_ERROR',
      500,
      'Failed to create GeoEdu classroom generation job',
      error instanceof Error ? error.message : String(error),
    );
  }
}
