import { useTranslation } from "react-i18next";
import type { VacancyRiskLevel } from "@/features/admin/trust";

type Props = {
  level: VacancyRiskLevel;
};

const styles: Record<VacancyRiskLevel, string> = {
  high: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
  medium:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800",
  low: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
};

const keyMap: Record<VacancyRiskLevel, string> = {
  high: "highRisk",
  medium: "mediumRisk",
  low: "lowRisk",
};

export const RiskBadge = ({ level }: Props) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[level]}`}
    >
      {t(keyMap[level])}
    </span>
  );
};