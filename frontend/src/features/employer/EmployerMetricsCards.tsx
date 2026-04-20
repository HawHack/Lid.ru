import { useEffect, useState } from "react";
import { getEmployerMetrics, type EmployerMetrics } from "@/entities/vacancy/api";

export const EmployerMetricsCards = () => {
  const [metrics, setMetrics] = useState<EmployerMetrics | null>(null);

  useEffect(() => {
    getEmployerMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Собираем показатели...</div>;
  }

  const cards = [
    { label: "Всего вакансий", value: metrics.totalVacancies },
    { label: "Активных", value: metrics.activeVacancies },
    { label: "Кандидатов", value: metrics.totalCandidates },
    { label: "Новых откликов", value: metrics.newCount },
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
