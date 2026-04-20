import { useTranslation } from "react-i18next";

type Props = {
  readinessScore: number;
  message: string;
};

export const CandidateReadinessHero = ({
  readinessScore,
  message,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[2rem] border p-8 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden relative">
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-500/10" />

      <div className="relative grid lg:grid-cols-[240px_1fr] gap-8 items-center">
        <div className="flex items-center justify-center">
          <div className="relative h-48 w-48 rounded-full bg-white dark:bg-neutral-950 border-8 border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-inner">
            <div className="absolute inset-3 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700" />
            <div className="text-center">
              <div className="text-5xl font-black">{readinessScore}</div>
              <div className="text-sm text-neutral-500">{t("readiness")}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="inline-flex w-fit px-3 py-1 rounded-full border text-xs uppercase tracking-[0.2em] text-neutral-500">
            аналитика роста
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            {t("growthDashboard")}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl leading-7">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};