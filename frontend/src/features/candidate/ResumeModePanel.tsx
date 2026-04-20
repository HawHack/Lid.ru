import { useTranslation } from "react-i18next";
import type { CandidateProfile } from "@/entities/vacancy/types";
import { buildResumeInsight } from "@/features/candidate/resumeMode";
import { useToastStore } from "@/app/store/useToastStore";

type Props = {
  profile: CandidateProfile | null;
};

export const ResumeModePanel = ({ profile }: Props) => {
  const { t } = useTranslation();
  const addToast = useToastStore((s) => s.addToast);

  const insight = buildResumeInsight(profile);

  if (!insight) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(insight.intro);
      addToast(t("copied"), "success");
    } catch {
      addToast(t("somethingWentWrong"), "error");
    }
  };

  return (
    <div className="rounded-3xl border p-6 bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("aiResumeMode")}</h2>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl">
            {t("resumeModeDescription")}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
        >
          {t("copyIntro")}
        </button>
      </div>

      <div className="grid gap-4 mt-6">
        <div className="rounded-2xl border p-5 bg-white/80 dark:bg-neutral-950">
          <div className="text-sm text-neutral-500 mb-1">{t("careerHeadline")}</div>
          <div className="text-xl font-semibold">{insight.headline}</div>
        </div>

        <div className="rounded-2xl border p-5 bg-white/80 dark:bg-neutral-950">
          <div className="text-sm text-neutral-500 mb-2">{t("aiResumeSummary")}</div>
          <p className="text-neutral-700 dark:text-neutral-300">{insight.summary}</p>
        </div>

        <div className="rounded-2xl border p-5 bg-white/80 dark:bg-neutral-950">
          <div className="text-sm text-neutral-500 mb-2">{t("thirtySecondIntro")}</div>
          <p className="text-neutral-700 dark:text-neutral-300">{insight.intro}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border p-5 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500 mb-3">{t("topStrengths")}</div>
            <div className="flex flex-wrap gap-2">
              {insight.strengths.map((item) => (
                <span
                  key={item}
                  className="px-3 py-2 rounded-xl border bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800 text-sm"
                >
                  {t(item)}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-5 bg-white/80 dark:bg-neutral-950">
            <div className="text-sm text-neutral-500 mb-3">{t("bestSignals")}</div>
            <div className="flex flex-wrap gap-2">
              {insight.signals.map((item) => (
                <span
                  key={item}
                  className="px-3 py-2 rounded-xl border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 text-sm"
                >
                  {t(item)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};