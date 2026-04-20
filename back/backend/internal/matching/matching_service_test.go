package matching

import (
	"context"
	"testing"
)

func TestMatchCandidateToVacancy_PerfectMatch(t *testing.T) {
	svc := NewDefaultService()

	vacancy := Vacancy{
		ID:            100,
		MinExperience: 3,
		WorkFormat:    WorkFormatRemote,
		SkillRequirements: []VacancySkillRequirement{
			{SkillID: 1, SkillName: "Go", RequiredLevel: 4, Weight: 5, IsRequired: true, IsCritical: true},
			{SkillID: 2, SkillName: "MySQL", RequiredLevel: 3, Weight: 3, IsRequired: true},
			{SkillID: 3, SkillName: "Redis", RequiredLevel: 2, Weight: 2, IsRequired: false},
		},
	}

	candidate := CandidateProfile{
		ID:              10,
		ExperienceYears: 5,
		WorkFormat:      WorkFormatRemote,
		Skills: []CandidateSkill{
			{SkillID: 1, Name: "Go", Level: 5},
			{SkillID: 2, Name: "MySQL", Level: 3},
			{SkillID: 3, Name: "Redis", Level: 2},
		},
	}

	res, err := svc.MatchCandidateToVacancy(context.Background(), vacancy, candidate)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if res.MatchScore < 95 {
		t.Fatalf("expected high score, got %d", res.MatchScore)
	}
	if res.Recommendation != "strong_match" {
		t.Fatalf("expected strong_match, got %s", res.Recommendation)
	}
	if len(res.MissingSkills) != 0 {
		t.Fatalf("expected no missing skills, got %d", len(res.MissingSkills))
	}
	if res.Breakdown.MissingCritical != 0 {
		t.Fatalf("expected missing critical = 0, got %d", res.Breakdown.MissingCritical)
	}
}

func TestMatchCandidateToVacancy_MissingCriticalSkillTriggersHardCap(t *testing.T) {
	svc := NewDefaultService()

	vacancy := Vacancy{
		ID:            200,
		MinExperience: 2,
		WorkFormat:    WorkFormatRemote,
		SkillRequirements: []VacancySkillRequirement{
			{SkillID: 1, SkillName: "Go", RequiredLevel: 4, Weight: 5, IsRequired: true, IsCritical: true},
			{SkillID: 2, SkillName: "MySQL", RequiredLevel: 3, Weight: 3, IsRequired: true},
			{SkillID: 3, SkillName: "Redis", RequiredLevel: 2, Weight: 2, IsRequired: false},
		},
	}

	candidate := CandidateProfile{
		ID:              20,
		ExperienceYears: 6,
		WorkFormat:      WorkFormatRemote,
		Skills: []CandidateSkill{
			{SkillID: 2, Name: "MySQL", Level: 5},
			{SkillID: 3, Name: "Redis", Level: 4},
		},
	}

	res, err := svc.MatchCandidateToVacancy(context.Background(), vacancy, candidate)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if res.Breakdown.MissingCritical != 1 {
		t.Fatalf("expected 1 missing critical, got %d", res.Breakdown.MissingCritical)
	}
	if res.MatchScore > DefaultConfig().HardCapWithOneCriticalMiss {
		t.Fatalf("expected score <= %d, got %d", DefaultConfig().HardCapWithOneCriticalMiss, res.MatchScore)
	}
	if res.Recommendation != "weak_match" && res.Recommendation != "moderate_match" {
		t.Fatalf("unexpected recommendation: %s", res.Recommendation)
	}
}

func TestMatchCandidateToVacancy_PartialCoverage(t *testing.T) {
	svc := NewDefaultService()

	vacancy := Vacancy{
		ID:            300,
		MinExperience: 3,
		WorkFormat:    WorkFormatHybrid,
		SkillRequirements: []VacancySkillRequirement{
			{SkillID: 1, SkillName: "Go", RequiredLevel: 4, Weight: 6, IsRequired: true},
			{SkillID: 2, SkillName: "MySQL", RequiredLevel: 4, Weight: 4, IsRequired: true},
		},
	}

	candidate := CandidateProfile{
		ID:              30,
		ExperienceYears: 3,
		WorkFormat:      WorkFormatRemote,
		Skills: []CandidateSkill{
			{SkillID: 1, Name: "Go", Level: 2},
			{SkillID: 2, Name: "MySQL", Level: 4},
		},
	}

	res, err := svc.MatchCandidateToVacancy(context.Background(), vacancy, candidate)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(res.MatchedSkills) != 2 {
		t.Fatalf("expected 2 matched skills, got %d", len(res.MatchedSkills))
	}

	var goMatched *MatchedSkill
	for i := range res.MatchedSkills {
		if res.MatchedSkills[i].SkillID == 1 {
			goMatched = &res.MatchedSkills[i]
			break
		}
	}
	if goMatched == nil {
		t.Fatal("go skill not found in matched skills")
	}
	if goMatched.Coverage >= 1.0 {
		t.Fatalf("expected partial coverage, got %.4f", goMatched.Coverage)
	}
	if res.MatchScore <= 0 || res.MatchScore >= 95 {
		t.Fatalf("expected moderate score, got %d", res.MatchScore)
	}
}

