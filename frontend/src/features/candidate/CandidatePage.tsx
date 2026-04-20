import { Navbar } from "@/shared/ui/Navbar";
import { PageShell } from "@/shared/ui/PageShell";
import { VacancyList } from "@/widgets/vacancy_list/VacancyList";
import { useVacancies } from "@/entities/vacancy/hooks/useVacancies";
import { useSavedVacanciesStore } from "@/app/store/useSavedVacanciesStore";
import { SectionTitle } from "@/shared/ui/SectionTitle";

const CandidatePage = () => {
  const { vacancies } = useVacancies();
  const savedIds = useSavedVacanciesStore((s) => s.savedIds);

  const stats = [
    { label: "Вакансий в выдаче", value: vacancies.length },
    { label: "В избранном", value: savedIds.length },
    { label: "Сильных совпадений", value: vacancies.filter((item) => item.matchScore >= 75).length },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <SectionTitle
              eyebrow="Кандидат"
              title="Подбор вакансий"
              subtitle="Смотри подходящие предложения, сохраняй интересные варианты и держи под рукой отклики."
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          <VacancyList />
        </div>
      </PageShell>
    </div>
  );
};

export default CandidatePage;
