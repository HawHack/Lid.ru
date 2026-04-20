import type { Vacancy } from "@/entities/vacancy/types";
import { buildVacancyTrustInsight } from "@/features/admin/trust";

export const buildVacancyFeedback = (vacancy: Vacancy) => {
  const insight = buildVacancyTrustInsight(vacancy);

  const reasons = insight.reasons;
  const flags = insight.flags;

  const suggestions: string[] = [];

  if (flags.includes("flagShortDescription")) {
    suggestions.push("Добавьте более подробное описание задач и ожиданий.");
  }

  if (flags.includes("flagNoSalary")) {
    suggestions.push("Укажите прозрачную зарплатную вилку или ценностное предложение.");
  }

  if (flags.includes("flagTooManySkills")) {
    suggestions.push("Сократите список требований до ключевых навыков.");
  }

  if (flags.includes("flagWeakSignal")) {
    suggestions.push("Усилите описание роли и ценность позиции.");
  }

  const message = [
    "feedbackIntro",
    "",
    ...reasons.map((r) => `• ${r}`),
    "",
    "Рекомендации:",
    ...suggestions.map((s) => `• ${s}`),
    "",
    "feedbackOutro",
  ];

  return {
    message,
    rawText: message.join("\n"),
  };
};