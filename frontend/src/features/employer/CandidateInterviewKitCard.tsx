import type { Candidate } from "@/entities/vacancy/types";
import { buildCandidateInterviewKit } from "@/features/employer/interviewKit";
import { useTranslation } from "react-i18next";
import { useToastStore } from "@/app/store/useToastStore";

type Props = {
  candidate: Candidate;
};

type CopySectionProps = {
  title: string;
  items?: string[];
  text?: string;
  onCopy: (payload: string) => void;
  copyLabel: string;
};

const CopySection = ({
  title,
  items,
  text,
  onCopy,
  copyLabel,
}: CopySectionProps) => {
  const payload = text || (items ? items.join("\n") : "");

  return (
    <div className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-950 grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="font-medium">{title}</div>
        <button
          onClick={() => onCopy(payload)}
          className="px-3 py-2 rounded-xl border text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          {copyLabel}
        </button>
      </div>

      {text ? (
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{text}</p>
      ) : (
        <ul className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          {items?.map((item) => (
            <li key={item} className="flex gap-2">
              <span>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const CandidateInterviewKitCard = ({ candidate }: Props) => {
  const { t } = useTranslation();
  const addToast = useToastStore((s) => s.addToast);

  const kit = buildCandidateInterviewKit(candidate);

  const handleCopy = async (payload: string) => {
    try {
      await navigator.clipboard.writeText(payload);
      addToast(t("interviewMaterialsReady"), "success");
    } catch {
      addToast(t("somethingWentWrong"), "error");
    }
  };

  return (
    <div className="rounded-3xl border p-5 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm grid gap-4">
      <div>
        <h3 className="text-xl font-semibold mb-1">{candidate.name}</h3>
        <p className="text-sm text-neutral-500">{candidate.title}</p>
      </div>

      <CopySection
        title={t("interviewerBrief")}
        text={kit.brief}
        onCopy={handleCopy}
        copyLabel={t("copyBrief")}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <CopySection
          title={t("suggestedQuestions")}
          items={kit.questions}
          onCopy={handleCopy}
          copyLabel={t("copyChecklist")}
        />

        <CopySection
          title={t("verifyAreas")}
          items={kit.verifyAreas}
          onCopy={handleCopy}
          copyLabel={t("copyChecklist")}
        />

        <CopySection
          title={t("evaluationChecklist")}
          items={kit.checklist.map((key) => t(key))}
          onCopy={handleCopy}
          copyLabel={t("copyChecklist")}
        />

        <CopySection
          title={t("riskFocus")}
          items={kit.riskFocus}
          onCopy={handleCopy}
          copyLabel={t("copyChecklist")}
        />
      </div>
    </div>
  );
};