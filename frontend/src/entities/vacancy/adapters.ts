import type {
  CandidateApplication,
  CandidateProfile,
  Candidate,
  MatchDetails,
  Skill,
  Vacancy,
} from "./types";
import type {
  MatchDto,
  SkillDto,
  VacancyDetailDto,
  VacancyListItemDto,
} from "./dto";
import { buildInterviewPrep, buildVacancyInsights } from "./lib";

const formatSalary = (salaryFrom: number, salaryTo: number): string => {
  if (salaryFrom > 0 && salaryTo > 0) {
    return `${salaryFrom} - ${salaryTo}`
  }

  if (salaryFrom > 0) {
    return `from ${salaryFrom}`
  }

  if (salaryTo > 0) {
    return `up to ${salaryTo}`
  }

  return "salary not specified"
}

const mapSkillDto = (dto: SkillDto): Skill => ({
  id: dto.id,
  name: dto.name,
  level: dto.requiredLevel,
  requiredLevel: dto.requiredLevel,
  isRequired: dto.isRequired,
  matched: false,
})

const mapMatchDto = (dto: MatchDto): MatchDetails => ({
  score: dto.score,
  recommendation: dto.recommendation,
  missingSkills: dto.missingSkills.map(mapSkillDto),
})

export const mapVacancyListItemDto = (dto: VacancyListItemDto): Vacancy => {
  const skills: Skill[] = []
  const matchScore = 0

  return {
    id: dto.id,
    title: dto.title,
    company: dto.company,
    salary: formatSalary(dto.salaryFrom, dto.salaryTo),
    salaryFrom: dto.salaryFrom,
    salaryTo: dto.salaryTo,
    workFormat: dto.workFormat,
    matchScore,
    description: dto.description,
    skills,
    ownerRole: "candidate",
    status: dto.status as Vacancy["status"],
    insights: buildVacancyInsights(skills, matchScore),
    interviewPrep: buildInterviewPrep(dto.title, dto.company, skills, matchScore),
  }
}

export const mapVacancyDetailDto = (dto: VacancyDetailDto): Vacancy => {
  const skills = dto.skills.map(mapSkillDto)
  const matchScore = dto.match?.score ?? 0

  return {
    id: dto.id,
    title: dto.title,
    company: dto.company,
    salary: formatSalary(dto.salaryFrom, dto.salaryTo),
    salaryFrom: dto.salaryFrom,
    salaryTo: dto.salaryTo,
    workFormat: dto.workFormat,
    matchScore,
    description: dto.description,
    skills,
    ownerRole: "candidate",
    status: dto.status as Vacancy["status"],
    insights: buildVacancyInsights(skills, matchScore),
    interviewPrep: buildInterviewPrep(dto.title, dto.company, skills, matchScore),
    match: dto.match ? mapMatchDto(dto.match) : undefined,
  }
}

// Временные адаптеры оставлены для совместимости со старыми экранами.
// Они будут удалены после переноса candidate/employer flows на отдельные entities.

type LegacyCandidateDto = {
  id: number
  name: string
  title: string
  matchScore: number
  skills: Skill[]
  status: Candidate["status"]
}

type LegacyCandidateProfileDto = {
  id: number
  name: string
  title: string
  bio: string
  location: string
  portfolioUrl: string
  skills: Skill[]
}

type LegacyCandidateApplicationDto = {
  id: number
  vacancyId: number
  vacancyTitle: string
  company: string
  status: CandidateApplication["status"]
}

export const mapCandidateDto = (dto: LegacyCandidateDto): Candidate => ({
  id: dto.id,
  name: dto.name,
  title: dto.title,
  matchScore: dto.matchScore,
  skills: dto.skills,
  status: dto.status,
})

export const mapCandidateProfileDto = (
  dto: LegacyCandidateProfileDto
): CandidateProfile => ({
  id: dto.id,
  name: dto.name,
  title: dto.title,
  bio: dto.bio,
  location: dto.location,
  portfolioUrl: dto.portfolioUrl,
  skills: dto.skills,
})

export const mapCandidateApplicationDto = (
  dto: LegacyCandidateApplicationDto
): CandidateApplication => ({
  id: dto.id,
  vacancyId: dto.vacancyId,
  vacancyTitle: dto.vacancyTitle,
  company: dto.company,
  status: dto.status,
})