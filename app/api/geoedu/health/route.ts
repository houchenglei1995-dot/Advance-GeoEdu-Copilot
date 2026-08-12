import { apiSuccess } from '@/lib/server/api-response';
import {
  GEOEDU_COURSES,
  GEOEDU_EXPERIMENTS,
  GEOEDU_INTEGRATION_VERSION,
  GEOEDU_SOURCE_REPOSITORY,
} from '@/lib/geoedu/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  return apiSuccess({
    integration: 'geoedu-openmaic',
    status: 'ready',
    integrationVersion: GEOEDU_INTEGRATION_VERSION,
    sourceRepository: GEOEDU_SOURCE_REPOSITORY,
    upstreamMode: 'read-only',
    catalog: {
      courses: GEOEDU_COURSES.length,
      experiments: GEOEDU_EXPERIMENTS.length,
    },
    runtime: 'openmaic',
  });
}
