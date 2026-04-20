import type { Vacancy } from "@/entities/vacancy/types";
import { buildLearningPath } from "@/entities/vacancy/lib";
import { useTranslation } from "react-i18next";

type Props = {
  vacancy: Vacancy;
};

export const VacancyLearningPath = ({ vacancy }: Props) => {
  const { t } = useTranslation();
  const steps = buildLearningPath(vacancy.skills);

  if (steps.length === 0) {
    return (
      <div className="rounded-2xl border p-5 bg-gradient-to-br from-green-50 to-white dark:from-neutral-900 dark:to-neutral-950 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">{t("recommendedNextSteps")}</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {t("noMajorMissingSkills")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-5 bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-950 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">{t("recommendedLearningPath")}</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
        {t("learningPathDescription")}
      </p>

      <div className="grid gap-3">
        {steps.map((step) => (
          <div
            key={step.order}
            className="rounded-xl border p-4 bg-white/70 dark:bg-neutral-950"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full border flex items-center justify-center text-sm font-semibold">
                {step.order}
              </div>

              <div>
                <div className="font-medium">{step.skill}</div>
                <div className="text-sm text-neutral-500 mt-1">
                  {step.action}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};