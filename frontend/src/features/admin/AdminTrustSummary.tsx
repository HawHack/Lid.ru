import type { Vacancy } from "@/entities/vacancy/types";
import { buildMarketplaceTrustSummary } from "@/features/admin/trust";
import { useTranslation } from "react-i18next";

type Props = {
  vacancies: Vacancy[];
};

export const AdminTrustSummary = ({ vacancies }: Props) => {
  const { t } = useTranslation();
  const summary = buildMarketplaceTrustSummary(vacancies);

  return (
    <div className="rounded-3xl border p-6 bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("marketplaceHealth")}</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            {t("marketplaceHealthDescription")}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500">{t("highRiskCount")}</div>
            <div className="text-2xl font-bold mt-2">{summary.highRisk}</div>
          </div>

          <div className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500">{t("mediumRiskCount")}</div>
            <div className="text-2xl font-bold mt-2">{summary.mediumRisk}</div>
          </div>

          <div className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500">{t("lowRiskCount")}</div>
            <div className="text-2xl font-bold mt-2">{summary.lowRisk}</div>
          </div>
        </div>
      </div>
    </div>
  );
};