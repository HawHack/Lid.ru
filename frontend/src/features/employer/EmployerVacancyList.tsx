import { useEffect, useState } from "react";
import type { Vacancy } from "@/entities/vacancy/types";
import { getEmployerVacancies } from "@/entities/vacancy/api";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useTranslation } from "react-i18next";
import { VacancyIntelligenceCard } from "@/features/employer/VacancyIntelligenceCard";
import { VacancyIntelligenceSummary } from "@/features/employer/VacancyIntelligenceSummary";

type Props = {
  reloadKey: number;
};

export const EmployerVacancyList = ({ reloadKey }: Props) => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);

    getEmployerVacancies().then((data) => {
      setVacancies(data);
      setLoading(false);
    });
  }, [reloadKey]);

  if (loading) {
    return <div>{t("loadingEmployerVacancies")}</div>;
  }

  return (
    <div className="grid gap-6">
      <VacancyIntelligenceSummary vacancies={vacancies} />

      <div className="grid gap-4">
        {vacancies.map((vacancy) => (
          <div
            key={vacancy.id}
            className="grid xl:grid-cols-[1.05fr_0.95fr] gap-4 rounded-3xl border p-5 bg-white dark:bg-neutral-900 shadow-sm"
          >
            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold">{vacancy.title}</h3>
                    <StatusBadge status={vacancy.status} />
                  </div>
                  <p className="text-sm text-neutral-500">{vacancy.company}</p>
                </div>

                <div className="font-medium">{vacancy.salary}</div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {vacancy.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {vacancy.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2 py-1 rounded-md text-sm border"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    navigate(`/employer/vacancies/${vacancy.id}/candidates`)
                  }
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
                >
                  {t("openRankingStudio")}
                </button>
              </div>
            </div>

            <VacancyIntelligenceCard vacancy={vacancy} />
          </div>
        ))}
      </div>
    </div>
  );
};