import { apiSuccess } from '@/lib/server/api-response';
import {
  GEOEDU_COURSES,
  GEOEDU_EXPERIMENTS,
  GEOEDU_INTEGRATION_VERSION,
  GEOEDU_SOURCE_REPOSITORY,
} from '@/lib/geoedu/catalog';
import { GEOEDU_CATALOG_SOURCE_COMMIT } from '@/lib/geoedu/source';

export const dynamic = 'force-dynamic';

export async function GET() {
  return apiSuccess({
    integration: 'geoedu-openmaic',
    status: 'ready',
    integrationVersion: GEOEDU_INTEGRATION_VERSION,
    sourceRepository: GEOEDU_SOURCE_REPOSITORY,
    sourceCommit: GEOEDU_CATALOG_SOURCE_COMMIT,
    upstreamMode: 'read-only',
    catalog: {
      courses: GEOEDU_COURSES.length,
      experiments: GEOEDU_EXPERIMENTS.length,
    },
    runtime: 'openmaic',
  });
}
