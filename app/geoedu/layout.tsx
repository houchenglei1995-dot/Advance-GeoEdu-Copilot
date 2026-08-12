import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '自然资源遥感多智能体实践课堂',
  description:
    'GeoEdu-Copilot teaching semantics powered by the OpenMAIC multi-agent classroom runtime.',
};

export default function GeoEduLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
