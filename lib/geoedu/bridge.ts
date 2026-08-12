import type { GenerateClassroomInput } from '@/lib/server/classroom-generation';

export interface GeoEduClassroomRequest {
  course: string;
  experimentTitle?: string;
  knowledgePoint?: string;
  dataSource?: string;
  tools?: string[];
  difficulty?: string;
  expectedOutputs?: string[];
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

function join(values?: string[]): string | undefined {
  const normalized = values?.map((value) => value.trim()).filter(Boolean);
  return normalized?.length ? normalized.join('、') : undefined;
}

/**
 * Map GeoEdu-Copilot's remote-sensing teaching semantics into OpenMAIC's
 * native classroom-generation contract. GeoEdu remains the domain source;
 * OpenMAIC provides orchestration, scenes, agents, media, PBL and persistence.
 */
export function buildGeoEduClassroomInput(
  input: GeoEduClassroomRequest,
): GenerateClassroomInput {
  const course = clean(input.course);
  if (!course) throw new Error('course is required');

  const requirement = [
    '你正在为 GeoEdu-Copilot 的自然资源遥感实践教学场景生成一间 OpenMAIC 多智能体课堂。',
    '课堂必须以真实遥感实践任务为主线，而不是泛化知识讲授。教师智能体负责方法与规范，助教/同伴智能体负责追问、纠错、结果解释和反思。',
    '优先组织为“任务导入—方法与数据—分步实践—错误诊断—结果解释—测验/检查—总结反思”的教学闭环；适合时使用幻灯片、测验、交互场景或 PBL。',
    '不要虚构专有数据、学生成绩或学校内部系统信息；未提供的参数应明确为待配置项。',
    '涉及遥感代码时，强调可复现的处理逻辑、输入输出与常见错误，不替学生直接完成整份作业。',
    `课程：${course}`,
    clean(input.experimentTitle) ? `实验任务：${clean(input.experimentTitle)}` : undefined,
    clean(input.knowledgePoint) ? `核心知识点：${clean(input.knowledgePoint)}` : undefined,
    clean(input.difficulty) ? `难度：${clean(input.difficulty)}` : undefined,
    clean(input.dataSource) ? `数据源：${clean(input.dataSource)}` : undefined,
    join(input.tools) ? `工具链：${join(input.tools)}` : undefined,
    clean(input.region) ? `研究区/实践区域：${clean(input.region)}` : undefined,
    join(input.expectedOutputs) ? `预期成果：${join(input.expectedOutputs)}` : undefined,
    clean(input.rubric) ? `评价依据：${clean(input.rubric)}` : undefined,
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
