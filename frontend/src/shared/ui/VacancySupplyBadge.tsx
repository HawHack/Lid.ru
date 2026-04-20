import { useTranslation } from "react-i18next";
import type { VacancySupply } from "@/features/employer/vacancyIntelligence";

type Props = {
  supply: VacancySupply;
};

const styles: Record<VacancySupply, string> = {
  healthy:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
  medium:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  low:
    "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800",
};

const keyMap: Record<VacancySupply, string> = {
  healthy: "healthySupply",
  medium: "mediumSupply",
  low: "lowSupply",
};

export const VacancySupplyBadge = ({ supply }: Props) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[supply]}`}
    >
      {t(keyMap[supply])}
    </span>
  );
};