import { useEffect, useMemo, useState } from "react";
import type { Vacancy, VacancyStatus } from "@/entities/vacancy/types";
import { getAdminVacancies, updateVacancyStatus } from "@/entities/vacancy/api";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useToastStore } from "@/app/store/useToastStore";

type Props = {
  reloadKey: number;
  onChanged: () => void;
};

export const AdminVacancyModerationList = ({ reloadKey, onChanged }: Props) => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VacancyStatus | "all">("pending");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    setLoading(true);
    getAdminVacancies().then((data) => {
      setVacancies(data);
      setLoading(false);
    });
  }, [reloadKey]);

  const filteredVacancies = useMemo(() => {
    return filter === "all" ? vacancies : vacancies.filter((vacancy) => vacancy.status === filter);
  }, [vacancies, filter]);

  const applyStatus = async (vacancyId: number, status: VacancyStatus) => {
    setUpdatingId(vacancyId);
    try {
      const updated = await updateVacancyStatus(vacancyId, status);
      if (!updated) {
        addToast("Не удалось обновить статус вакансии", "error");
        return;
      }
      setVacancies((prev) => prev.map((vacancy) => (vacancy.id === vacancyId ? { ...vacancy, status } : vacancy)));
      onChanged();
      addToast("Статус вакансии обновлён", "success");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Загрузка модерации...</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === item ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              {item === "all" ? "Все" : item === "pending" ? "На модерации" : item === "approved" ? "Опубликованы" : "Отклонены"}
            </button>
          ))}
        </div>
      </div>

      {filteredVacancies.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">В этом разделе пока нет вакансий.</div>
      ) : (
        filteredVacancies.map((vacancy) => {
          const isUpdating = updatingId === vacancy.id;
          return (
            <article key={vacancy.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="grid gap-2">
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{vacancy.company}</div>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight">{vacancy.title}</h3>
                  </div>
                  <p className="max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{vacancy.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">{vacancy.salary}</span>
                    <StatusBadge status={vacancy.status} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={isUpdating} onClick={() => applyStatus(vacancy.id, "approved")} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">Опубликовать</button>
                  <button type="button" disabled={isUpdating} onClick={() => applyStatus(vacancy.id, "rejected")} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-60">Отклонить</button>
                  <button type="button" disabled={isUpdating} onClick={() => applyStatus(vacancy.id, "pending")} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">Вернуть на модерацию</button>
                </div>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
};