func TestMatchCandidatesToVacancy_SortsDescending(t *testing.T) {
	svc := NewDefaultService()

	vacancy := Vacancy{
		ID:            400,
		MinExperience: 2,
		WorkFormat:    WorkFormatRemote,
		SkillRequirements: []VacancySkillRequirement{
			{SkillID: 1, SkillName: "Go", RequiredLevel: 4, Weight: 5, IsRequired: true, IsCritical: true},
			{SkillID: 2, SkillName: "MySQL", RequiredLevel: 3, Weight: 3, IsRequired: true},
		},
	}

	candidates := []CandidateProfile{
		{
			ID:              1,
			ExperienceYears: 1,
			WorkFormat:      WorkFormatOffice,
			Skills: []CandidateSkill{
				{SkillID: 1, Name: "Go", Level: 2},
			},
		},
		{
			ID:              2,
			ExperienceYears: 4,
			WorkFormat:      WorkFormatRemote,
			Skills: []CandidateSkill{
				{SkillID: 1, Name: "Go", Level: 5},
				{SkillID: 2, Name: "MySQL", Level: 4},
			},
		},
		{
			ID:              3,
			ExperienceYears: 3,
			WorkFormat:      WorkFormatRemote,
			Skills: []CandidateSkill{
				{SkillID: 1, Name: "Go", Level: 4},
				{SkillID: 2, Name: "MySQL", Level: 2},
			},
		},
	}

	results, err := svc.MatchCandidatesToVacancy(context.Background(), vacancy, candidates)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(results) != 3 {
		t.Fatalf("expected 3 results, got %d", len(results))
	}
	if results[0].CandidateID != 2 {
		t.Fatalf("expected candidate 2 first, got %d", results[0].CandidateID)
	}
	if results[0].MatchScore < results[1].MatchScore {
		t.Fatal("expected descending order by match score")
	}
}

func TestMatchCandidateToVacancy_TwoMissingRequiredSkillsApplyCap(t *testing.T) {
	svc := NewDefaultService()

	vacancy := Vacancy{
		ID:            500,
		MinExperience: 1,
		WorkFormat:    WorkFormatRemote,
		SkillRequirements: []VacancySkillRequirement{
			{SkillID: 1, SkillName: "Go", RequiredLevel: 3, Weight: 4, IsRequired: true},
			{SkillID: 2, SkillName: "MySQL", RequiredLevel: 3, Weight: 4, IsRequired: true},
			{SkillID: 3, SkillName: "Redis", RequiredLevel: 2, Weight: 2, IsRequired: false},
		},
	}

	candidate := CandidateProfile{
		ID:              50,
		ExperienceYears: 10,
		WorkFormat:      WorkFormatRemote,
		Skills: []CandidateSkill{
			{SkillID: 3, Name: "Redis", Level: 5},
		},
	}

	res, err := svc.MatchCandidateToVacancy(context.Background(), vacancy, candidate)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if res.Breakdown.MissingRequired != 2 {
		t.Fatalf("expected 2 missing required, got %d", res.Breakdown.MissingRequired)
	}
	if res.MatchScore > DefaultConfig().HardCapWithTwoRequiredMisses {
		t.Fatalf("expected score <= %d, got %d", DefaultConfig().HardCapWithTwoRequiredMisses, res.MatchScore)
	}
}

func TestMatchCandidateToVacancy_InvalidInput(t *testing.T) {
	svc := NewDefaultService()

	_, err := svc.MatchCandidateToVacancy(context.Background(), Vacancy{}, CandidateProfile{ID: 1})
	if err == nil {
		t.Fatal("expected error for invalid vacancy")
	}

	_, err = svc.MatchCandidateToVacancy(context.Background(), Vacancy{
		ID: 1,
		SkillRequirements: []VacancySkillRequirement{
			{SkillID: 1, SkillName: "Go", RequiredLevel: 3, Weight: 1, IsRequired: true},
		},
	}, CandidateProfile{})
	if err == nil {
		t.Fatal("expected error for invalid candidate")
	}
}

func TestScoreAlwaysWithinRange(t *testing.T) {
	svc := NewDefaultService()

	vacancy := Vacancy{
		ID:            600,
		MinExperience: 20,
		WorkFormat:    WorkFormatOffice,
		SkillRequirements: []VacancySkillRequirement{
			{SkillID: 1, SkillName: "Go", RequiredLevel: 5, Weight: 10, IsRequired: true, IsCritical: true},
		},
	}

	candidate := CandidateProfile{
		ID:              60,
		ExperienceYears: 50,
		WorkFormat:      WorkFormatRemote,
		Skills: []CandidateSkill{
			{SkillID: 1, Name: "Go", Level: 100},
		},
	}

	res, err := svc.MatchCandidateToVacancy(context.Background(), vacancy, candidate)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if res.MatchScore < 0 || res.MatchScore > 100 {
		t.Fatalf("expected score in range 0..100, got %d", res.MatchScore)
	}
}
