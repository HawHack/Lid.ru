import { useTranslation } from "react-i18next";

export const CareerPulseCard = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border p-5 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm">
      <div className="text-sm text-neutral-500">{t("careerPulse")}</div>
      <div className="text-2xl font-bold mt-2">+1% каждую неделю</div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-3">
        {t("careerPulseDescription")}
      </p>
    </div>
  );
};