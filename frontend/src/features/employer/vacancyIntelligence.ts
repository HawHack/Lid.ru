import type { Vacancy } from "@/entities/vacancy/types";

export type VacancyQuality = "strong" | "improvable" | "weak";
export type VacancySupply = "healthy" | "medium" | "low";

export type VacancyIntelligence = {
  healthScore: number;
  quality: VacancyQuality;
  supply: VacancySupply;
  summaryKey: string;
  supplyKey: string;
  suggestions: string[];
};

const parseSalaryMid = (salary: string) => {
  const nums = salary.match(/\d+/g)?.map(Number) || [];
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  return Math.round((nums[0] + nums[1]) / 2);
};

export const getVacancyHealthScore = (vacancy: Vacancy) => {
  let score = 0;

  if (vacancy.title.trim().length >= 5) score += 20;
  if (vacancy.description.trim().length >= 80) score += 25;
  if (vacancy.skills.length >= 2 && vacancy.skills.length <= 6) score += 20;
  if (parseSalaryMid(vacancy.salary) > 0) score += 15;
  if (vacancy.status === "approved") score += 20;

  return Math.min(score, 100);
};

export const getVacancyQuality = (healthScore: number): VacancyQuality => {
  if (healthScore >= 80) return "strong";
  if (healthScore >= 55) return "improvable";
  return "weak";
};

export const getVacancySupply = (vacancy: Vacancy): VacancySupply => {
  const missingCount = vacancy.skills.filter((skill) => skill.matched === false).length;
  const total = vacancy.skills.length;

  if (total === 0) return "medium";
  const ratio = missingCount / total;

  if (ratio >= 0.5) return "low";
  if (ratio >= 0.25) return "medium";
  return "healthy";
};

export const buildVacancySuggestions = (vacancy: Vacancy) => {
  const suggestions: string[] = [];

  if (vacancy.title.trim().length < 8) {
    suggestions.push("improveVacancyTitle");
  }

  if (vacancy.description.trim().length < 100) {
    suggestions.push("improveVacancyDescription");
  }

  if (vacancy.skills.length > 6 || vacancy.skills.length < 2) {
    suggestions.push("improveVacancySkills");
  }

  if (parseSalaryMid(vacancy.salary) <= 0) {
    suggestions.push("improveVacancySalary");
  }

  return suggestions.slice(0, 3);
};

export const buildVacancyIntelligence = (
  vacancy: Vacancy
): VacancyIntelligence => {
  const healthScore = getVacancyHealthScore(vacancy);
  const quality = getVacancyQuality(healthScore);
  const supply = getVacancySupply(vacancy);
  const suggestions = buildVacancySuggestions(vacancy);

  const summaryKey =
    quality === "strong"
      ? "vacancyLooksHealthy"
      : quality === "improvable"
      ? "vacancyNeedsTuning"
      : "vacancyNeedsBetterSignal";

  const supplyKey =
    supply === "healthy"
      ? "candidateMarketStrong"
      : supply === "medium"
      ? "candidateMarketBalanced"
      : "candidateMarketTight";

  return {
    healthScore,
    quality,
    supply,
    summaryKey,
    supplyKey,
    suggestions,
  };
};