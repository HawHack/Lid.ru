import type { Vacancy } from "@/entities/vacancy/types";
import { FitBadge } from "@/shared/ui/FitBadge";
import { useTranslation } from "react-i18next";

type Props = {
  vacancy: Vacancy;
};

export const VacancyInsightsPanel = ({ vacancy }: Props) => {
  const { t } = useTranslation();

  if (!vacancy.insights) return null;

  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{t("whyThisMatch")}</h2>
        <FitBadge fit={vacancy.insights.fit} />
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {vacancy.insights.summary}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 bg-neutral-50 dark:bg-neutral-950">
          <h3 className="font-medium mb-2">{t("matchedSkills")}</h3>

          {vacancy.insights.matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {vacancy.insights.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md text-sm border bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">{t("noStrongMatchesYet")}</p>
          )}
        </div>

        <div className="rounded-xl border p-4 bg-neutral-50 dark:bg-neutral-950">
          <h3 className="font-medium mb-2">{t("missingSkills")}</h3>

          {vacancy.insights.missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {vacancy.insights.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md text-sm border bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">{t("noMajorGapsDetected")}</p>
          )}
        </div>
      </div>
    </div>
  );
};