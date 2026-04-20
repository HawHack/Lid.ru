import type { InterviewPrep, VacancyFit, VacancyInsights, Skill } from "./types";
import i18n from "@/i18n";

export const getVacancyFit = (score: number): VacancyFit => {
  if (score >= 80) return "strong";
  if (score >= 60) return "medium";
  return "weak";
};

export const buildLearningPath = (skills: Skill[]) => {
  const missing = skills.filter((skill) => skill.matched === false);

  return missing.slice(0, 3).map((skill, index) => ({
    order: index + 1,
    skill: skill.name,
    level: skill.level,
    action:
      index === 0
        ? i18n.t("buildMiniProject", { skill: skill.name })
        : index === 1
        ? i18n.t("strengthenCaseStudy", { skill: skill.name })
        : i18n.t("addPortfolioEvidence", { skill: skill.name }),
  }));
};

export const buildVacancyInsights = (
  skills: Skill[],
  score: number
): VacancyInsights => {
  const matchedSkills = skills
    .filter((skill) => skill.matched)
    .map((skill) => skill.name);

  const missingSkills = skills
    .filter((skill) => skill.matched === false)
    .map((skill) => skill.name);

  const fit = getVacancyFit(score);

  let summary = i18n.t("weakSummary");

  if (fit === "strong") {
    summary = i18n.t("strongSummary");
  } else if (fit === "medium") {
    summary = i18n.t("mediumSummary");
  }

  return {
    matchedSkills,
    missingSkills,
    fit,
    summary,
  };
};

export const buildInterviewPrep = (
  title: string,
  company: string,
  skills: Skill[],
  score: number
): InterviewPrep => {
  const matchedSkills = skills.filter((skill) => skill.matched).map((skill) => skill.name);
  const missingSkills = skills.filter((skill) => skill.matched === false).map((skill) => skill.name);
  const topMatched = matchedSkills.slice(0, 3);
  const topMissing = missingSkills.slice(0, 3);
  const fit = getVacancyFit(score);

  const language = i18n.language;

  const questions =
    language === "ru"
      ? [
          `Почему вас заинтересовала вакансия ${title} в компании ${company}?`,
          `Расскажите о проекте, где вы использовали ${topMatched[0] || "ваш основной стек"} на практике.`,
          "Как вы выстраиваете работу с дизайнерами, продакт-менеджерами и backend-разработчиками?",
          topMissing[0]
            ? `Как бы вы быстро вошли в ${topMissing[0]}, если этот навык стал бы критичным в первый месяц?`
            : "Как вы поддерживаете свои навыки в актуальном состоянии в быстро меняющейся команде?",
          "Расскажите о случае, когда вы улучшили производительность, удобство интерфейса или качество поставки.",
        ]
      : [
          `Why are you interested in the ${title} role at ${company}?`,
          `Tell us about a project where you used ${topMatched[0] || "your core frontend stack"} in production.`,
          "How do you approach collaboration with designers, product managers, and backend engineers?",
          topMissing[0]
            ? `How would you ramp up quickly on ${topMissing[0]} if it became critical in the first month?`
            : "How do you keep your frontend skills current in a fast-moving product team?",
          "Describe a time when you improved performance, usability, or delivery quality.",
        ];

  const strengthsToHighlight =
    language === "ru"
      ? [
          topMatched[0]
            ? `Покажите конкретные примеры вашего опыта с ${topMatched[0]}.`
            : "Покажите конкретные примеры вашей самой сильной технической стороны.",
          topMatched[1]
            ? `Свяжите ${topMatched[1]} с измеримыми результатами проекта.`
            : "Свяжите вашу техническую работу с измеримыми результатами.",
          `Объясните, как ваш опыт совпадает с бизнес-задачами ${company}.`,
        ]
      : [
          topMatched[0]
            ? `Show concrete evidence of your ${topMatched[0]} experience.`
            : "Show concrete evidence of your strongest frontend skill.",
          topMatched[1]
            ? `Connect ${topMatched[1]} to measurable project outcomes.`
            : "Connect your technical work to measurable outcomes.",
          `Explain how your background aligns with the business needs of ${company}.`,
        ];

  const riskAreas =
    topMissing.length > 0
      ? language === "ru"
        ? topMissing.map((skill) => `Подготовьте убедимый план развития по ${skill}.`)
        : topMissing.map((skill) => `Prepare a credible learning plan for ${skill}.`)
      : language === "ru"
      ? ["Подготовьте примеры, которые покажут глубину, самостоятельность и качество поставки."]
      : ["Prepare examples that prove depth, ownership, and delivery impact."];

  const pitch =
    fit === "strong"
      ? language === "ru"
        ? `Я хорошо подхожу на эту роль, потому что мой недавний опыт уже совпадает с ключевым стеком и ожиданиями по поставке для позиции ${title}. Я смогу быстро включиться в работу и опираться на реальные проекты как доказательство своей экспертизы.`
        : `I’m a strong fit for this role because my recent work already overlaps with the core stack and delivery expectations for ${title}. I can contribute quickly while bringing evidence from real projects.`
      : fit === "medium"
      ? language === "ru"
        ? "У меня уже есть важная часть нужного опыта, и я смогу приносить пользу с первых дней, параллельно быстро закрывая оставшиеся skill gaps."
        : "I already match an important part of this role and can contribute from day one, while I also have a clear plan to close the remaining skill gaps quickly."
      : language === "ru"
      ? "Мой профиль пока не идеально совпадает с ролью, но я могу показать сильные переносимые навыки, быструю обучаемость и понятный план закрытия ключевых пробелов."
      : "My current profile is not a perfect match yet, but I can clearly show transferable strengths, rapid learning ability, and a concrete plan to close the most important gaps.";

  const checklist =
    language === "ru"
      ? [
          "Подготовьте 2–3 истории из портфолио с измеримыми результатами.",
          "Будьте готовы объяснить архитектурные и технические решения.",
          "Подготовьте короткую самопрезентацию на первые 30 секунд.",
          topMissing[0]
            ? `Подготовьте практический план улучшения ${topMissing[0]}.`
            : "Покажите, как вы продолжаете учиться и развивать свой стек.",
          "Изучите компанию, продуктовый контекст и ценность для пользователя перед интервью.",
        ]
      : [
          "Prepare 2–3 portfolio stories with measurable outcomes.",
          "Be ready to explain architecture and technical decisions.",
          "Prepare a concise self-introduction for the first 30 seconds.",
          topMissing[0]
            ? `Have a practical plan for improving ${topMissing[0]}.`
            : "Show how you continue learning and improving your stack.",
          "Review the company, product context, and user value before the interview.",
        ];

  return {
    questions,
    strengthsToHighlight,
    riskAreas,
    pitch,
    checklist,
  };
};