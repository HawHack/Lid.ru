export type Skill = {
  id?: number;
  name: string;
  level?: number;
  requiredLevel?: number;
  isRequired?: boolean;
  matched?: boolean;
};

export type VacancyStatus = "active" | "archived" | "pending" | "approved" | "rejected";
export type VacancyFit = "strong" | "medium" | "weak";

export type VacancyInsights = {
  matchedSkills: string[];
  missingSkills: string[];
  fit: VacancyFit;
  summary: string;
};

export type InterviewPrep = {
  questions: string[];
  strengthsToHighlight: string[];
  riskAreas: string[];
  pitch: string;
  checklist: string[];
};

export type MatchDetails = {
  score: number;
  recommendation: string;
  missingSkills: Skill[];
};

export type Vacancy = {
  id: number;
  title: string;
  company: string;
  salary: string;
  salaryFrom: number;
  salaryTo: number;
  workFormat: string;
  matchScore: number;
  description: string;
  skills: Skill[];
  ownerRole?: "candidate" | "employer" | "admin";
  status: VacancyStatus;
  insights?: VacancyInsights;
  interviewPrep?: InterviewPrep;
  match?: MatchDetails;
};

export type CandidateStatus =
  | "new"
  | "reviewing"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "hired";

export type Candidate = {
  id: number;
  name: string;
  title: string;
  matchScore: number;
  skills: Skill[];
  status: CandidateStatus;
};

export type CandidateProfile = {
  id: number;
  name: string;
  title: string;
  bio: string;
  location: string;
  portfolioUrl: string;
  skills: Skill[];
};

export type CandidateApplication = {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  company: string;
  status: CandidateStatus;
};
