import type {
  CandidateApplication,
  CandidateProfile,
  Vacancy,
} from "@/entities/vacancy/types";

export type SkillGapItem = {
  name: string;
  count: number;
};

export type MissionState = "done" | "in_progress" | "not_started";

export type CareerMission = {
  id: string;
  titleKey: string;
  value?: number;
  progress: number;
  target: number;
  state: MissionState;
};

export const calculateAverageMatch = (vacancies: Vacancy[]) => {
  if (vacancies.length === 0) return 0;

  return Math.round(
    vacancies.reduce((sum, vacancy) => sum + vacancy.matchScore, 0) / vacancies.length
  );
};

export const calculateReadinessScore = ({
  savedVacancies,
  applications,
  profile,
}: {
  savedVacancies: Vacancy[];
  applications: CandidateApplication[];
  profile: CandidateProfile | null;
}) => {
  const avgMatch = calculateAverageMatch(savedVacancies);
  const skillsScore = Math.min((profile?.skills.length || 0) * 8, 40);
  const applicationsScore = Math.min(applications.length * 10, 30);
  const matchScore = Math.min(Math.round(avgMatch * 0.3), 30);

  return Math.min(skillsScore + applicationsScore + matchScore, 100);
};

export const getTopSkillGaps = (vacancies: Vacancy[]): SkillGapItem[] => {
  const map = new Map<string, number>();

  vacancies.forEach((vacancy) => {
    vacancy.insights?.missingSkills.forEach((skill) => {
      map.set(skill, (map.get(skill) || 0) + 1);
    });
  });

  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

export const getFocusMessage = (score: number) => {
  if (score >= 80) {
    return "growthDashboardMessageStrong";
  }

  if (score >= 60) {
    return "growthDashboardMessageMedium";
  }

  return "growthDashboardMessageWeak";
};

export const getMomentumLevel = (score: number) => {
  if (score >= 80) return "strong";
  if (score >= 55) return "building";
  return "low";
};

export const getProfileStrength = (profile: CandidateProfile | null) => {
  if (!profile) return 0;

  let score = 0;
  if (profile.name.trim()) score += 15;
  if (profile.title.trim()) score += 15;
  if (profile.bio.trim().length >= 20) score += 20;
  if (profile.location.trim()) score += 10;
  if (profile.portfolioUrl.trim()) score += 20;
  score += Math.min(profile.skills.length * 4, 20);

  return Math.min(score, 100);
};

export const getActionReadiness = ({
  applications,
  savedVacancies,
}: {
  applications: CandidateApplication[];
  savedVacancies: Vacancy[];
}) => {
  const savedScore = Math.min(savedVacancies.length * 15, 45);
  const appliedScore = Math.min(applications.length * 20, 55);
  return Math.min(savedScore + appliedScore, 100);
};

export const getShortlistQuality = (savedVacancies: Vacancy[]) => {
  const avg = calculateAverageMatch(savedVacancies);
  return avg;
};

const getMissionState = (progress: number, target: number): MissionState => {
  if (progress >= target) return "done";
  if (progress > 0) return "in_progress";
  return "not_started";
};

export const buildCareerMissions = ({
  savedVacancies,
  applications,
  profile,
  topSkillGaps,
}: {
  savedVacancies: Vacancy[];
  applications: CandidateApplication[];
  profile: CandidateProfile | null;
  topSkillGaps: SkillGapItem[];
}) => {
  const missions: CareerMission[] = [
    {
      id: "save_roles",
      titleKey: "missionSaveVacancies",
      value: 3,
      progress: Math.min(savedVacancies.length, 3),
      target: 3,
      state: getMissionState(Math.min(savedVacancies.length, 3), 3),
    },
    {
      id: "apply_roles",
      titleKey: "missionApplyRoles",
      value: 2,
      progress: Math.min(applications.length, 2),
      target: 2,
      state: getMissionState(Math.min(applications.length, 2), 2),
    },
    {
      id: "improve_gap",
      titleKey: "missionImproveSkill",
      progress: topSkillGaps.length < 3 ? 1 : 0,
      target: 1,
      state: getMissionState(topSkillGaps.length < 3 ? 1 : 0, 1),
    },
    {
      id: "update_profile",
      titleKey: "missionUpdateProfile",
      progress: getProfileStrength(profile) >= 70 ? 1 : 0,
      target: 1,
      state: getMissionState(getProfileStrength(profile) >= 70 ? 1 : 0, 1),
    },
  ];

  return missions;
};