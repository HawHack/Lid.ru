import { useTranslation } from "react-i18next";

type Props = {
  score: number;
  title?: string;
  subtitle?: string;
};

export const MatchScoreCard = ({ score, title, subtitle }: Props) => {
  const { t } = useTranslation();
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{title ?? t("match")}</div>
          {subtitle ? <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</div> : null}
        </div>
        <div className="text-2xl font-semibold tracking-tight">{safeScore}%</div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-slate-900 transition-all dark:bg-slate-100"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
};
