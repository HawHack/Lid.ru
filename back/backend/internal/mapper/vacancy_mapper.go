package mapper

import (
	"hunter-platform/internal/domain"
	vacancydto "hunter-platform/internal/dto/vacancy"
)

func MapVacancyListItem(v domain.Vacancy, company string) vacancydto.VacancyListItemResponse {
	return vacancydto.VacancyListItemResponse{
		ID:          int64(v.ID),
		Title:       v.Title,
		Company:     company,
		Description: v.Description,
		SalaryFrom:  int(v.SalaryFrom),
		SalaryTo:    int(v.SalaryTo),
		WorkFormat:  string(v.WorkFormat),
		Status:      vacancyStatus(v.IsActive),
	}
}

func MapVacancyDetail(
	v domain.Vacancy,
	company string,
	skills []domain.VacancySkill,
	skillNames map[uint64]string,
	match *vacancydto.MatchResponse,
) vacancydto.VacancyDetailResponse {
	return vacancydto.VacancyDetailResponse{
		ID:          int64(v.ID),
		Title:       v.Title,
		Company:     company,
		Description: v.Description,
		SalaryFrom:  int(v.SalaryFrom),
		SalaryTo:    int(v.SalaryTo),
		WorkFormat:  string(v.WorkFormat),
		Status:      vacancyStatus(v.IsActive),
		Skills:      MapVacancySkills(skills, skillNames),
		Match:       match,
	}
}

func MapVacancySkills(
	skills []domain.VacancySkill,
	skillNames map[uint64]string,
) []vacancydto.SkillResponse {
	result := make([]vacancydto.SkillResponse, 0, len(skills))

	for _, skill := range skills {
		result = append(result, vacancydto.SkillResponse{
			ID:            int64(skill.SkillID),
			Name:          skillNames[skill.SkillID],
			RequiredLevel: int(skill.RequiredLevel),
			IsRequired:    skill.IsRequired,
		})
	}

	return result
}

func MapMissingSkills(
	skills []domain.VacancySkill,
	skillNames map[uint64]string,
) []vacancydto.SkillResponse {
	return MapVacancySkills(skills, skillNames)
}

func vacancyStatus(isActive bool) string {
	if isActive {
		return "active"
	}

	return "archived"
}