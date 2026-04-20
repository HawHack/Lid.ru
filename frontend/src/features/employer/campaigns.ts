import type { Candidate } from "@/entities/vacancy/types";

export type CandidateCampaignText = {
  recruiterMessage: string;
  inviteMessage: string;
  shortlistMessage: string;
  bestActionKey: string;
};

export const buildCandidateCampaignText = (
  candidate: Candidate
): CandidateCampaignText => {
  const topMatched = candidate.skills
    .filter((skill) => skill.matched)
    .slice(0, 3)
    .map((skill) => skill.name);

  const recruiterMessage = `Здравствуйте, ${candidate.name}! Я посмотрел(а) ваш профиль и отметил(а) хорошее совпадение с нашей вакансией, особенно по направлениям ${topMatched.join(
    ", "
  ) || "ключевых требований роли"
}. Мне кажется, что ваш опыт может быть очень полезен для нашей текущей задачи найма.`;

  const inviteMessage = `Здравствуйте, ${candidate.name}! Спасибо за интерес к вакансии. По вашему профилю и match score я хотел(а) бы пригласить вас на следующий этап интервью. Особенно сильным выглядит ваш опыт в ${
    topMatched.join(", ") || "релевантных для роли навыках"
  }.`;

  const shortlistMessage = `Здравствуйте, ${candidate.name}! Мы добавили ваш профиль в shortlist, потому что ваш опыт показывает хорошее совпадение с ролью. Особенно мы отметили ваш опыт в ${
    topMatched.join(", ") || "ключевых навыках для этой позиции"
  }.`;

  const bestActionKey =
    candidate.matchScore >= 85
      ? "inviteStrongCandidate"
      : candidate.matchScore >= 65
      ? "moveToShortlist"
      : "prepareWarmOutreach";

  return {
    recruiterMessage,
    inviteMessage,
    shortlistMessage,
    bestActionKey,
  };
};