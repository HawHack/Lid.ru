import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCandidateApplications } from "@/entities/vacancy/api";
import type { CandidateApplication } from "@/entities/vacancy/types";
import { Navbar } from "@/shared/ui/Navbar";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

const CandidateApplicationsPage = () => {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getCandidateApplications();
      setApplications(data);
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="space-y-6">
          <SectionTitle eyebrow="Кандидат" title="Мои отклики" subtitle="Следи за статусами и быстро возвращайся к нужным вакансиям." />

          {loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">Загрузка откликов...</div>
          ) : applications.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">Откликов пока нет.</div>
          ) : (
            <div className="grid gap-4">
              {applications.map((application) => (
                <article key={application.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="grid gap-2">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{application.company}</div>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight">{application.vacancyTitle}</h2>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/vacancy/${application.vacancyId}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
                        Открыть вакансию
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </PageShell>
    </div>
  );
};

export default CandidateApplicationsPage;
