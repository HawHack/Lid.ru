import type { VacancyFit } from "@/entities/vacancy/types";
import { useTranslation } from "react-i18next";

type Props = {
  fit: VacancyFit;
};

const fitStyles: Record<VacancyFit, string> = {
  strong:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
  medium:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800",
  weak:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
};

export const FitBadge = ({ fit }: Props) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${fitStyles[fit]}`}
    >
      {t(fit)}
    </span>
  );
};