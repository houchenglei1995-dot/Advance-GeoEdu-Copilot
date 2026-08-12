import { describe, expect, it } from 'vitest';
import { buildGeoEduClassroomInput } from './bridge';

describe('buildGeoEduClassroomInput', () => {
  it('maps remote-sensing teaching metadata into an OpenMAIC classroom requirement', () => {
    const result = buildGeoEduClassroomInput({
      course: '微波遥感',
      experimentTitle: '基于 Sentinel-1 的双极化植被指数实践实验',
      knowledgePoint: 'RVI / DpRVIc',
      dataSource: 'Sentinel-1 GRD VV/VH',
      tools: ['SNAP', 'GEE', 'Python'],
      difficulty: '中级',
      expectedOutputs: ['VV/VH 合成图', '植被指数图', '错误诊断记录'],
      rubric: '预处理规范25%;公式正确25%;结果解释25%;错误处理15%;反思10%',
      enableTTS: true,
    });

    expect(result.requirement).toContain('GeoEdu-Copilot');
    expect(result.requirement).toContain('课程：微波遥感');
    expect(result.requirement).toContain('核心知识点：RVI / DpRVIc');
    expect(result.requirement).toContain('数据源：Sentinel-1 GRD VV/VH');
    expect(result.requirement).toContain('工具链：SNAP、GEE、Python');
    expect(result.requirement).toContain('错误诊断');
    expect(result.enableTTS).toBe(true);
    expect(result.agentMode).toBe('generate');
  });

  it('rejects an empty course', () => {
    expect(() => buildGeoEduClassroomInput({ course: '   ' })).toThrow('course is required');
  });

  it('preserves explicit OpenMAIC feature switches', () => {
    const result = buildGeoEduClassroomInput({
      course: '热红外遥感',
      enableWebSearch: true,
      enableImageGeneration: false,
      enableVideoGeneration: true,
      enableTTS: false,
      agentMode: 'default',
    });

    expect(result.enableWebSearch).toBe(true);
    expect(result.enableImageGeneration).toBe(false);
    expect(result.enableVideoGeneration).toBe(true);
    expect(result.enableTTS).toBe(false);
    expect(result.agentMode).toBe('default');
  });
});
