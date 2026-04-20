import type { Vacancy } from "@/entities/vacancy/types";
import { buildVacancyFeedback } from "@/features/admin/feedback";
import { useTranslation } from "react-i18next";
import { useToastStore } from "@/app/store/useToastStore";

type Props = {
  vacancy: Vacancy;
};

export const AdminFeedbackComposer = ({ vacancy }: Props) => {
  const { t } = useTranslation();
  const addToast = useToastStore((s) => s.addToast);

  const feedback = buildVacancyFeedback(vacancy);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        feedback.message.map((line) => t(line)).join("\n")
      );
      addToast(t("feedbackCopied"), "success");
    } catch {
      addToast(t("somethingWentWrong"), "error");
    }
  };

  return (
    <div className="rounded-2xl border p-5 bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm grid gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{t("feedbackComposer")}</h3>
          <p className="text-sm text-neutral-500">
            {t("feedbackDescription")}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          {t("copyFeedback")}
        </button>
      </div>

      <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950 whitespace-pre-line text-sm text-neutral-700 dark:text-neutral-300">
        {feedback.message.map((line, index) => (
          <div key={index}>{t(line)}</div>
        ))}
      </div>
    </div>
  );
};