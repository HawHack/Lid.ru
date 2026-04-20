import { useState } from "react";
import { createVacancy } from "@/entities/vacancy/api";
import { useToastStore } from "@/app/store/useToastStore";

type Props = {
  onCreated: () => void;
};

const parseSalary = (value: string): { salaryFrom: number; salaryTo: number } => {
  const numbers = value
    .split(/[^0-9]+/)
    .map((part) => Number(part))
    .filter((part) => Number.isFinite(part) && part > 0);

  if (numbers.length >= 2) {
    return { salaryFrom: numbers[0], salaryTo: numbers[1] };
  }

  if (numbers.length === 1) {
    return { salaryFrom: numbers[0], salaryTo: numbers[0] };
  }

  return { salaryFrom: 0, salaryTo: 0 };
};

export const CreateVacancyForm = ({ onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const skills = skillsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({ name, level: 3, matched: false }));

      const { salaryFrom, salaryTo } = parseSalary(salary);
      const created = await createVacancy({
        title,
        company,
        description,
        salaryFrom,
        salaryTo,
        workFormat: "remote",
        skills,
        ownerRole: "employer",
        insights: undefined,
        interviewPrep: undefined,
      });

      if (!created) {
        addToast("Не удалось создать вакансию", "error");
        return;
      }

      setTitle("");
      setCompany("");
      setSalary("");
      setDescription("");
      setSkillsInput("");
      onCreated();
      addToast("Вакансия создана", "success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
      <div className="grid gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Новая вакансия</h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Коротко и по делу: что за роль, какие задачи, какой стек и условия.</p>
      </div>

      <div className="mt-6 grid gap-4">
        <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" placeholder="Например, Go backend разработчик" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" placeholder="Название компании" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" placeholder="Например, 180000-250000" value={salary} onChange={(e) => setSalary(e.target.value)} required />
        <textarea className="min-h-36 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" placeholder="Опиши задачи, ожидания и условия работы простым языком." value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" placeholder="Go, PostgreSQL, Docker" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} required />
        <button type="submit" disabled={submitting} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
          {submitting ? "Сохраняем..." : "Создать вакансию"}
        </button>
      </div>
    </form>
  );
};
