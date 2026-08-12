import { apiSuccess } from '@/lib/server/api-response';
import {
  GEOEDU_COURSES,
  GEOEDU_OPENMAIC_CAPABILITIES,
  GEOEDU_SOURCE_REPOSITORY,
} from '@/lib/geoedu/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  return apiSuccess({
    integration: 'geoedu-openmaic',
    sourceRepository: GEOEDU_SOURCE_REPOSITORY,
    mode: 'read-only-upstream',
    courses: GEOEDU_COURSES,
    capabilities: GEOEDU_OPENMAIC_CAPABILITIES,
  });
}
