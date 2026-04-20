import type { Vacancy } from "@/entities/vacancy/types";

type Props = {
  vacancies: Vacancy[];
};

export const FocusPlan = ({ vacancies }: Props) => {
  const topVacancies = [...vacancies]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Next best moves</h2>
      <p className="text-sm text-neutral-500 mb-4">
        A focused shortlist to act on this week.
      </p>

      {topVacancies.length === 0 ? (
        <div className="text-neutral-500">
          Save a few vacancies first to generate a focused action plan.
        </div>
      ) : (
        <div className="grid gap-3">
          {topVacancies.map((vacancy, index) => (
            <div
              key={vacancy.id}
              className="rounded-xl border p-4 bg-neutral-50 dark:bg-neutral-950"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full border flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>

                <div>
                  <div className="font-medium">{vacancy.title}</div>
                  <div className="text-sm text-neutral-500">
                    {vacancy.company} · {vacancy.matchScore}% match
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                    {vacancy.insights?.summary || "Strong opportunity to explore."}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};