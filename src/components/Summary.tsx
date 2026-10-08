import { BookOpen, Bookmark, CheckCircle2 } from 'lucide-react';

interface Props {
  total: number;
  reading: number;
  finished: number;
}

export default function Summary({ total, reading, finished }: Props) {
  const stats = [
    {
      label: 'Total Books',
      value: total,
      icon: BookOpen,
      color: 'text-slate-700',
      bg: 'bg-slate-100',
    },
    {
      label: 'Currently Reading',
      value: reading,
      icon: Bookmark,
      color: 'text-sky-700',
      bg: 'bg-sky-50',
    },
    {
      label: 'Finished',
      value: finished,
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm sm:p-4"
        >
          <div
            className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} ${stat.color} sm:h-10 sm:w-10`}
          >
            <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800 sm:mt-2.5">
            {stat.value}
          </div>
          <div className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
