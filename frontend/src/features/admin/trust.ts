import type { Vacancy } from "@/entities/vacancy/types";

export type VacancyRiskLevel = "high" | "medium" | "low";

export type VacancyTrustInsight = {
  riskScore: number;
  riskLevel: VacancyRiskLevel;
  flags: string[];
  reasons: string[];
};

const parseSalaryMid = (salary: string) => {
  const nums = salary.match(/\d+/g)?.map(Number) || [];
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  return Math.round((nums[0] + nums[1]) / 2);
};

export const getVacancyRiskScore = (vacancy: Vacancy) => {
  let score = 0;

  if (vacancy.description.trim().length < 80) score += 30;
  if (parseSalaryMid(vacancy.salary) <= 0) score += 20;
  if (vacancy.skills.length > 6) score += 20;
  if (vacancy.status === "pending") score += 15;
  if (vacancy.title.trim().length < 5) score += 15;

  return Math.min(score, 100);
};

export const getVacancyRiskLevel = (riskScore: number): VacancyRiskLevel => {
  if (riskScore >= 60) return "high";
  if (riskScore >= 30) return "medium";
  return "low";
};

export const buildVacancyTrustInsight = (
  vacancy: Vacancy
): VacancyTrustInsight => {
  const flags: string[] = [];
  const reasons: string[] = [];

  if (vacancy.description.trim().length < 80) {
    flags.push("flagShortDescription");
    reasons.push("reasonNeedsClarification");
  }

  if (parseSalaryMid(vacancy.salary) <= 0) {
    flags.push("flagNoSalary");
    reasons.push("reasonNeedsBetterTransparency");
  }

  if (vacancy.skills.length > 6) {
    flags.push("flagTooManySkills");
    reasons.push("reasonNeedsScopeReduction");
  }

  if (vacancy.status === "pending") {
    flags.push("flagPending");
  }

  const riskScore = getVacancyRiskScore(vacancy);
  const riskLevel = getVacancyRiskLevel(riskScore);

  if (riskScore >= 50) {
    flags.push("flagWeakSignal");
  }

  if (reasons.length === 0) {
    reasons.push("reasonReadyForApproval");
  }

  return {
    riskScore,
    riskLevel,
    flags: [...new Set(flags)],
    reasons: [...new Set(reasons)],
  };
};

export const buildMarketplaceTrustSummary = (vacancies: Vacancy[]) => {
  const insights = vacancies.map(buildVacancyTrustInsight);

  return {
    highRisk: insights.filter((item) => item.riskLevel === "high").length,
    mediumRisk: insights.filter((item) => item.riskLevel === "medium").length,
    lowRisk: insights.filter((item) => item.riskLevel === "low").length,
  };
};