import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navbar } from "@/shared/ui/Navbar";
import { getCandidateProfile, updateCandidateProfile } from "@/entities/vacancy/api";
import type { CandidateProfile } from "@/entities/vacancy/types";
import { SkillTag } from "@/shared/ui/SkillTag";
import { useToastStore } from "@/app/store/useToastStore";
import { PageShell } from "@/shared/ui/PageShell";
import { SectionTitle } from "@/shared/ui/SectionTitle";

type CandidateProfileForm = {
  name: string;
  title: string;
  location: string;
  bio: string;
  portfolioUrl: string;
};

const CandidateProfilePage = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [skillName, setSkillName] = useState("");
  const addToast = useToastStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateProfileForm>({
    defaultValues: {
      name: "",
      title: "",
      location: "",
      bio: "",
      portfolioUrl: "",
    },
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getCandidateProfile();
      if (data) {
        setProfile(data);
        reset({
          name: data.name,
          title: data.title,
          location: data.location,
          bio: data.bio,
          portfolioUrl: data.portfolioUrl,
        });
      }
      setLoading(false);
    };

    void load();
  }, [reset]);

  const onSubmit = async (values: CandidateProfileForm) => {
    setSubmitting(true);
    try {
      const nextProfile: CandidateProfile = {
        id: profile?.id ?? 0,
        name: values.name,
        title: values.title,
        location: values.location,
        bio: values.bio,
        portfolioUrl: values.portfolioUrl,
        skills: profile?.skills ?? [],
      };

      const updated = await updateCandidateProfile(nextProfile);
      if (updated) {
        setProfile(updated);
        addToast("Профиль сохранён", "success");
      } else {
        addToast("Не удалось сохранить профиль", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const addLocalSkill = () => {
    const value = skillName.trim();
    if (!value) return;
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.skills.some((skill) => skill.name.toLowerCase() === value.toLowerCase())) {
        addToast("Такой навык уже есть", "info");
        return prev;
      }
      return {
        ...prev,
        skills: [...prev.skills, { name: value, level: 3 }],
      };
    });
    setSkillName("");
  };

  if (loading) {
    return <div className="p-6">Загрузка профиля...</div>;
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-white">
      <Navbar />
      <PageShell>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <SectionTitle eyebrow="Кандидат" title="Профиль" subtitle="Заполни основные данные, чтобы резюме и отклики выглядели аккуратно и понятно." />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="font-medium">Полное имя</span>
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" {...register("name", { required: "Укажи имя", minLength: { value: 2, message: "Минимум 2 символа" } })} />
                {errors.name ? <span className="text-sm text-rose-600">{errors.name.message}</span> : null}
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">Желаемая должность</span>
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" {...register("title", { required: "Укажи должность", minLength: { value: 2, message: "Минимум 2 символа" } })} />
                {errors.title ? <span className="text-sm text-rose-600">{errors.title.message}</span> : null}
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">Город</span>
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" {...register("location", { required: "Укажи город" })} />
                {errors.location ? <span className="text-sm text-rose-600">{errors.location.message}</span> : null}
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">Ссылка на портфолио</span>
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" {...register("portfolioUrl")} placeholder="https://..." />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">О себе</span>
                <textarea className="min-h-36 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" {...register("bio", { required: "Коротко расскажи о себе", minLength: { value: 20, message: "Минимум 20 символов" } })} />
                {errors.bio ? <span className="text-sm text-rose-600">{errors.bio.message}</span> : null}
              </label>

              <button type="submit" disabled={submitting} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                {submitting ? "Сохраняем..." : "Сохранить профиль"}
              </button>
            </form>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <SectionTitle title="Навыки" subtitle="Добавь основной стек, чтобы быстрее оценивать релевантность вакансий." />
            <div className="mt-4 flex gap-3">
              <input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Например, React" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200" />
              <button type="button" onClick={addLocalSkill} className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">Добавить</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile?.skills?.length ? profile.skills.map((skill) => (
                <SkillTag key={`${skill.id ?? skill.name}-${skill.name}`} name={skill.name} level={skill.level} />
              )) : <div className="text-sm text-slate-500">Навыки пока не добавлены.</div>}
            </div>
          </section>
        </div>
      </PageShell>
    </div>
  );
};

export default CandidateProfilePage;
