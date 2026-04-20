import type { Candidate } from "@/entities/vacancy/types";

export type CandidatePriority = "top" | "promising" | "risky";

export const getCandidatePriority = (score: number): CandidatePriority => {
  if (score >= 85) return "top";
  if (score >= 65) return "promising";
  return "risky";
};

export const sortCandidatesByScore = (candidates: Candidate[]) => {
  return [...candidates].sort((a, b) => b.matchScore - a.matchScore);
};

export const groupCandidatesByPriority = (candidates: Candidate[]) => {
  const sorted = sortCandidatesByScore(candidates);

  return {
    top: sorted.filter((candidate) => getCandidatePriority(candidate.matchScore) === "top"),
    promising: sorted.filter(
      (candidate) => getCandidatePriority(candidate.matchScore) === "promising"
    ),
    risky: sorted.filter((candidate) => getCandidatePriority(candidate.matchScore) === "risky"),
  };
};

export const groupCandidatesByStatus = (candidates: Candidate[]) => {
  return {
    new: candidates.filter((candidate) => candidate.status === "new"),
    reviewing: candidates.filter((candidate) => candidate.status === "reviewing"),
    interview: candidates.filter((candidate) => candidate.status === "interview"),
    rejected: candidates.filter((candidate) => candidate.status === "rejected"),
    hired: candidates.filter((candidate) => candidate.status === "hired"),
  };
};