import type { Candidate, CandidateStatus } from "@/entities/vacancy/types";
import { groupCandidatesByStatus } from "@/features/employer/ranking";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { CandidateStatusSelect } from "@/features/employer/CandidateStatusSelect";
import { useTranslation } from "react-i18next";

type Props = {
  candidates: Candidate[];
  onStatusChange: (candidateId: number, status: CandidateStatus) => void;
};

export const CandidatePipelineBoard = ({
  candidates,
  onStatusChange,
}: Props) => {
  const { t } = useTranslation();
  const groups = groupCandidatesByStatus(candidates);

  const columns = [
    { key: "new", title: t("statusBoardNew"), items: groups.new },
    { key: "reviewing", title: t("statusBoardReviewing"), items: groups.reviewing },
    { key: "interview", title: t("statusBoardInterview"), items: groups.interview },
    { key: "rejected", title: t("statusBoardRejected"), items: groups.rejected },
    { key: "hired", title: t("statusBoardHired"), items: groups.hired },
  ] as const;

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">{t("pipelineBoard")}</h2>
      </div>

      <div className="grid xl:grid-cols-5 gap-4">
        {columns.map((column) => (
          <div
            key={column.key}
            className="rounded-2xl border p-4 bg-white dark:bg-neutral-900 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="font-medium">{column.title}</div>
              <span className="text-xs px-2 py-1 rounded-full border">
                {column.items.length}
              </span>
            </div>

            <div className="grid gap-3">
              {column.items.length === 0 ? (
                <div className="rounded-xl border p-3 text-sm text-neutral-500">
                  {t("noCandidatesInPipeline")}
                </div>
              ) : (
                column.items.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="rounded-xl border p-3 bg-neutral-50 dark:bg-neutral-950"
                  >
                    <div className="font-medium">{candidate.name}</div>

                    <div className="text-sm text-neutral-500 mt-1">
                      {candidate.title}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <StatusBadge status={candidate.status} />

                      <span className="text-sm font-semibold">
                        {candidate.matchScore}%
                      </span>
                    </div>

                    <div className="mt-3">
                      <CandidateStatusSelect
                        value={candidate.status}
                        onChange={(status) => onStatusChange(candidate.id, status)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};