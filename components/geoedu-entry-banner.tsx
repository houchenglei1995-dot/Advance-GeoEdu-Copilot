'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GeoEduEntryBanner() {
  const pathname = usePathname();
  if (pathname !== '/') return null;

  return (
    <div className="fixed right-5 bottom-5 z-[60] max-w-sm rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:right-7 sm:bottom-7">
      <div className="text-xs font-semibold tracking-wide text-emerald-700">
        Advance GeoEdu-Copilot
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900">自然资源遥感多智能体实践课堂</div>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        7 门课程、19 个实验预设，使用 OpenMAIC 多智能体课堂能力。
      </p>
      <Link
        href="/geoedu"
        className="mt-3 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
      >
        进入 GeoEdu 教学入口
      </Link>
    </div>
  );
}
