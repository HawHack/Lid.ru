package mapper

import (
	"time"

	"hunter-platform/internal/domain"
	applicationdto "hunter-platform/internal/dto/application"
)

func MapCandidateApplicationItem(
	app domain.Application,
	vacancy applicationdto.VacancySummaryResponse,
	match *applicationdto.MatchSummaryResponse,
) applicationdto.CandidateApplicationItemResponse {
	return applicationdto.CandidateApplicationItemResponse{
		ID:        int64(app.ID),
		Status:    string(app.Status),
		CreatedAt: formatTime(app.CreatedAt),
		Vacancy:   vacancy,
		Match:     match,
	}
}

func MapEmployerApplicationItem(
	app domain.Application,
	candidate applicationdto.CandidateSummaryResponse,
	match *applicationdto.MatchSummaryResponse,
) applicationdto.EmployerApplicationItemResponse {
	return applicationdto.EmployerApplicationItemResponse{
		ID:        int64(app.ID),
		Status:    string(app.Status),
		CreatedAt: formatTime(app.CreatedAt),
		Candidate: candidate,
		Match:     match,
	}
}

func MapVacancySummary(
	v domain.Vacancy,
	company string,
) applicationdto.VacancySummaryResponse {
	return applicationdto.VacancySummaryResponse{
		ID:         int64(v.ID),
		Title:      v.Title,
		Company:    company,
		SalaryFrom: int(v.SalaryFrom),
		SalaryTo:   int(v.SalaryTo),
		WorkFormat: string(v.WorkFormat),
		Status:     applicationVacancyStatus(v.IsActive),
	}
}

func MapCandidateSummary(
	profile domain.CandidateProfile,
	skillNames []string,
) applicationdto.CandidateSummaryResponse {
	return applicationdto.CandidateSummaryResponse{
		UserID:          int64(profile.UserID),
		FullName:        profile.FullName,
		About:           profile.About,
		Location:        profile.Location,
		ExperienceYears: int(profile.ExperienceYears),
		WorkFormat:      string(profile.WorkFormat),
		Skills:          append([]string(nil), skillNames...),
	}
}

func MapMatchSummary(
	score int,
	recommendation string,
	missingSkills []applicationdto.SkillGapResponse,
) *applicationdto.MatchSummaryResponse {
	return &applicationdto.MatchSummaryResponse{
		Score:          score,
		Recommendation: recommendation,
		MissingSkills:  missingSkills,
	}
}

func MapSkillGaps(
	skills []domain.VacancySkill,
	skillNames map[uint64]string,
) []applicationdto.SkillGapResponse {
	result := make([]applicationdto.SkillGapResponse, 0, len(skills))

	for _, skill := range skills {
		result = append(result, applicationdto.SkillGapResponse{
			ID:            int64(skill.SkillID),
			Name:          skillNames[skill.SkillID],
			RequiredLevel: int(skill.RequiredLevel),
			IsRequired:    skill.IsRequired,
		})
	}

	return result
}

func MapApplicationStatus(app domain.Application) applicationdto.ApplicationStatusResponse {
	return applicationdto.ApplicationStatusResponse{
		ID:     int64(app.ID),
		Status: string(app.Status),
	}
}

func applicationVacancyStatus(isActive bool) string {
	if isActive {
		return "active"
	}

	return "archived"
}

func formatTime(t time.Time) string {
	if t.IsZero() {
		return ""
	}

	return t.UTC().Format(time.RFC3339)
}