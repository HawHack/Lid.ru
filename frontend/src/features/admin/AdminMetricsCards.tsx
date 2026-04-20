import { useEffect, useState } from "react";
import { getAdminMetrics, type AdminMetrics } from "@/entities/vacancy/api";

type Props = {
  reloadKey: number;
};

export const AdminMetricsCards = ({ reloadKey }: Props) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);

  useEffect(() => {
    setMetrics(null);
    getAdminMetrics().then(setMetrics);
  }, [reloadKey]);

  if (!metrics) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Собираем показатели...</div>;
  }

  const cards = [
    { label: "Всего вакансий", value: metrics.totalVacancies },
    { label: "На модерации", value: metrics.pendingVacancies },
    { label: "Опубликованы", value: metrics.approvedVacancies },
    { label: "Отклонены", value: metrics.rejectedVacancies },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm text-slate-500 dark:text-slate-400">{card.label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{card.value}</div>
        </div>
      ))}
    </div>
  );
};
