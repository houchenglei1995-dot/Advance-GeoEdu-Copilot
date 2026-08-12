'use client';

import { useState, type FormEvent } from 'react';
import { GEOEDU_COURSES } from '@/lib/geoedu/catalog';

type GenerationState = 'idle' | 'submitting' | 'running' | 'succeeded' | 'failed';

interface JobResponse {
  success: boolean;
  done?: boolean;
  status?: string;
  message?: string;
  pollUrl?: string;
  error?: string;
  result?: { url?: string };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function GeoEduPage() {
  const [course, setCourse] = useState<string>(GEOEDU_COURSES[0]);
  const [experimentTitle, setExperimentTitle] = useState('');
  const [knowledgePoint, setKnowledgePoint] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [region, setRegion] = useState('');
  const [extraRequirement, setExtraRequirement] = useState('');
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [enableTTS, setEnableTTS] = useState(false);
  const [state, setState] = useState<GenerationState>('idle');
  const [message, setMessage] = useState('');
  const [classroomUrl, setClassroomUrl] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('正在把 GeoEdu 教学任务交给 OpenMAIC 多智能体课堂引擎…');
    setClassroomUrl('');

    try {
      const response = await fetch('/api/geoedu/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course,
          experimentTitle,
          knowledgePoint,
          dataSource,
          region,
          extraRequirement,
          enableWebSearch,
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

      for (let attempt = 0; attempt < 120; attempt += 1) {
        await sleep(5000);
        const pollResponse = await fetch(created.pollUrl, { cache: 'no-store' });
        const job = (await pollResponse.json()) as JobResponse;
        if (!pollResponse.ok || !job.success) {
          throw new Error(job.error || '课堂生成状态读取失败');
        }
        setMessage(job.message || 'OpenMAIC 正在生成课堂');

        if (job.done) {
          if (job.status === 'succeeded' && job.result?.url) {
            setClassroomUrl(job.result.url);
            setState('succeeded');
            setMessage('课堂已生成，可进入 OpenMAIC 多智能体课堂。');
            return;
          }
          throw new Error(job.error || '课堂生成失败');
        }
      }

      throw new Error('课堂生成时间过长，请稍后通过任务接口继续查看状态');
    } catch (error) {
      setState('failed');
      setMessage(error instanceof Error ? error.message : '课堂生成失败');
    }
  }

  const busy = state === 'submitting' || state === 'running';

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-700">
            GeoEdu-Copilot × OpenMAIC
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            自然资源遥感多智能体课堂
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            GeoEdu-Copilot 提供课程、实验与评价语义，OpenMAIC
            负责多智能体编排、课件、测验、交互场景、PBL、白板与语音等课堂能力。
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium">课程</span>
                <select
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                >
                  {GEOEDU_COURSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="实验任务"
                value={experimentTitle}
                onChange={setExperimentTitle}
                placeholder="如：Sentinel-1 双极化植被指数实验"
              />
              <Field
                label="核心知识点"
                value={knowledgePoint}
                onChange={setKnowledgePoint}
                placeholder="如：RVI / DpRVIc"
              />
              <Field
                label="数据源"
                value={dataSource}
                onChange={setDataSource}
                placeholder="如：Sentinel-1 GRD VV/VH"
              />
              <Field
                label="研究区/实践区域"
                value={region}
                onChange={setRegion}
                placeholder="可选"
              />

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium">补充教学要求</span>
                <textarea
                  value={extraRequirement}
                  onChange={(event) => setExtraRequirement(event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  placeholder="例如：重点训练错误诊断与结果解释，不直接给出完整代码答案。"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-sm">
              <Toggle
                label="启用 Web 检索"
                checked={enableWebSearch}
                onChange={setEnableWebSearch}
              />
              <Toggle label="启用课堂语音" checked={enableTTS} onChange={setEnableTTS} />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'OpenMAIC 正在生成…' : '生成多智能体课堂'}
            </button>
          </form>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">能力由 OpenMAIC 提供</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>多智能体教师、助教与学习同伴协作</li>
              <li>课件、测验、交互式场景与 PBL 任务</li>
              <li>白板讲解、课堂语音与媒体生成</li>
              <li>多模型路由、课堂持久化与异步任务管理</li>
              <li>GeoEdu 遥感课程语义与实验评价约束</li>
            </ul>

            {state !== 'idle' && (
              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6">
                <div className="font-medium">运行状态</div>
                <div className="mt-1 text-slate-600">{message}</div>
                {classroomUrl && (
                  <a
                    className="mt-4 inline-block font-medium text-emerald-700 underline underline-offset-4"
                    href={classroomUrl}
                  >
                    进入生成的课堂
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
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
