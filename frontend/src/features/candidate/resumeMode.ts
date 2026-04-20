import type { CandidateProfile, Skill, Vacancy } from "@/entities/vacancy/types";

export type ResumeInsight = {
  headline: string;
  summary: string;
  intro: string;
  strengths: string[];
  signals: string[];
  focusSkills: Skill[];
  pitch: string;
};

type BuildResumeInsightInput =
  | CandidateProfile
  | null
  | {
      profile: CandidateProfile | null;
      vacancy?: Vacancy | null;
    };

const getTopSkills = (profile: CandidateProfile | null): Skill[] => {
  return [...(profile?.skills || [])]
    .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
    .slice(0, 5);
};

export const buildResumeInsight = (
  input: BuildResumeInsightInput
): ResumeInsight => {
  const profile =
    input && typeof input === "object" && "profile" in input ? input.profile : input;

  const vacancy =
    input && typeof input === "object" && "profile" in input ? input.vacancy ?? null : null;

  const name = profile?.name || "Candidate";
  const targetRole = vacancy?.title || profile?.title || "Specialist";
  const location = profile?.location || "remote";

  const focusSkills = getTopSkills(profile);

  const strengths =
    focusSkills.length > 0
      ? focusSkills.map((skill) => skill.name)
      : vacancy?.skills?.slice(0, 3).map((skill) => skill.name) || [];

  const signals: string[] = [];

  if (profile?.title) {
    signals.push(profile.title);
  }

  if (profile?.location) {
    signals.push(profile.location);
  }

  if (vacancy?.company) {
    signals.push(vacancy.company);
  }

  if (vacancy?.workFormat) {
    signals.push(vacancy.workFormat);
  }

  const headline = `${name} — ${targetRole}`;

  const summary =
    strengths.length > 0
      ? `${name} focuses on ${strengths.join(", ")} and is aligned with ${targetRole}.`
      : `${name} is building a focused profile for ${targetRole}.`;

  const intro =
    strengths.length > 0
      ? `I am ${name}, a candidate with strengths in ${strengths.join(", ")}.`
      : `I am ${name}, a motivated candidate interested in ${targetRole}.`;

  const pitch =
    vacancy && strengths.length > 0
      ? `Core strengths: ${strengths.join(", ")}. Strong fit for ${vacancy.title}.`
      : strengths.length > 0
        ? `Core strengths: ${strengths.join(", ")}.`
        : `Motivated specialist with relevant background for ${targetRole}.`;

  return {
    headline,
    summary,
    intro,
    strengths,
    signals,
    focusSkills,
    pitch,
  };
};