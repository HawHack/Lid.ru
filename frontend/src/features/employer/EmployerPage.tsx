import { useState } from "react";
import { Navbar } from "@/shared/ui/Navbar";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { CreateVacancyForm } from "@/features/employer/CreateVacancyForm";
import { EmployerVacancyList } from "@/features/employer/EmployerVacancyList";
import { EmployerMetricsCards } from "@/features/employer/EmployerMetricsCards";

const EmployerPage = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const handleCreated = () => setReloadKey((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <SectionTitle eyebrow="Работодатель" title="Рабочее место работодателя" subtitle="Публикуй вакансии, смотри отклики и веди подбор без перегруженного интерфейса." />
          </section>

          <EmployerMetricsCards />
          <CreateVacancyForm onCreated={handleCreated} />
          <EmployerVacancyList reloadKey={reloadKey} />
        </div>
      </PageShell>
    </div>
  );
};

export default EmployerPage;
