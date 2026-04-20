import { useState } from "react";
import { Navbar } from "@/shared/ui/Navbar";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { AdminMetricsCards } from "@/features/admin/AdminMetricsCards";
import { AdminVacancyModerationList } from "@/features/admin/AdminVacancyModerationList";

const AdminPage = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const handleChanged = () => setReloadKey((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <SectionTitle eyebrow="Модерация" title="Контроль публикаций" subtitle="Следи за качеством вакансий, быстро принимай решение и держи ленту в аккуратном состоянии." />
          </section>

          <AdminMetricsCards reloadKey={reloadKey} />
          <AdminVacancyModerationList reloadKey={reloadKey} onChanged={handleChanged} />
        </div>
      </PageShell>
    </div>
  );
};

export default AdminPage;
