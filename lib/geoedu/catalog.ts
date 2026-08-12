export const GEOEDU_SOURCE_REPOSITORY =
  'https://github.com/houchenglei1995-dot/GeoEdu-Copilot';
export const GEOEDU_SOURCE_EXPERIMENTS_PATH = 'platform_data/experiments.csv';
export const GEOEDU_INTEGRATION_VERSION = '2026.08';

export const GEOEDU_COURSES = [
  '农情遥感监测',
  '遥感原理与应用',
  '微波遥感',
  '热红外遥感',
  '自然资源低空监测原理与应用',
  '遥感数字图像处理',
  '遥感影像深度学习与智能解译',
] as const;

export type GeoEduCourse = (typeof GEOEDU_COURSES)[number];

export interface GeoEduExperiment {
  id: string;
  course: GeoEduCourse;
  title: string;
  dataSource: string;
  tools: readonly string[];
  difficulty: '基础' | '中级' | '进阶';
  expectedOutputs: readonly string[];
  rubric: string;
}

export const GEOEDU_EXPERIMENTS = [
  {
    id: 'EXP-S2-001',
    course: '农情遥感监测',
    title: '基于 Sentinel-2 的农情遥感监测实践实验',
    dataSource: 'Sentinel-2 L2A 课程运行数据',
    tools: ['GEE', 'Python', 'QGIS'],
    difficulty: '中级',
    expectedOutputs: ['NDVI/EVI 时序曲线', '长势分区图', '实验报告'],
    rubric: '数据处理完整性30%;方法步骤规范性20%;图表表达20%;结果解释20%;反思10%',
  },
  {
    id: 'EXP-S2-002',
    course: '农情遥感监测',
    title: '多种植被指数对比与作物长势解释',
    dataSource: 'Sentinel-2 与 Landsat 8/9 课程运行数据',
    tools: ['Python', 'GEE'],
    difficulty: '基础',
    expectedOutputs: ['NDVI/EVI/RVI 对比图', '作物长势解释表'],
    rubric: '指数公式正确25%;流程完整25%;图表清晰20%;解释合理20%;反思10%',
  },
  {
    id: 'EXP-LU-003',
    course: '农情遥感监测',
    title: '基于随机森林的土地利用状态遥感监测',
    dataSource: 'Landsat 9 课程运行数据',
    tools: ['ENVI', 'Python', 'QGIS'],
    difficulty: '中级',
    expectedOutputs: ['分类图', '混淆矩阵', '精度评价', '制图成果'],
    rubric: '样本设计25%;分类流程25%;精度评价25%;制图规范15%;反思10%',
  },
  {
    id: 'EXP-DROUGHT-004',
    course: '农情遥感监测',
    title: '基于 TVDI 的农业干旱遥感监测',
    dataSource: 'Landsat 热红外课程运行数据',
    tools: ['Python', 'GEE'],
    difficulty: '进阶',
    expectedOutputs: ['NDVI-LST 特征空间', '干旱等级图', '分析报告'],
    rubric: '模型理解30%;数据处理25%;结果表达20%;解释与局限15%;反思10%',
  },
  {
    id: 'EXP-RS-005',
    course: '遥感原理与应用',
    title: '遥感成像机理与分辨率综合认知实验',
    dataSource: '多源光学影像课程运行数据',
    tools: ['QGIS', 'Python'],
    difficulty: '基础',
    expectedOutputs: ['分辨率对比图', '成像机理说明', '应用场景表'],
    rubric: '概念理解30%;数据观察25%;图表表达20%;应用解释15%;反思10%',
  },
  {
    id: 'EXP-CORR-006',
    course: '遥感原理与应用',
    title: '多源影像几何校正与大气校正实验',
    dataSource: 'Landsat/Sentinel 课程运行数据',
    tools: ['ENVI', 'Python'],
    difficulty: '中级',
    expectedOutputs: ['校正前后对比图', '参数记录表', '质量检查表'],
    rubric: '流程完整30%;参数规范25%;质量控制25%;记录表达20%',
  },
  {
    id: 'EXP-APP-007',
    course: '遥感原理与应用',
    title: '多时相遥感应用制图与变化识别',
    dataSource: '多时相 Sentinel/Landsat 运行数据',
    tools: ['Python', 'QGIS'],
    difficulty: '进阶',
    expectedOutputs: ['变化识别图', '变化统计表', '应用制图成果'],
    rubric: '数据一致性25%;变化方法25%;制图表达25%;结果解释15%;反思10%',
  },
  {
    id: 'EXP-S1-008',
    course: '微波遥感',
    title: '基于 Sentinel-1 的双极化植被指数实践实验',
    dataSource: 'Sentinel-1 GRD VV/VH 课程运行数据',
    tools: ['SNAP', 'GEE', 'Python'],
    difficulty: '中级',
    expectedOutputs: ['VV/VH 合成图', 'RVI 或 DpRVIc 指数图', '错误诊断记录'],
    rubric: '预处理规范25%;公式正确25%;结果解释25%;错误处理15%;反思10%',
  },
  {
    id: 'EXP-SAR-009',
    course: '微波遥感',
    title: 'SAR 图像几何畸变识别与解释',
    dataSource: 'Sentinel-1 GRD 课程运行数据',
    tools: ['SNAP', 'QGIS'],
    difficulty: '基础',
    expectedOutputs: ['斜距压缩/叠掩/阴影标注图', '解释短文'],
    rubric: '现象识别30%;原因解释30%;标注规范20%;案例反思20%',
  },
  {
    id: 'EXP-INSAR-010',
    course: '微波遥感',
    title: 'InSAR 干涉条纹与形变解释入门',
    dataSource: 'Sentinel-1 SLC 课程运行数据',
    tools: ['SNAP', 'Python'],
    difficulty: '进阶',
    expectedOutputs: ['干涉图', '相干性图', '形变解释记录'],
    rubric: '配准质量25%;相干性分析25%;结果解释25%;风险说明15%;反思10%',
  },
  {
    id: 'EXP-LST-011',
    course: '热红外遥感',
    title: '基于 Landsat 热红外数据的地表温度反演实验',
    dataSource: 'Landsat TIRS 课程运行数据',
    tools: ['Python', 'GEE'],
    difficulty: '进阶',
    expectedOutputs: ['亮温图', '地表温度图', '城市热环境解释'],
    rubric: '辐射定标25%;温度反演25%;图表表达20%;结果解释20%;反思10%',
  },
  {
    id: 'EXP-UHI-012',
    course: '热红外遥感',
    title: '城市热环境空间格局识别',
    dataSource: 'Landsat 与土地覆盖运行数据',
    tools: ['Python', 'QGIS'],
    difficulty: '中级',
    expectedOutputs: ['热岛强度分级图', '地表类型对照表'],
    rubric: '数据融合25%;空间分析25%;图表表达20%;解释20%;反思10%',
  },
  {
    id: 'EXP-UAV-013',
    course: '自然资源低空监测原理与应用',
    title: '无人机影像正射拼接与样方调查验证',
    dataSource: '脱敏无人机航片与样方记录',
    tools: ['OpenDroneMap', 'QGIS'],
    difficulty: '中级',
    expectedOutputs: ['正射影像', '样方点位图', '精度核查表'],
    rubric: '数据组织20%;拼接流程25%;样方验证25%;制图表达20%;反思10%',
  },
  {
    id: 'EXP-UAV-014',
    course: '自然资源低空监测原理与应用',
    title: '低空遥感自然资源图斑核查',
    dataSource: '脱敏航片与图斑核查记录',
    tools: ['QGIS', 'Python'],
    difficulty: '中级',
    expectedOutputs: ['图斑核查表', '异常点位图', '核查报告'],
    rubric: '核查规范30%;空间定位25%;证据表达25%;治理意识20%',
  },
  {
    id: 'EXP-RAD-015',
    course: '遥感数字图像处理',
    title: '多源影像辐射定标与大气校正',
    dataSource: 'Landsat/Sentinel 课程运行数据',
    tools: ['ENVI', 'Python'],
    difficulty: '基础',
    expectedOutputs: ['校正前后对比图', '参数记录表'],
    rubric: '流程完整30%;参数规范25%;对比分析25%;记录20%',
  },
  {
    id: 'EXP-CLS-016',
    course: '遥感数字图像处理',
    title: '监督分类与精度评价综合实验',
    dataSource: 'Sentinel-2 与样本点运行数据',
    tools: ['Python', 'QGIS'],
    difficulty: '中级',
    expectedOutputs: ['分类图', '混淆矩阵', '精度报告'],
    rubric: '样本均衡25%;分类流程25%;评价指标25%;制图15%;反思10%',
  },
  {
    id: 'EXP-DL-017',
    course: '遥感影像深度学习与智能解译',
    title: '遥感影像语义分割样本标注与模型训练',
    dataSource: '脱敏遥感影像切片与标注数据',
    tools: ['Python', 'PyTorch', 'QGIS'],
    difficulty: '进阶',
    expectedOutputs: ['样本切片', '训练日志', '分割结果图', '精度评价表'],
    rubric: '样本规范25%;模型流程25%;精度评价25%;结果解释15%;反思10%',
  },
  {
    id: 'EXP-DET-018',
    course: '遥感影像深度学习与智能解译',
    title: '低空遥感目标检测与智能解译实验',
    dataSource: '脱敏无人机影像与目标标注数据',
    tools: ['Python', 'YOLO', 'QGIS'],
    difficulty: '进阶',
    expectedOutputs: ['目标检测结果', '混淆矩阵', '错误样本分析'],
    rubric: '标注质量25%;模型训练25%;结果分析25%;泛化讨论15%;反思10%',
  },
  {
    id: 'EXP-XAI-019',
    course: '遥感影像深度学习与智能解译',
    title: '遥感智能解译结果可解释性分析',
    dataSource: '课程影像切片与模型输出记录',
    tools: ['Python', 'PyTorch'],
    difficulty: '中级',
    expectedOutputs: ['特征可视化图', '误差分析表', '解释报告'],
    rubric: '可解释方法25%;错误诊断25%;图表表达20%;应用边界20%;反思10%',
  },
] as const satisfies readonly GeoEduExperiment[];

