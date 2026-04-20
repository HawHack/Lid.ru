import type { Candidate } from "@/entities/vacancy/types";

export type CandidateInterviewKit = {
  brief: string;
  questions: string[];
  verifyAreas: string[];
  checklist: string[];
  riskFocus: string[];
};

export const buildCandidateInterviewKit = (
  candidate: Candidate
): CandidateInterviewKit => {
  const matchedSkills = candidate.skills
    .filter((skill) => skill.matched)
    .slice(0, 3)
    .map((skill) => skill.name);

  const missingSkills = candidate.skills
    .filter((skill) => skill.matched === false)
    .slice(0, 3)
    .map((skill) => skill.name);

  const brief = `${candidate.name} сейчас показывает ${candidate.matchScore}% совпадения с ролью. Самый сильный overlap заметен в ${
    matchedSkills.length > 0 ? matchedSkills.join(", ") : "ключевых требованиях вакансии"
  }. На интервью важно подтвердить реальный ownership, глубину практического опыта и понять, сможет ли кандидат уверенно справиться с ${
    missingSkills.length > 0 ? missingSkills.join(", ") : "менее подтверждёнными зонами роли"
  }.`;

  const questions = [
    `Расскажите о проекте, где вы использовали ${
      matchedSkills[0] || "свой самый сильный технический навык"
    } в реально значимой задаче.`,
    "Каким был самый сложный trade-off в поставке результата, с которым вы сталкивались в проекте?",
    missingSkills[0]
      ? `Как бы вы действовали, если ${missingSkills[0]} стал бы критически важным уже в первые недели работы?`
      : "Как вы обычно осваиваете навык, который становится важным очень быстро?",
    "Как вы взаимодействуете с product, design и engineering stakeholders под давлением сроков?",
    "Как выглядели бы ваши первые 30 дней в подобной роли?",
  ];

  const verifyAreas = [
    matchedSkills[0]
      ? `Проверьте глубину ${matchedSkills[0]}, а не только поверхностое знакомство.`
      : "Проверьте реальную глубину самой сильной зоны кандидата.",
    matchedSkills[1]
      ? `Уточните, использовался ли ${matchedSkills[1]} самостоятельно или при сильной внешней поддержке.`
      : "Уточните, насколько кандидат может работать самостоятельно по ключевым задачам.",
    missingSkills[0]
      ? `Проверьте, насколько реалистично кандидат сможет быстро усилить ${missingSkills[0]}.`
      : "Проверьте, насколько быстро кандидат адаптируется к новым или слабым зонам.",
  ];

  const checklist = [
    "assessOwnership",
    "assessCommunication",
    "assessDelivery",
    "assessLearningSpeed",
  ];

  const riskFocus =
    missingSkills.length > 0
      ? missingSkills.map(
          (skill) => `Проверьте уверенность, план обучения и стратегию работы вокруг ${skill}.`
        )
      : ["Проверьте стабильность, уровень seniority и качество поставки в условиях неопределённости."];

  return {
    brief,
    questions,
    verifyAreas,
    checklist,
    riskFocus,
  };
};