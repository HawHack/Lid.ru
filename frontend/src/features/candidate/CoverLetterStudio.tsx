import { useTranslation } from "react-i18next";
import type { CandidateProfile, Vacancy } from "@/entities/vacancy/types";
import { buildCoverLetterInsight } from "@/features/candidate/coverLetter";
import { useToastStore } from "@/app/store/useToastStore";

type Props = {
  profile: CandidateProfile | null;
  vacancy: Vacancy;
};

type CopyBlockProps = {
  title: string;
  text: string;
  buttonLabel: string;
  onCopy: (text: string) => void;
};

const CopyBlock = ({ title, text, buttonLabel, onCopy }: CopyBlockProps) => {
  return (
    <div className="rounded-2xl border p-5 bg-white/80 dark:bg-neutral-950 grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>

        <button
          onClick={() => onCopy(text)}
          className="px-3 py-2 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm"
        >
          {buttonLabel}
        </button>
      </div>

      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-6">
        {text}
      </p>
    </div>
  );
};

export const CoverLetterStudio = ({ profile, vacancy }: Props) => {
  const { t } = useTranslation();
  const addToast = useToastStore((s) => s.addToast);

  const insight = buildCoverLetterInsight({ profile, vacancy });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(t("copiedText"), "success");
    } catch {
      addToast(t("somethingWentWrong"), "error");
    }
  };

  return (
    <div className="rounded-3xl border p-6 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{t("coverLetterStudio")}</h2>
        <p className="text-neutral-600 dark:text-neutral-300">
          {t("coverLetterDescription")}
        </p>
      </div>

      <div className="grid gap-4">
        <CopyBlock
          title={t("tailoredIntro")}
          text={insight.intro}
          buttonLabel={t("copyText")}
          onCopy={handleCopy}
        />

        <div className="grid lg:grid-cols-2 gap-4">
          <CopyBlock
            title={t("motivationNote")}
            text={insight.motivation}
            buttonLabel={t("copyText")}
            onCopy={handleCopy}
          />

          <CopyBlock
            title={t("valuePitch")}
            text={insight.valuePitch}
            buttonLabel={t("copyText")}
            onCopy={handleCopy}
          />
        </div>

        <CopyBlock
          title={t("shortOutreach")}
          text={insight.outreach}
          buttonLabel={t("copyText")}
          onCopy={handleCopy}
        />
      </div>
    </div>
  );
};