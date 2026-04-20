export type SkillDto = {
  id: number
  name: string
  requiredLevel: number
  isRequired: boolean
}

export type MatchDto = {
  score: number
  recommendation: string
  missingSkills: SkillDto[]
}

export type VacancyListItemDto = {
  id: number
  title: string
  company: string
  description: string
  salaryFrom: number
  salaryTo: number
  workFormat: string
  status: string
}

export type VacancyDetailDto = {
  id: number
  title: string
  company: string
  description: string
  salaryFrom: number
  salaryTo: number
  workFormat: string
  status: string
  skills: SkillDto[]
  match?: MatchDto
}