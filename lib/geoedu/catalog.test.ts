import { describe, expect, it } from 'vitest';
import {
  findGeoEduExperiment,
  GEOEDU_COURSES,
  GEOEDU_EXPERIMENTS,
  getGeoEduExperimentsForCourse,
} from './catalog';

describe('GeoEdu teaching catalog', () => {
  it('contains the seven course groups and nineteen experiment presets', () => {
    expect(GEOEDU_COURSES).toHaveLength(7);
    expect(GEOEDU_EXPERIMENTS).toHaveLength(19);
  });

  it('keeps experiment ids unique', () => {
    const ids = GEOEDU_EXPERIMENTS.map((experiment) => experiment.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('filters experiments by course', () => {
    const microwave = getGeoEduExperimentsForCourse('微波遥感');
    expect(microwave.map((experiment) => experiment.id)).toEqual([
      'EXP-S1-008',
      'EXP-SAR-009',
      'EXP-INSAR-010',
    ]);
  });

  it('finds a preset by id', () => {
    expect(findGeoEduExperiment('EXP-LST-011')?.course).toBe('热红外遥感');
    expect(findGeoEduExperiment('UNKNOWN')).toBeUndefined();
  });
});
