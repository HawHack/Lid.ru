import type { Candidate } from "@/entities/vacancy/types";
import { useTranslation } from "react-i18next";
import { CandidateInterviewKitCard } from "@/features/employer/CandidateInterviewKitCard";

type Props = {
  candidates: Candidate[];
};

export const EmployerInterviewKitPanel = ({ candidates }: Props) => {
  const { t } = useTranslation();

  const bestCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 2);

  if (bestCandidates.length === 0) return null;

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">{t("employerInterviewKit")}</h2>
        <p className="text-sm text-neutral-500 mt-1">
          {t("interviewKitDescription")}
        </p>
      </div>

      <div className="grid gap-4">
        {bestCandidates.map((candidate) => (
          <CandidateInterviewKitCard
            key={candidate.id}
            candidate={candidate}
          />
        ))}
      </div>
    </div>
  );
};