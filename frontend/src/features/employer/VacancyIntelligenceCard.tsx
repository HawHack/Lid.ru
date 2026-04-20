import type { Vacancy } from "@/entities/vacancy/types";
import { buildVacancyIntelligence } from "@/features/employer/vacancyIntelligence";
import { VacancyQualityBadge } from "@/shared/ui/VacancyQualityBadge";
import { VacancySupplyBadge } from "@/shared/ui/VacancySupplyBadge";
import { useTranslation } from "react-i18next";

type Props = {
  vacancy: Vacancy;
};

export const VacancyIntelligenceCard = ({ vacancy }: Props) => {
  const { t } = useTranslation();
  const intelligence = buildVacancyIntelligence(vacancy);

  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm grid gap-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold">{vacancy.title}</h3>
          <p className="text-sm text-neutral-500">{vacancy.company}</p>
        </div>

        <div className="text-right">
          <div className="text-sm text-neutral-500">{t("healthScore")}</div>
          <div className="text-3xl font-bold">{intelligence.healthScore}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <VacancyQualityBadge quality={intelligence.quality} />
        <VacancySupplyBadge supply={intelligence.supply} />
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {t(intelligence.summaryKey)}
        </div>
        <div className="text-sm text-neutral-500">
          {t(intelligence.supplyKey)}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-medium">{t("improvementIdeas")}</div>

        {intelligence.suggestions.length > 0 ? (
          <div className="grid gap-2">
            {intelligence.suggestions.map((item) => (
              <div
                key={item}
                className="rounded-xl border p-3 text-sm bg-neutral-50 dark:bg-neutral-950"
              >
                {t(item)}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-3 text-sm bg-neutral-50 dark:bg-neutral-950 text-neutral-500">
            {t("vacancyLooksHealthy")}
          </div>
        )}
      </div>
    </div>
  );
};