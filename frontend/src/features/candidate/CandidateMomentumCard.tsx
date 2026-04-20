import { useTranslation } from "react-i18next";

type Props = {
  level: "low" | "building" | "strong";
};

const levelStyles = {
  low: "from-red-50 to-white dark:from-neutral-900 dark:to-neutral-950",
  building:
    "from-yellow-50 to-white dark:from-neutral-900 dark:to-neutral-950",
  strong: "from-green-50 to-white dark:from-neutral-900 dark:to-neutral-950",
};

export const CandidateMomentumCard = ({ level }: Props) => {
  const { t } = useTranslation();

  const textKey =
    level === "strong"
      ? "momentumStrongText"
      : level === "building"
      ? "momentumBuildingText"
      : "momentumLowText";

  const labelKey =
    level === "strong"
      ? "momentumStrong"
      : level === "building"
      ? "momentumBuilding"
      : "momentumLow";

  return (
    <div
      className={`rounded-2xl border p-5 bg-gradient-to-br ${levelStyles[level]} shadow-sm`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-neutral-500">{t("momentum")}</div>
          <div className="text-2xl font-bold mt-1">{t(labelKey)}</div>
        </div>

        <div className="px-3 py-1 rounded-full border text-sm">
          {t(labelKey)}
        </div>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-4">
        {t(textKey)}
      </p>
    </div>
  );
};