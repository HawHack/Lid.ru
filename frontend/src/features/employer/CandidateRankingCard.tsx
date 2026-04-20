import type { Candidate, CandidateStatus } from "@/entities/vacancy/types";
import { CandidateStatusSelect } from "@/features/employer/CandidateStatusSelect";
import { SkillTag } from "@/shared/ui/SkillTag";
import { useTranslation } from "react-i18next";

type Props = {
  candidates: Candidate[];
  onStatusChange: (candidateId: number, status: CandidateStatus) => void;
};

export const CandidateRankingCard = ({
  candidates,
  onStatusChange,
}: Props) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-3xl border p-6 bg-white dark:bg-neutral-950 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">{t("candidateRanking")}</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {t("topCandidatesForThisVacancy")}
          </p>
        </div>

        <div className="text-sm text-neutral-500">
          {t("candidatesCount", { count: candidates.length })}
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="rounded-2xl border p-4 text-sm text-neutral-500">
          {t("noCandidatesYet")}
        </div>
      ) : (
        <div className="grid gap-4">
          {candidates.map((candidate, index) => (
            <article
              key={candidate.id}
              className="rounded-2xl border p-4 bg-neutral-50 dark:bg-neutral-900/40"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-semibold">
                      #{index + 1}
                    </span>
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  </div>

                  <p className="text-sm text-neutral-500">{candidate.title}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">{candidate.matchScore}%</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    {t("matchScore")}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {candidate.skills.length === 0 ? (
                  <span className="text-sm text-neutral-500">
                    {t("skillsNotSpecified")}
                  </span>
                ) : (
                  candidate.skills.slice(0, 8).map((skill) => (
                    <SkillTag
                      key={`${candidate.id}-${skill.id ?? skill.name}-${skill.name}`}
                      name={skill.name}
                      level={skill.level}
                      matched={skill.matched}
                    />
                  ))
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm text-neutral-500">
                  {t("currentStatus")}:{" "}
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {t(candidate.status)}
                  </span>
                </div>

                <div className="min-w-[220px]">
                  <CandidateStatusSelect
                    value={candidate.status}
                    onChange={(status) => onStatusChange(candidate.id, status)}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};