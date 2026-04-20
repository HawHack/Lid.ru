import { useSavedVacanciesStore } from "@/app/store/useSavedVacanciesStore";
import { useToastStore } from "@/app/store/useToastStore";
import { useTranslation } from "react-i18next";

type Props = {
  vacancyId: number;
};

export const SaveVacancyButton = ({ vacancyId }: Props) => {
  const { t } = useTranslation();
  const savedIds = useSavedVacanciesStore((s) => s.savedIds);
  const toggleSaved = useSavedVacanciesStore((s) => s.toggleSaved);
  const addToast = useToastStore((s) => s.addToast);

  const isSaved = savedIds.includes(vacancyId);

  const handleClick = () => {
    toggleSaved(vacancyId);
    addToast(isSaved ? t("removedFromSaved") : t("addedToSaved"), "success");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
        isSaved
          ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/60"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
      }`}
    >
      {isSaved ? "В избранном" : "В избранное"}
    </button>
  );
};
