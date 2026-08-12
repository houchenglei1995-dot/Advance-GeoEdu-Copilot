import { apiSuccess } from '@/lib/server/api-response';
import { GEOEDU_COURSES, GEOEDU_SOURCE_REPOSITORY } from '@/lib/geoedu/bridge';

export const dynamic = 'force-dynamic';

export async function GET() {
  return apiSuccess({
    integration: 'geoedu-openmaic',
    sourceRepository: GEOEDU_SOURCE_REPOSITORY,
    mode: 'read-only-upstream',
    courses: GEOEDU_COURSES,
    capabilities: [
      'multi-agent-classroom',
      'slides',
      'quiz',
      'interactive-scene',
      'pbl',
      'whiteboard',
      'tts',
      'document-parsing',
    ],
  });
}
