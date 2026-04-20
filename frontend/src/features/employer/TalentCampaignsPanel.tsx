import type { Candidate, CandidateStatus } from "@/entities/vacancy/types";
import { useTranslation } from "react-i18next";
import { CandidateCampaignCard } from "@/features/employer/CandidateCampaignCard";

type Props = {
  candidates: Candidate[];
  onStatusChange: (candidateId: number, status: CandidateStatus) => void;
};

export const TalentCampaignsPanel = ({
  candidates,
  onStatusChange,
}: Props) => {
  const { t } = useTranslation();

  const topCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 2);

  if (topCandidates.length === 0) return null;

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">{t("talentCampaigns")}</h2>
        <p className="text-sm text-neutral-500 mt-1">
          {t("campaignDescription")}
        </p>
      </div>

      <div className="grid gap-4">
        {topCandidates.map((candidate) => (
          <CandidateCampaignCard
            key={candidate.id}
            candidate={candidate}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
};