import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { CandidateProfile, Vacancy } from "@/entities/vacancy/types";
import { applyToVacancy, getCandidateProfile, getVacancyById } from "@/entities/vacancy/api";
import { MatchScoreCard } from "@/shared/ui/MatchScoreCard";
import { SkillTag } from "@/shared/ui/SkillTag";
import { Navbar } from "@/shared/ui/Navbar";
import { useToastStore } from "@/app/store/useToastStore";
import { SaveVacancyButton } from "@/shared/ui/SaveVacancyButton";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

const workFormatLabel = (value: string) => {
  if (value === "remote") return "Удалённо";
  if (value === "hybrid") return "Гибрид";
  if (value === "onsite") return "Офис";
  return value;
};

const VacancyPage = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [vacancyData, profileData] = await Promise.all([getVacancyById(id), getCandidateProfile()]);
      setVacancy(vacancyData);
      setProfile(profileData);
      setLoading(false);
    };

    void load();
  }, [id]);

  const matchedSkills = useMemo(() => {
    if (!profile || !vacancy) return [] as string[];
    const profileSkillNames = new Set(profile.skills.map((skill) => skill.name.toLowerCase()));
    return vacancy.skills.filter((skill) => profileSkillNames.has(skill.name.toLowerCase())).map((skill) => skill.name);
  }, [profile, vacancy]);

  const handleApply = async () => {
    if (!vacancy || submitting) return;
    setSubmitting(true);
    try {
      const result = await applyToVacancy(vacancy.id);
      if (result) {
        setApplied(true);
        addToast("Отклик отправлен", "success");
      } else {
        addToast("Не удалось отправить отклик", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Загрузка вакансии...</div>;
  }

  if (!vacancy) {
    return <div className="p-6">Вакансия не найдена.</div>;
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="grid gap-3">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{vacancy.company}</div>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight">{vacancy.title}</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm dark:border-slate-800 dark:bg-slate-900">{vacancy.salary}</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm dark:border-slate-800 dark:bg-slate-900">{workFormatLabel(vacancy.workFormat)}</span>
                  <StatusBadge status={vacancy.status} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SaveVacancyButton vacancyId={vacancy.id} />
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applied || submitting}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {applied ? "Отклик отправлен" : submitting ? "Отправляем..." : "Откликнуться"}
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-6">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <SectionTitle title="О вакансии" subtitle="Основные задачи, ожидания и общий контекст роли." />
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">{vacancy.description}</p>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <SectionTitle title="Ключевые навыки" subtitle="Стек и опыт, которые видны в описании вакансии." />
                <div className="mt-4 flex flex-wrap gap-2">
                  {vacancy.skills.length ? vacancy.skills.map((skill) => (
                    <SkillTag key={`${skill.id ?? skill.name}-${skill.name}`} name={skill.name} level={skill.level} matched={skill.matched} />
                  )) : <div className="text-sm text-slate-500">Навыки пока не указаны.</div>}
                </div>
              </section>
            </div>

            <div className="grid gap-6">
              <MatchScoreCard
                score={vacancy.matchScore}
                title="Соответствие"
                subtitle="Оценка собирается по описанию вакансии и данным твоего профиля."
              />

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <SectionTitle title="Что видно по твоему профилю" subtitle={profile ? "Краткая выжимка по текущему профилю кандидата." : "Заполни профиль, чтобы получать более точную картину."} />
                {profile ? (
                  <div className="mt-4 grid gap-4">
                    <div>
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{profile.title || "Должность не указана"}</div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{profile.location || "Город не указан"}</div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 8).map((skill) => (
                        <SkillTag key={`${skill.id ?? skill.name}-${skill.name}`} name={skill.name} level={skill.level} matched={matchedSkills.includes(skill.name)} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <SectionTitle title="Что подготовить к отклику" subtitle="Короткий практический список перед отправкой отклика." />
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">Проверь резюме: название роли и стек должны совпадать с вакансией.</li>
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">Подготовь 2–3 коротких примера проектов или задач по теме вакансии.</li>
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">Если не хватает части навыков, заранее продумай, как честно объяснить опыт и скорость входа в работу.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
};

export default VacancyPage;
