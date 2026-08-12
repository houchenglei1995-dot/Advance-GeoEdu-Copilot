'use client';

import { useMemo, useState, type FormEvent } from 'react';
import {
  findGeoEduExperiment,
  GEOEDU_CAPABILITY_DETAILS,
  GEOEDU_COURSES,
  GEOEDU_EXPERIMENTS,
  getGeoEduExperimentsForCourse,
} from '@/lib/geoedu/catalog';

type GenerationState = 'idle' | 'submitting' | 'running' | 'succeeded' | 'failed';

interface JobResponse {
  success: boolean;
  done?: boolean;
  status?: string;
  step?: string;
  progress?: number;
  message?: string;
  pollUrl?: string;
  pollIntervalMs?: number;
  error?: string;
  result?: { url?: string };
}

const CUSTOM_EXPERIMENT = '__custom__';
const firstExperiment = GEOEDU_EXPERIMENTS[0];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function GeoEduPage() {
  const [course, setCourse] = useState<string>(firstExperiment.course);
  const [experimentId, setExperimentId] = useState<string>(firstExperiment.id);
  const [customTitle, setCustomTitle] = useState('');
  const [customDataSource, setCustomDataSource] = useState('');
  const [knowledgePoint, setKnowledgePoint] = useState('');
  const [region, setRegion] = useState('');
  const [extraRequirement, setExtraRequirement] = useState('');
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [enableImageGeneration, setEnableImageGeneration] = useState(false);
  const [enableVideoGeneration, setEnableVideoGeneration] = useState(false);
  const [enableTTS, setEnableTTS] = useState(false);
  const [state, setState] = useState<GenerationState>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const [classroomUrl, setClassroomUrl] = useState('');

  const experiments = useMemo(() => getGeoEduExperimentsForCourse(course), [course]);
  const selectedExperiment =
    experimentId === CUSTOM_EXPERIMENT ? undefined : findGeoEduExperiment(experimentId);

  function handleCourseChange(nextCourse: string) {
    setCourse(nextCourse);
    const nextExperiment = getGeoEduExperimentsForCourse(nextCourse)[0];
    setExperimentId(nextExperiment?.id ?? CUSTOM_EXPERIMENT);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('正在创建课堂…');
    setProgress(2);
    setStep('initializing');
    setClassroomUrl('');

    try {
      const custom = experimentId === CUSTOM_EXPERIMENT;
      const response = await fetch('/api/geoedu/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(custom
            ? { course, experimentTitle: customTitle, dataSource: customDataSource }
            : { experimentId }),
          knowledgePoint,
          region,
          extraRequirement,
          enableWebSearch,
          enableImageGeneration,
          enableVideoGeneration,
          enableTTS,
          agentMode: 'generate',
        }),
      });

      const created = (await response.json()) as JobResponse;
      if (!response.ok || !created.success || !created.pollUrl) {
        throw new Error(created.error || '课堂生成任务创建失败');
      }

      setState('running');
      setMessage(created.message || 'OpenMAIC 正在生成课堂');
      const pollIntervalMs = created.pollIntervalMs ?? 5000;

      for (let attempt = 0; attempt < 120; attempt += 1) {
        await sleep(pollIntervalMs);
        const pollResponse = await fetch(created.pollUrl, { cache: 'no-store' });
        const job = (await pollResponse.json()) as JobResponse;

        if (!pollResponse.ok || !job.success) {
          throw new Error(job.error || '课堂生成状态读取失败');
        }

        setMessage(job.message || 'OpenMAIC 正在生成课堂');
        setProgress(job.progress ?? 0);
        setStep(job.step || 'running');

        if (job.done) {
          if (job.status === 'succeeded' && job.result?.url) {
            setClassroomUrl(job.result.url);
            setProgress(100);
            setStep('completed');
            setState('succeeded');
            setMessage('课堂已生成。');
            return;
          }
          throw new Error(job.error || '课堂生成失败');
        }
      }

      throw new Error('课堂生成时间较长，可稍后通过任务接口继续查看状态');
    } catch (error) {
      setState('failed');
      setMessage(error instanceof Error ? error.message : '课堂生成失败');
    }
  }

  const busy = state === 'submitting' || state === 'running';

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-700">
                Advance GeoEdu-Copilot · powered by OpenMAIC
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                自然资源遥感多智能体实践课堂
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                从 GeoEdu 课程与实验中选择任务，直接调用 OpenMAIC 生成课堂。实验的数据源、工具、成果要求和评分标准会自动带入。
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <a
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium"
                href="/"
              >
                OpenMAIC 通用入口
              </a>
              <a
                className="rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white"
                href="/api/geoedu/catalog"
              >
                查看教学目录 API
              </a>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="课程" value={String(GEOEDU_COURSES.length)} />
            <Metric label="实验" value={String(GEOEDU_EXPERIMENTS.length)} />
            <Metric label="课堂引擎" value="OpenMAIC" />
            <Metric label="目录版本" value="2026.08" />
          </div>
        </header>

        <div className="grid gap-7 lg:grid-cols-[1.25fr_0.75fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold">1. 选择课程和实验</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                选择已有实验会自动填入相关信息，也可以使用自定义任务。
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-medium">课程</span>
                <select
                  value={course}
                  onChange={(event) => handleCourseChange(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                >
                  {GEOEDU_COURSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium">实验</span>
                <select
                  value={experimentId}
                  onChange={(event) => setExperimentId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                >
                  {experiments.map((experiment) => (
                    <option key={experiment.id} value={experiment.id}>
                      {experiment.id} · {experiment.title}
                    </option>
                  ))}
                  <option value={CUSTOM_EXPERIMENT}>自定义实验任务</option>
                </select>
              </label>
            </div>

            {selectedExperiment ? (
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="font-medium text-slate-900">{selectedExperiment.title}</div>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <Info label="难度" value={selectedExperiment.difficulty} />
                  <Info label="工具" value={selectedExperiment.tools.join(' · ')} />
                  <Info label="数据源" value={selectedExperiment.dataSource} />
                  <Info
                    label="预期成果"
                    value={selectedExperiment.expectedOutputs.join(' · ')}
                  />
                </dl>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  评分标准：{selectedExperiment.rubric}
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  label="实验任务"
                  value={customTitle}
                  onChange={setCustomTitle}
                  placeholder="例如：基于 Sentinel-2 的作物长势分析"
                />
                <Field
                  label="数据源"
                  value={customDataSource}
                  onChange={setCustomDataSource}
                  placeholder="例如：Sentinel-2 L2A"
                />
              </div>
            )}

            <div className="mt-7 border-t border-slate-100 pt-6">
              <h2 className="text-lg font-semibold">2. 补充课堂要求</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="知识点"
                  value={knowledgePoint}
                  onChange={setKnowledgePoint}
                  placeholder="例如：RVI / DpRVIc、TVDI、随机森林"
                />
                <Field
                  label="研究区"
                  value={region}
                  onChange={setRegion}
                  placeholder="可选，例如：鲁西北平原"
                />
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium">补充要求</span>
                  <textarea
                    value={extraRequirement}
                    onChange={(event) => setExtraRequirement(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                    placeholder="例如：增加常见错误分析和结果解释。"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-100 pt-5 text-sm">
              <Toggle
                label="Web 检索"
                checked={enableWebSearch}
                onChange={setEnableWebSearch}
              />
              <Toggle
                label="图像生成"
                checked={enableImageGeneration}
                onChange={setEnableImageGeneration}
              />
              <Toggle
                label="视频生成"
                checked={enableVideoGeneration}
                onChange={setEnableVideoGeneration}
              />
              <Toggle label="课堂语音" checked={enableTTS} onChange={setEnableTTS} />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? '正在生成…' : '生成实践课堂'}
            </button>
          </form>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">可用课堂功能</h2>
              <div className="mt-4 space-y-4">
                {GEOEDU_CAPABILITY_DETAILS.map((capability) => (
                  <div key={capability.id}>
                    <div className="text-sm font-medium text-slate-900">{capability.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {capability.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">生成状态</h2>
              {state === 'idle' ? (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  选择实验并提交后，课堂生成进度会显示在这里。
                </p>
              ) : (
                <div className="mt-4 text-sm leading-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{step || state}</span>
                    <span className="tabular-nums text-slate-500">{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                  <p className="mt-3 text-slate-600">{message}</p>
                  {classroomUrl && (
                    <a
                      className="mt-4 inline-block font-medium text-emerald-700 underline underline-offset-4"
                      href={classroomUrl}
                    >
                      进入课堂
                    </a>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 leading-5 text-slate-700">{value}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
        placeholder={placeholder}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />
      <span>{label}</span>
    </label>
  );
}
