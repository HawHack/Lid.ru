import type { Vacancy } from "@/entities/vacancy/types";
import { useTranslation } from "react-i18next";

type Props = {
  vacancy: Vacancy;
};

export const VacancyInterviewPrep = ({ vacancy }: Props) => {
  const { t } = useTranslation();

  if (!vacancy.interviewPrep) return null;

  const prep = vacancy.interviewPrep;

  return (
    <div className="rounded-2xl border p-5 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{t("interviewPrep")}</h2>

      <div className="grid gap-4">
        <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
          <h3 className="font-medium mb-2">{t("thirtySecondPitch")}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {prep.pitch}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
            <h3 className="font-medium mb-2">{t("likelyQuestions")}</h3>
            <ul className="grid gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              {prep.questions.map((question) => (
                <li key={question} className="flex gap-2">
                  <span>•</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
            <h3 className="font-medium mb-2">{t("strengthsToHighlight")}</h3>
            <ul className="grid gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              {prep.strengthsToHighlight.map((item) => (
                <li key={item} className="flex gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
            <h3 className="font-medium mb-2">{t("riskAreas")}</h3>
            <ul className="grid gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              {prep.riskAreas.map((item) => (
                <li key={item} className="flex gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
            <h3 className="font-medium mb-2">{t("readinessChecklist")}</h3>
            <ul className="grid gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              {prep.checklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};