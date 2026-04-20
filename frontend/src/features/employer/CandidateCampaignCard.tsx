import type { Candidate, CandidateStatus } from "@/entities/vacancy/types";
import { useTranslation } from "react-i18next";
import { buildCandidateCampaignText } from "@/features/employer/campaigns";
import { useToastStore } from "@/app/store/useToastStore";
import { useEmployerShortlistStore } from "@/app/store/useEmployerShortlistStore";

type Props = {
  candidate: Candidate;
  onStatusChange: (candidateId: number, status: CandidateStatus) => void;
};

export const CandidateCampaignCard = ({
  candidate,
  onStatusChange,
}: Props) => {
  const { t } = useTranslation();
  const addToast = useToastStore((s) => s.addToast);
  const shortlistedIds = useEmployerShortlistStore((s) => s.shortlistedIds);
  const toggleShortlist = useEmployerShortlistStore((s) => s.toggleShortlist);

  const texts = buildCandidateCampaignText(candidate);
  const isShortlisted = shortlistedIds.includes(candidate.id);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(t("campaignReady"), "success");
    } catch {
      addToast(t("somethingWentWrong"), "error");
    }
  };

  const handleShortlist = () => {
    toggleShortlist(candidate.id);
    addToast(
      isShortlisted
        ? t("removedFromSaved")
        : t("candidateAddedToShortlist"),
      "success"
    );
  };

  const handleInvite = () => {
    onStatusChange(candidate.id, "interview");
    addToast(t("candidateInvited"), "success");
  };

  return (
    <div className="rounded-2xl border p-5 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 shadow-sm grid gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">{candidate.name}</h3>
        <p className="text-sm text-neutral-500">{candidate.title}</p>
      </div>

      <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
        <div className="text-sm text-neutral-500 mb-2">{t("bestNextAction")}</div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          {t(texts.bestActionKey)}
        </p>
      </div>

      <div className="grid gap-3">
        <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="font-medium">{t("recruiterMessage")}</div>
            <button
              onClick={() => handleCopy(texts.recruiterMessage)}
              className="px-3 py-2 rounded-xl border text-sm"
            >
              {t("copyMessage")}
            </button>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {texts.recruiterMessage}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-3">
          <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="font-medium">{t("inviteMessage")}</div>
              <button
                onClick={() => handleCopy(texts.inviteMessage)}
                className="px-3 py-2 rounded-xl border text-sm"
              >
                {t("copyMessage")}
              </button>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {texts.inviteMessage}
            </p>
          </div>

          <div className="rounded-xl border p-4 bg-white/80 dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="font-medium">{t("shortlistMessage")}</div>
              <button
                onClick={() => handleCopy(texts.shortlistMessage)}
                className="px-3 py-2 rounded-xl border text-sm"
              >
                {t("copyMessage")}
              </button>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {texts.shortlistMessage}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleShortlist}
          className={`px-4 py-2 rounded-xl text-white transition ${
            isShortlisted
              ? "bg-yellow-600 hover:bg-yellow-500"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {isShortlisted ? t("savedShort") : t("shortlistNow")}
        </button>

        <button
          onClick={handleInvite}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
        >
          {t("invitedToInterview")}
        </button>
      </div>
    </div>
  );
};