export const GEOEDU_OPENMAIC_CAPABILITIES = [
  'multi-agent-classroom',
  'slides',
  'quiz',
  'interactive-scene',
  'pbl',
  'whiteboard',
  'tts',
  'document-parsing',
  'web-search',
  'image-generation',
  'video-export',
  'classroom-persistence',
] as const;

export const GEOEDU_CAPABILITY_DETAILS = [
  {
    id: 'multi-agent-classroom',
    label: '多智能体课堂',
    description: '教师、助教与学习同伴协作讲授、追问、纠错和讨论。',
  },
  {
    id: 'slides-quiz-pbl',
    label: '课件、测验与 PBL',
    description: '把遥感实验任务编排为讲授、检查和项目式学习场景。',
  },
  {
    id: 'whiteboard-media',
    label: '白板与多媒体',
    description: '支持白板、语音、图像及 OpenMAIC 原生媒体生成能力。',
  },
  {
    id: 'model-routing',
    label: '多模型路由',
    description: '沿用 OpenMAIC 的模型供应商、分阶段路由和推理配置。',
  },
  {
    id: 'persistence',
    label: '课堂持久化',
    description: '复用 OpenMAIC 的异步任务、课堂存储和播放运行时。',
  },
] as const;

export function findGeoEduExperiment(experimentId?: string): GeoEduExperiment | undefined {
  const normalized = experimentId?.trim();
  if (!normalized) return undefined;
  return GEOEDU_EXPERIMENTS.find((experiment) => experiment.id === normalized);
}

export function getGeoEduExperimentsForCourse(course?: string): readonly GeoEduExperiment[] {
  const normalized = course?.trim();
  if (!normalized) return GEOEDU_EXPERIMENTS;
  return GEOEDU_EXPERIMENTS.filter((experiment) => experiment.course === normalized);
}
