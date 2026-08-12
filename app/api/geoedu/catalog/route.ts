import { apiSuccess } from '@/lib/server/api-response';
import {
  GEOEDU_CAPABILITY_DETAILS,
  GEOEDU_COURSES,
  GEOEDU_EXPERIMENTS,
  GEOEDU_INTEGRATION_VERSION,
  GEOEDU_OPENMAIC_CAPABILITIES,
  GEOEDU_SOURCE_EXPERIMENTS_PATH,
  GEOEDU_SOURCE_REPOSITORY,
} from '@/lib/geoedu/catalog';
import { GEOEDU_CATALOG_SOURCE_COMMIT } from '@/lib/geoedu/source';

export const dynamic = 'force-dynamic';

export async function GET() {
  return apiSuccess({
    integration: 'geoedu-openmaic',
    integrationVersion: GEOEDU_INTEGRATION_VERSION,
    sourceRepository: GEOEDU_SOURCE_REPOSITORY,
    sourceExperimentsPath: GEOEDU_SOURCE_EXPERIMENTS_PATH,
    sourceCommit: GEOEDU_CATALOG_SOURCE_COMMIT,
    mode: 'read-only-upstream',
    counts: {
      courses: GEOEDU_COURSES.length,
      experiments: GEOEDU_EXPERIMENTS.length,
    },
    courses: GEOEDU_COURSES,
    experiments: GEOEDU_EXPERIMENTS,
    capabilities: GEOEDU_OPENMAIC_CAPABILITIES,
    capabilityDetails: GEOEDU_CAPABILITY_DETAILS,
  });
}
