import type { Vacancy } from "@/entities/vacancy/types";
import { buildVacancyTrustInsight } from "@/features/admin/trust";
import { RiskBadge } from "@/shared/ui/RiskBadge";
import { useTranslation } from "react-i18next";

type Props = {
  vacancy: Vacancy;
};

export const AdminTrustVacancyCard = ({ vacancy }: Props) => {
  const { t } = useTranslation();
  const insight = buildVacancyTrustInsight(vacancy);

  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm grid gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{vacancy.title}</h3>
          <p className="text-sm text-neutral-500">{vacancy.company}</p>
        </div>

        <div className="text-right">
          <div className="text-sm text-neutral-500">{t("riskScore")}</div>
          <div className="text-3xl font-bold">{insight.riskScore}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <RiskBadge level={insight.riskLevel} />
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-medium">{t("trustFlags")}</div>
        <div className="flex flex-wrap gap-2">
          {insight.flags.map((flag) => (
            <span
              key={flag}
              className="px-2 py-1 rounded-md text-sm border bg-neutral-50 dark:bg-neutral-950"
            >
              {t(flag)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-medium">{t("moderationReasons")}</div>
        <div className="grid gap-2">
          {insight.reasons.map((reason) => (
            <div
              key={reason}
              className="rounded-xl border p-3 text-sm bg-neutral-50 dark:bg-neutral-950"
            >
              {t(reason)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};