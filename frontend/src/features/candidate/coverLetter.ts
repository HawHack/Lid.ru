import type { CandidateProfile, Vacancy } from "@/entities/vacancy/types";

export type CoverLetterInsight = {
  intro: string;
  motivation: string;
  valuePitch: string;
  outreach: string;
};

export const buildCoverLetterInsight = ({
  profile,
  vacancy,
}: {
  profile: CandidateProfile | null;
  vacancy: Vacancy;
}): CoverLetterInsight => {
  const name = profile?.name || "Кандидат";
  const title = profile?.title || "специалист";
  const location = profile?.location || "моего города";

  const topSkills =
    [...(profile?.skills || [])]
      .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
      .slice(0, 3)
      .map((skill) => skill.name) || [];

  const matchedSkills = vacancy.insights?.matchedSkills?.slice(0, 3) || [];
  const missingSkills = vacancy.insights?.missingSkills?.slice(0, 2) || [];

  const intro = `Здравствуйте! Меня зовут ${name}, я ${title.toLowerCase()} из ${location}.`;

  const motivation = matchedSkills.length
    ? `Меня заинтересовала эта вакансия, потому что мой опыт особенно хорошо совпадает с направлениями ${matchedSkills.join(", ")}.`
    : "Меня заинтересовала эта вакансия, потому что она соответствует моему профессиональному профилю и карьерному фокусу.";

  const valuePitch = topSkills.length
    ? `Мои сильные стороны — ${topSkills.join(", ")}. Я смогу быстро включиться в работу и принести практическую пользу команде.`
    : "Я умею быстро погружаться в задачи, выстраивать приоритеты и доводить работу до результата.";

  const outreach = missingSkills.length
    ? `Я также понимаю зоны роста, в частности ${missingSkills.join(", ")}, и готов быстро усилить эти компетенции в процессе работы.`
    : "Буду рад обсудить, как мой опыт и мотивация могут быть полезны вашей команде.";

  return {
    intro,
    motivation,
    valuePitch,
    outreach,
  };
};