import { useTranslation } from "react-i18next";
import type { VacancyQuality } from "@/features/employer/vacancyIntelligence";

type Props = {
  quality: VacancyQuality;
};

const styles: Record<VacancyQuality, string> = {
  strong:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
  improvable:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800",
  weak:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
};

const keyMap: Record<VacancyQuality, string> = {
  strong: "strongVacancy",
  improvable: "improvableVacancy",
  weak: "weakVacancy",
};

export const VacancyQualityBadge = ({ quality }: Props) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[quality]}`}
    >
      {t(keyMap[quality])}
    </span>
  );
};