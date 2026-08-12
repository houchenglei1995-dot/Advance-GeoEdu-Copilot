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

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<GeoEduClassroomRequest>;
    if (!body.course?.trim()) {
      return apiError('MISSING_REQUIRED_FIELD', 400, 'Missing required field: course');
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
