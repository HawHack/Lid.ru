import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/shared/ui/Navbar";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { useVacancies } from "@/entities/vacancy/hooks/useVacancies";
import { useSavedVacanciesStore } from "@/app/store/useSavedVacanciesStore";
import { getCandidateApplications, getCandidateProfile } from "@/entities/vacancy/api";
import type { CandidateApplication, CandidateProfile, Vacancy } from "@/entities/vacancy/types";

const getTopSkillGaps = (savedVacancies: Vacancy[], profile: CandidateProfile | null) => {
  const current = new Set((profile?.skills ?? []).map((skill) => skill.name.toLowerCase()));
  const counter = new Map<string, number>();

  for (const vacancy of savedVacancies) {
    for (const skill of vacancy.skills) {
      const normalized = skill.name.toLowerCase();
      if (current.has(normalized)) continue;
      counter.set(skill.name, (counter.get(skill.name) ?? 0) + 1);
    }
  }

  return [...counter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
};

const CandidateGrowthPage = () => {
  const { vacancies, loading } = useVacancies();
  const savedIds = useSavedVacanciesStore((s) => s.savedIds);
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [extraLoading, setExtraLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [applicationsData, profileData] = await Promise.all([getCandidateApplications(), getCandidateProfile()]);
      setApplications(applicationsData);
      setProfile(profileData);
      setExtraLoading(false);
    };

    void load();
  }, []);

  const savedVacancies = useMemo(() => vacancies.filter((vacancy) => savedIds.includes(vacancy.id)), [vacancies, savedIds]);
  const averageMatch = savedVacancies.length ? Math.round(savedVacancies.reduce((sum, vacancy) => sum + vacancy.matchScore, 0) / savedVacancies.length) : 0;
  const topSkillGaps = getTopSkillGaps(savedVacancies, profile);

  const stats = [
    { label: "В избранном", value: savedVacancies.length, hint: "Вакансии, которые ты сохранил" },
    { label: "Отклики", value: applications.length, hint: "Всего отправленных откликов" },
    { label: "Среднее соответствие", value: `${averageMatch}%`, hint: "По избранным вакансиям" },
    { label: "Навыков в профиле", value: profile?.skills.length ?? 0, hint: "Заполненность профиля" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <SectionTitle eyebrow="Кандидат" title="Развитие" subtitle="Короткая сводка по активности, избранным вакансиям и навыкам, которые стоит подтянуть." />
          </section>

          {loading || extraLoading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Собираем сводку...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.hint}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <SectionTitle title="Что делать дальше" subtitle="Самые полезные шаги на ближайшее время без лишней перегрузки." />
                  <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">Обнови профиль и уточни должность, если она звучит слишком общо.</li>
                    <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">Вернись к избранным вакансиям со средним и высоким соответствием и отправь отклик.</li>
                    <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">Подготовь короткое описание 2–3 проектов, которые чаще всего совпадают по стеку.</li>
                  </ul>
                </section>

                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <SectionTitle title="Навыки, которые чаще всего не хватает" subtitle="Подсказка по сохранённым вакансиям." />
                  {topSkillGaps.length ? (
                    <div className="mt-4 grid gap-3">
                      {topSkillGaps.map(([skill, count]) => (
                        <div key={skill} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                          <span className="font-medium">{skill}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{count} вакансий</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-sm text-slate-500">По текущему избранному выраженных пробелов не видно.</div>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </PageShell>
    </div>
  );
};

export default CandidateGrowthPage;
