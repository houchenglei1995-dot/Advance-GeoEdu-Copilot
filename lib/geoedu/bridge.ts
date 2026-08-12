import type { GenerateClassroomInput } from '@/lib/server/classroom-generation';
import { findGeoEduExperiment } from '@/lib/geoedu/catalog';

export interface GeoEduClassroomRequest {
  experimentId?: string;
  course?: string;
  experimentTitle?: string;
  knowledgePoint?: string;
  dataSource?: string;
  tools?: readonly string[];
  difficulty?: string;
  expectedOutputs?: readonly string[];
  rubric?: string;
  region?: string;
  extraRequirement?: string;
  enableWebSearch?: boolean;
  enableImageGeneration?: boolean;
  enableVideoGeneration?: boolean;
  enableTTS?: boolean;
  agentMode?: 'default' | 'generate';
}

function clean(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function join(values?: readonly string[]): string | undefined {
  const normalized = values?.map((value) => value.trim()).filter(Boolean);
  return normalized?.length ? normalized.join('、') : undefined;
}

/**
 * Map GeoEdu-Copilot teaching semantics into OpenMAIC's native classroom
 * generation contract. A caller can provide an experimentId alone, override
 * any preset field, or submit a completely custom course task.
 */
export function buildGeoEduClassroomInput(
  input: GeoEduClassroomRequest,
): GenerateClassroomInput {
  const experimentId = clean(input.experimentId);
  const experiment = findGeoEduExperiment(experimentId);

  if (experimentId && !experiment) {
    throw new Error(`unknown GeoEdu experiment: ${experimentId}`);
  }

  const course = clean(input.course) ?? experiment?.course;
  if (!course) {
    throw new Error('course or experimentId is required');
  }

  const experimentTitle = clean(input.experimentTitle) ?? experiment?.title;
  const dataSource = clean(input.dataSource) ?? experiment?.dataSource;
  const tools = join(input.tools) ?? join(experiment?.tools);
  const difficulty = clean(input.difficulty) ?? experiment?.difficulty;
  const expectedOutputs = join(input.expectedOutputs) ?? join(experiment?.expectedOutputs);
  const rubric = clean(input.rubric) ?? experiment?.rubric;

  const requirement = [
    '你正在为 GeoEdu-Copilot 的自然资源遥感实践教学场景生成一间 OpenMAIC 多智能体课堂。',
    '课堂必须以真实遥感实践任务为主线，而不是泛化知识讲授。教师智能体负责方法与规范，助教/同伴智能体负责追问、纠错、结果解释和反思。',
    '优先组织为“任务导入—方法与数据—分步实践—错误诊断—结果解释—测验/检查—总结反思”的教学闭环；适合时使用幻灯片、测验、交互场景或 PBL。',
    '不要虚构专有数据、学生成绩或学校内部系统信息；未提供的参数应明确为待配置项。',
    '涉及遥感代码时，强调可复现的处理逻辑、输入输出与常见错误，不替学生直接完成整份作业。',
    experimentId ? `GeoEdu 实验编号：${experimentId}` : undefined,
    `课程：${course}`,
    experimentTitle ? `实验任务：${experimentTitle}` : undefined,
    clean(input.knowledgePoint) ? `核心知识点：${clean(input.knowledgePoint)}` : undefined,
    difficulty ? `难度：${difficulty}` : undefined,
    dataSource ? `数据源：${dataSource}` : undefined,
    tools ? `工具链：${tools}` : undefined,
    clean(input.region) ? `研究区/实践区域：${clean(input.region)}` : undefined,
    expectedOutputs ? `预期成果：${expectedOutputs}` : undefined,
    rubric ? `评价依据：${rubric}` : undefined,
    clean(input.extraRequirement) ? `补充要求：${clean(input.extraRequirement)}` : undefined,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    requirement,
    ...(input.enableWebSearch != null ? { enableWebSearch: input.enableWebSearch } : {}),
    ...(input.enableImageGeneration != null
      ? { enableImageGeneration: input.enableImageGeneration }
      : {}),
    ...(input.enableVideoGeneration != null
      ? { enableVideoGeneration: input.enableVideoGeneration }
      : {}),
    ...(input.enableTTS != null ? { enableTTS: input.enableTTS } : {}),
    ...(input.agentMode ? { agentMode: input.agentMode } : { agentMode: 'generate' }),
  };
}
