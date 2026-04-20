import type { Vacancy } from "@/entities/vacancy/types";
import { buildVacancyIntelligence } from "@/features/employer/vacancyIntelligence";
import { useTranslation } from "react-i18next";

type Props = {
  vacancies: Vacancy[];
};

export const VacancyIntelligenceSummary = ({ vacancies }: Props) => {
  const { t } = useTranslation();

  const intelligence = vacancies.map(buildVacancyIntelligence);

  const avgHealth =
    intelligence.length > 0
      ? Math.round(
          intelligence.reduce((sum, item) => sum + item.healthScore, 0) /
            intelligence.length
        )
      : 0;

  const lowSupplyCount = intelligence.filter((item) => item.supply === "low").length;
  const weakCount = intelligence.filter((item) => item.quality === "weak").length;

  return (
    <div className="rounded-3xl border p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("vacancyIntelligence")}</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            {t("vacancyIntelligenceSummary")}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500">{t("healthScore")}</div>
            <div className="text-2xl font-bold mt-2">{avgHealth}</div>
          </div>

          <div className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500">{t("talentSupply")}</div>
            <div className="text-2xl font-bold mt-2">{lowSupplyCount}</div>
          </div>

          <div className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500">{t("qualityLevel")}</div>
            <div className="text-2xl font-bold mt-2">{weakCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};