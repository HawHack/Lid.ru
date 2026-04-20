import type { Vacancy } from "@/entities/vacancy/types";
import { MatchScoreCard } from "@/shared/ui/MatchScoreCard";
import { SkillTag } from "@/shared/ui/SkillTag";
import { useNavigate } from "react-router-dom";
import { SaveVacancyButton } from "@/shared/ui/SaveVacancyButton";

const workFormatLabel = (value: string) => {
  if (value === "remote") return "Удалённо";
  if (value === "hybrid") return "Гибрид";
  if (value === "onsite") return "Офис";
  return value;
};

type Props = {
  vacancy: Vacancy;
};

export const VacancyCard = ({ vacancy }: Props) => {
  const navigate = useNavigate();

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{vacancy.company}</div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{vacancy.title}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">{vacancy.salary}</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">{workFormatLabel(vacancy.workFormat)}</span>
          </div>
        </div>

        <div className="w-full max-w-[220px]">
          <MatchScoreCard score={vacancy.matchScore} title="Соответствие" />
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {vacancy.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {vacancy.skills.slice(0, 8).map((skill) => (
          <SkillTag key={`${skill.id ?? skill.name}-${skill.name}`} name={skill.name} level={skill.level} matched={skill.matched} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          onClick={() => navigate(`/vacancy/${vacancy.id}`)}
        >
          Смотреть вакансию
        </button>

        <SaveVacancyButton vacancyId={vacancy.id} />
      </div>
    </article>
  );
};
