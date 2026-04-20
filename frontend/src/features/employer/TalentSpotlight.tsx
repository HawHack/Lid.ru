import type { Candidate } from "@/entities/vacancy/types";
import { MatchScoreCard } from "@/shared/ui/MatchScoreCard";
import { SkillTag } from "@/shared/ui/SkillTag";
import { PriorityBadge } from "@/shared/ui/PriorityBadge";
import { getCandidatePriority } from "@/features/employer/ranking";
import { useTranslation } from "react-i18next";

type Props = {
  candidate: Candidate | null;
};

export const TalentSpotlight = ({ candidate }: Props) => {
  const { t } = useTranslation();

  if (!candidate) return null;

  const matchedSkills = candidate.skills.filter((skill) => skill.matched).slice(0, 4);
  const priority = getCandidatePriority(candidate.matchScore);

  return (
    <div className="rounded-3xl border p-6 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="grid gap-2">
          <div className="text-sm uppercase tracking-wide text-neutral-500">
            {t("talentSpotlight")}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold">{candidate.name}</h2>
            <PriorityBadge priority={priority} />
          </div>
          <div className="text-neutral-500">{candidate.title}</div>
        </div>

        <div className="w-56">
          <MatchScoreCard score={candidate.matchScore} />
        </div>
      </div>

      <div className="mt-5">
        <div className="text-sm font-medium mb-2">{t("bestCurrentMatch")}</div>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((skill) => (
            <SkillTag
              key={skill.name}
              name={skill.name}
              level={skill.level}
              matched={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};