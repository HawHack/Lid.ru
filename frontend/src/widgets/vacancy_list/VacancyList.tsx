import { useMemo, useState } from "react";
import { VacancyCard } from "@/widgets/vacancy_list/VacancyCard";
import { useVacancies } from "@/entities/vacancy/hooks/useVacancies";
import { ErrorState } from "@/shared/ui/ErrorState";

type SortMode = "best_match" | "salary" | "title";

const extractSalaryValue = (salary: string) => {
  const nums = salary.match(/\d+/g)?.map(Number) || [];
  return nums.length ? Math.max(...nums) : 0;
};

export const VacancyList = () => {
  const { vacancies, loading, error, reload } = useVacancies();
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [minMatch, setMinMatch] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("best_match");

  const filteredVacancies = useMemo(() => {
    const filtered = vacancies.filter((vacancy) => {
      const matchesSearch =
        vacancy.title.toLowerCase().includes(search.toLowerCase()) ||
        vacancy.company.toLowerCase().includes(search.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(search.toLowerCase());

      const matchesSkill =
        skillFilter.trim() === "" ||
        vacancy.skills.some((skill) => skill.name.toLowerCase().includes(skillFilter.toLowerCase()));

      const matchesScore = vacancy.matchScore >= minMatch;
      return matchesSearch && matchesSkill && matchesScore;
    });

    if (sortMode === "best_match") {
      return [...filtered].sort((a, b) => b.matchScore - a.matchScore);
    }

    if (sortMode === "title") {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, "ru"));
    }

    return [...filtered].sort((a, b) => extractSalaryValue(b.salary) - extractSalaryValue(a.salary));
  }, [vacancies, search, skillFilter, minMatch, sortMode]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Загрузка вакансий...</div>;
  }

  if (error) {
    return <ErrorState title="Не удалось загрузить вакансии" description="Попробуйте обновить список ещё раз." actionText="Повторить" onAction={reload} />;
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Подбор вакансий</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Фильтры простые: должность, стек и минимальное соответствие.</p>
          </div>

          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-950">
            <option value="best_match">Сначала самые подходящие</option>
            <option value="salary">Сначала выше доход</option>
            <option value="title">По названию</option>
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <input type="text" placeholder="Должность, компания или слово из описания" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" />
          <input type="text" placeholder="Навык или стек" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">Минимальное соответствие: {minMatch}%</div>
            <input type="range" min={0} max={100} step={1} value={minMatch} onChange={(e) => setMinMatch(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      </div>

      {filteredVacancies.length ? (
        filteredVacancies.map((vacancy) => <VacancyCard key={vacancy.id} vacancy={vacancy} />)
      ) : (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          По текущим фильтрам вакансий не найдено.
        </div>
      )}
    </section>
  );
};
