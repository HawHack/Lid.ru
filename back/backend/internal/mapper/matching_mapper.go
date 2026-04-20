package mapper

import (
	applicationdto "hunter-platform/internal/dto/application"
	vacancydto "hunter-platform/internal/dto/vacancy"
	"hunter-platform/internal/domain"
	"hunter-platform/internal/matching"
)

func MapCandidateProfileToMatching(
	profile domain.CandidateProfile,
	skills []domain.CandidateSkill,
	skillNames map[uint64]string,
) matching.CandidateProfile {
	resultSkills := make([]matching.CandidateSkill, 0, len(skills))

	for _, skill := range skills {
		resultSkills = append(resultSkills, matching.CandidateSkill{
			SkillID: uint(skill.SkillID),
			Name:    skillNames[skill.SkillID],
			Level:   int(skill.Level),
		})
	}

	return matching.CandidateProfile{
		ID:              uint(profile.UserID),
		ExperienceYears: int(profile.ExperienceYears),
		WorkFormat:      mapWorkFormatToMatching(profile.WorkFormat),
		Skills:          resultSkills,
	}
}

func MapVacancyToMatching(
	vacancy domain.Vacancy,
	skills []domain.VacancySkill,
	skillNames map[uint64]string,
) matching.Vacancy {
	requirements := make([]matching.VacancySkillRequirement, 0, len(skills))

	for _, skill := range skills {
		requirements = append(requirements, matching.VacancySkillRequirement{
			SkillID:       uint(skill.SkillID),
			SkillName:     skillNames[skill.SkillID],
			RequiredLevel: int(skill.RequiredLevel),
			Weight:        weightByRequirement(skill.IsRequired),
			IsRequired:    skill.IsRequired,
			IsCritical:    false,
		})
	}

	return matching.Vacancy{
		ID:                uint(vacancy.ID),
		MinExperience:     0,
		WorkFormat:        mapWorkFormatToMatching(vacancy.WorkFormat),
		SkillRequirements: requirements,
	}
}

func MapMatchingResultToVacancyMatchResponse(
	result matching.MatchResult,
) *vacancydto.MatchResponse {
	return &vacancydto.MatchResponse{
		Score:          result.MatchScore,
		Recommendation: result.Recommendation,
		MissingSkills:  mapMissingSkillsToVacancyResponse(result.MissingSkills),
	}
}

func MapMatchingResultToApplicationMatchSummary(
	result matching.MatchResult,
) *applicationdto.MatchSummaryResponse {
	return &applicationdto.MatchSummaryResponse{
		Score:          result.MatchScore,
		Recommendation: result.Recommendation,
		MissingSkills:  mapMissingSkillsToApplicationResponse(result.MissingSkills),
	}
}

func mapMissingSkillsToVacancyResponse(
	missing []matching.MissingSkill,
) []vacancydto.SkillResponse {
	result := make([]vacancydto.SkillResponse, 0, len(missing))

	for _, skill := range missing {
		result = append(result, vacancydto.SkillResponse{
			ID:            int64(skill.SkillID),
			Name:          skill.SkillName,
			RequiredLevel: skill.RequiredLevel,
			IsRequired:    skill.IsRequired,
		})
	}

	return result
}

func mapMissingSkillsToApplicationResponse(
	missing []matching.MissingSkill,
) []applicationdto.SkillGapResponse {
	result := make([]applicationdto.SkillGapResponse, 0, len(missing))

	for _, skill := range missing {
		result = append(result, applicationdto.SkillGapResponse{
			ID:            int64(skill.SkillID),
			Name:          skill.SkillName,
			RequiredLevel: skill.RequiredLevel,
			IsRequired:    skill.IsRequired,
		})
	}

	return result
}

func mapWorkFormatToMatching(format domain.WorkFormat) matching.WorkFormat {
	switch format {
	case domain.WorkRemote:
		return matching.WorkFormatRemote
	case domain.WorkHybrid:
		return matching.WorkFormatHybrid
	case domain.WorkOffice:
		return matching.WorkFormatOffice
	case domain.WorkProject:
		return matching.WorkFormatProject
	default:
		return matching.WorkFormat("")
	}
}

func weightByRequirement(isRequired bool) float64 {
	if isRequired {
		return 2
	}

	return 1
}