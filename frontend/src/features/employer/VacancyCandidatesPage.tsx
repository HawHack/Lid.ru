import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCandidatesByVacancy, updateCandidateStatus } from "@/entities/vacancy/api";
import type { Candidate, CandidateStatus } from "@/entities/vacancy/types";
import { Navbar } from "@/shared/ui/Navbar";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { MatchScoreCard } from "@/shared/ui/MatchScoreCard";
import { SkillTag } from "@/shared/ui/SkillTag";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { CandidateStatusSelect } from "@/features/employer/CandidateStatusSelect";
import { useToastStore } from "@/app/store/useToastStore";

const VacancyCandidatesPage = () => {
  const { id } = useParams<{ id: string }>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getCandidatesByVacancy(id);
      setCandidates(data.sort((a, b) => b.matchScore - a.matchScore));
      setLoading(false);
    };

    void load();
  }, [id]);

  const handleStatusChange = async (candidateId: number, status: CandidateStatus) => {
    if (!id) return;
    const result = await updateCandidateStatus(id, candidateId, status);
    if (!result) {
      addToast("Не удалось обновить статус кандидата", "error");
      return;
    }
    setCandidates((prev) => prev.map((candidate) => (candidate.id === candidateId ? { ...candidate, status } : candidate)));
    addToast("Статус кандидата обновлён", "success");
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="space-y-6">
          <SectionTitle eyebrow="Работодатель" title="Кандидаты по вакансии" subtitle="Смотри отклики, оценивай соответствие и переводи кандидатов по этапам." />

          {loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Загрузка кандидатов...</div>
          ) : candidates.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">Откликов по вакансии пока нет.</div>
          ) : (
            <div className="grid gap-4">
              {candidates.map((candidate) => (
                <article key={candidate.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                    <div className="grid gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight">{candidate.name}</h2>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{candidate.title}</p>
                        </div>
                        <StatusBadge status={candidate.status} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <SkillTag key={skill.name} name={skill.name} level={skill.level} />
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Статус</span>
                        <CandidateStatusSelect value={candidate.status} onChange={(status) => handleStatusChange(candidate.id, status)} />
                      </div>
                    </div>
                    <MatchScoreCard score={candidate.matchScore} title="Соответствие" subtitle="Насколько кандидат близок к роли по текущим сигналам." />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </PageShell>
    </div>
  );
};

export default VacancyCandidatesPage;
