import { Navbar } from "@/shared/ui/Navbar";
import { useVacancies } from "@/entities/vacancy/hooks/useVacancies";
import { useSavedVacanciesStore } from "@/app/store/useSavedVacanciesStore";
import { VacancyCard } from "@/widgets/vacancy_list/VacancyCard";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";

const SavedVacanciesPage = () => {
  const { vacancies, loading, error, reload } = useVacancies();
  const savedIds = useSavedVacanciesStore((s) => s.savedIds);

  const savedVacancies = vacancies.filter((vacancy) => savedIds.includes(vacancy.id)).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <SectionTitle eyebrow="Кандидат" title="Избранные вакансии" subtitle="Сюда попадают вакансии, которые стоит рассмотреть в первую очередь." />
          </section>

          {loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Загрузка избранного...</div>
          ) : error ? (
            <ErrorState title="Не удалось загрузить список" description="Попробуй обновить страницу или повторить запрос ещё раз." actionText="Повторить" onAction={reload} />
          ) : savedVacancies.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              Пока нет избранных вакансий.
            </div>
          ) : (
            savedVacancies.map((vacancy) => <VacancyCard key={vacancy.id} vacancy={vacancy} />)
          )}
        </div>
      </PageShell>
    </div>
  );
};

export default SavedVacanciesPage;
