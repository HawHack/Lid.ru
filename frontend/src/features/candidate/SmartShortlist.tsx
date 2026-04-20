import type { Vacancy } from "@/entities/vacancy/types";
import { useSavedVacanciesStore } from "@/app/store/useSavedVacanciesStore";
import { FitBadge } from "@/shared/ui/FitBadge";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GlassCard } from "@/shared/ui/GlassCard";

type Props = {
  vacancies: Vacancy[];
};

export const SmartShortlist = ({ vacancies }: Props) => {
  const savedIds = useSavedVacanciesStore((s) => s.savedIds);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const shortlist = vacancies
    .filter((vacancy) => savedIds.includes(vacancy.id))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  if (shortlist.length === 0) return null;

  return (
    <GlassCard className="p-6 bg-gradient-to-br from-yellow-50/80 via-white/80 to-amber-50/80 dark:from-neutral-900/70 dark:via-neutral-950/70 dark:to-neutral-900/70">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">{t("smartShortlist")}</h2>
          <p className="text-sm text-neutral-500">{t("shortlistDescription")}</p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-full border uppercase tracking-wide">
          {t("topPicks")}
        </span>
      </div>

      <div className="grid gap-3">
        {shortlist.map((vacancy) => (
          <button
            key={vacancy.id}
            onClick={() => navigate(`/vacancy/${vacancy.id}`)}
            className="rounded-2xl border p-4 text-left bg-white/70 dark:bg-neutral-950/70 hover:scale-[1.01] hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{vacancy.title}</div>
                <div className="text-sm text-neutral-500">{vacancy.company}</div>
              </div>

              <div className="flex items-center gap-3">
                {vacancy.insights && <FitBadge fit={vacancy.insights.fit} />}
                <span className="font-bold">{vacancy.matchScore}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
};