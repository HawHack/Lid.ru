package matching

import (
	"context"
	"errors"
	"math"
	"sort"
)

var ErrInvalidVacancy = errors.New("invalid vacancy")
var ErrInvalidCandidate = errors.New("invalid candidate")

// Service — публичный интерфейс движка.
// Сохраняй его стабильным: это упростит рефакторинг и замену на ML в будущем.
type Service interface {
	MatchCandidateToVacancy(ctx context.Context, vacancy Vacancy, candidate CandidateProfile) (MatchResult, error)
	MatchCandidatesToVacancy(ctx context.Context, vacancy Vacancy, candidates []CandidateProfile) ([]MatchResult, error)
}

// MatchingService — rule-based explainable ranking.
// Намеренно не зависит от базы, HTTP и ORM.
type MatchingService struct {
	cfg Config
}

// NewService позволяет передавать кастомные коэффициенты.
func NewService(cfg Config) *MatchingService {
	return &MatchingService{cfg: cfg}
}

// NewDefaultService — основной конструктор для MVP.
func NewDefaultService() *MatchingService {
	return NewService(DefaultConfig())
}

// MatchCandidateToVacancy считает explainable score для одного кандидата.
// Алгоритм:
// 1. Идем по требованиям вакансии.
// 2. Ищем навык кандидата.
// 3. Если навык найден — начисляем базовый score по coverage.
// 4. Если уровень выше — добавляем небольшой бонус.
// 5. Если обязательный навык отсутствует — штрафуем.
// 6. Добавляем бонусы за формат работы и опыт.
// 7. Применяем hard cap для заведомо слабых матчей.
func (s *MatchingService) MatchCandidateToVacancy(
	_ context.Context,
	vacancy Vacancy,
	candidate CandidateProfile,
) (MatchResult, error) {
	if len(vacancy.SkillRequirements) == 0 {
		return MatchResult{}, ErrInvalidVacancy
	}
	if candidate.ID == 0 {
		return MatchResult{}, ErrInvalidCandidate
	}

	// Создаем map для O(1) доступа к навыкам кандидата.
	skillMap := make(map[uint]CandidateSkill, len(candidate.Skills))
	for _, skill := range candidate.Skills {
		if skill.SkillID == 0 || skill.Level <= 0 {
			continue
		}
		skillMap[skill.SkillID] = skill
	}

	var totalWeight float64
	var skillScore float64
	var levelBonus float64
	var missingPenalty float64

	var matchedRequired int
	var missingRequired int
	var missingCritical int

	matchedSkills := make([]MatchedSkill, 0, len(vacancy.SkillRequirements))
	missingSkills := make([]MissingSkill, 0)

	for _, req := range vacancy.SkillRequirements {
		req = normalizeRequirement(req)
		totalWeight += req.Weight

		cSkill, found := skillMap[req.SkillID]
		if !found {
			penalty := s.missingPenalty(req)

			if req.IsRequired {
				missingRequired++
			}
			if req.IsCritical {
				missingCritical++
			}

			missingPenalty += penalty
			missingSkills = append(missingSkills, MissingSkill{
				SkillID:       req.SkillID,
				SkillName:     req.SkillName,
				RequiredLevel: req.RequiredLevel,
				Penalty:       round2(penalty),
				IsRequired:    req.IsRequired,
				IsCritical:    req.IsCritical,
			})
			continue
		}

		coverage := calcCoverage(cSkill.Level, req.RequiredLevel)
		baseScore := req.Weight * coverage
		skillScore += baseScore

		bonus := s.excessLevelBonus(req.Weight, cSkill.Level, req.RequiredLevel)
		levelBonus += bonus

		if req.IsRequired {
			matchedRequired++
		}

		matchedSkills = append(matchedSkills, MatchedSkill{
			SkillID:        req.SkillID,
			SkillName:      req.SkillName,
			RequiredLevel:  req.RequiredLevel,
			CandidateLevel: cSkill.Level,
			Weight:         req.Weight,
			Coverage:       round4(coverage),
			BaseScore:      round2(baseScore),
			BonusScore:     round2(bonus),
			TotalScore:     round2(baseScore + bonus),
			IsRequired:     req.IsRequired,
		})
	}

	normalizedScore := 0.0
	if totalWeight > 0 {
		normalizedScore = ((skillScore + levelBonus - missingPenalty) / totalWeight) * 100.0
	}

	workFormatBonus := s.workFormatBonus(vacancy.WorkFormat, candidate.WorkFormat)
	experienceBonus := s.experienceBonus(vacancy.MinExperience, candidate.ExperienceYears)

	rawScore := normalizedScore + workFormatBonus + experienceBonus
	rawScore = clamp(rawScore, 0, 100)

	// Hard cap не дает кандидату с критическими пропусками выглядеть слишком сильным.
	appliedHardCap := 100
	if missingCritical >= 1 {
		appliedHardCap = s.cfg.HardCapWithOneCriticalMiss
	} else if missingRequired >= 2 {
		appliedHardCap = s.cfg.HardCapWithTwoRequiredMisses
	}

	finalScore := int(math.Round(rawScore))
	if finalScore > appliedHardCap {
		finalScore = appliedHardCap
	}

	result := MatchResult{
		CandidateID:   candidate.ID,
		VacancyID:     vacancy.ID,
		MatchScore:    finalScore,
		MatchedSkills: matchedSkills,
		MissingSkills: missingSkills,
		Breakdown: MatchBreakdown{
			SkillScore:      round2(skillScore),
			LevelBonus:      round2(levelBonus),
			MissingPenalty:  round2(missingPenalty),
			WorkFormatBonus: round2(workFormatBonus),
			ExperienceBonus: round2(experienceBonus),
			NormalizedScore: round2(normalizedScore),
			RawScore:        round2(rawScore),
			FinalScore:      finalScore,
			TotalWeight:     round2(totalWeight),
			MatchedRequired: matchedRequired,
			MissingRequired: missingRequired,
			MissingCritical: missingCritical,
			AppliedHardCap:  appliedHardCap,
		},
		Recommendation: recommendationByScore(finalScore),
	}

	return result, nil
}

// MatchCandidatesToVacancy считает matching для списка кандидатов и сортирует результат по убыванию score.
func (s *MatchingService) MatchCandidatesToVacancy(
	ctx context.Context,
	vacancy Vacancy,
	candidates []CandidateProfile,
) ([]MatchResult, error) {
	results := make([]MatchResult, 0, len(candidates))

	for _, candidate := range candidates {
		res, err := s.MatchCandidateToVacancy(ctx, vacancy, candidate)
		if err != nil {
			return nil, err
		}
		results = append(results, res)
	}

	sort.SliceStable(results, func(i, j int) bool {
		if results[i].MatchScore == results[j].MatchScore {
			return results[i].CandidateID < results[j].CandidateID
		}
		return results[i].MatchScore > results[j].MatchScore
	})

	return results, nil
}

func normalizeRequirement(req VacancySkillRequirement) VacancySkillRequirement {
	if req.RequiredLevel <= 0 {
		req.RequiredLevel = 1
	}
	if req.Weight <= 0 {
		req.Weight = 1.0
	}
	return req
}

// calcCoverage возвращает долю покрытия требования уровнем кандидата.
// Пример:
// required=4, candidate=2 => 0.5
// required=4, candidate=4 => 1.0
// required=4, candidate=5 => 1.0
func calcCoverage(candidateLevel, requiredLevel int) float64 {
	if candidateLevel <= 0 || requiredLevel <= 0 {
		return 0
	}
	if candidateLevel >= requiredLevel {
		return 1.0
	}
	return float64(candidateLevel) / float64(requiredLevel)
}

// excessLevelBonus дает небольшой бонус за превышение уровня, но с жестким потолком.
func (s *MatchingService) excessLevelBonus(weight float64, candidateLevel, requiredLevel int) float64 {
	if candidateLevel <= requiredLevel {
		return 0
	}
	delta := candidateLevel - requiredLevel
	rawBonus := float64(delta) * weight * s.cfg.ExcessLevelBonusPerStep
	capBonus := weight * s.cfg.ExcessLevelBonusCapFactor
	return math.Min(rawBonus, capBonus)
}

// missingPenalty возвращает штраф за отсутствие навыка.
func (s *MatchingService) missingPenalty(req VacancySkillRequirement) float64 {
	if !req.IsRequired {
		return 0
	}
	if req.IsCritical {
		return req.Weight * s.cfg.MissingCriticalPenaltyFactor
	}
	return req.Weight * s.cfg.MissingRequiredPenaltyFactor
}

// workFormatBonus добавляет бонус за совпадение формата работы.
// При необходимости здесь можно расширить матрицу совместимости.
func (s *MatchingService) workFormatBonus(vacancyFormat, candidateFormat WorkFormat) float64 {
	if vacancyFormat == "" || candidateFormat == "" {
		return 0
	}
	if vacancyFormat == candidateFormat {
		return s.cfg.WorkFormatExactBonus
	}

	switch {
	case vacancyFormat == WorkFormatRemote && candidateFormat == WorkFormatHybrid:
		return s.cfg.WorkFormatPartialBonus
	case vacancyFormat == WorkFormatHybrid && candidateFormat == WorkFormatRemote:
		return s.cfg.WorkFormatPartialBonus
	case vacancyFormat == WorkFormatProject && candidateFormat == WorkFormatRemote:
		return s.cfg.WorkFormatPartialBonus
	case vacancyFormat == WorkFormatProject && candidateFormat == WorkFormatHybrid:
		return s.cfg.WorkFormatPartialBonus
	default:
		return 0
	}
}

// experienceBonus — небольшой бонус за соответствие минимальному опыту.
func (s *MatchingService) experienceBonus(minExp, candidateExp int) float64 {
	if minExp <= 0 || candidateExp < minExp {
		return 0
	}

	diff := candidateExp - minExp
	switch {
	case diff == 0:
		return s.cfg.ExperienceExactBonus
	case diff == 1:
		return s.cfg.ExperiencePlusOneBonus
	default:
		return s.cfg.ExperiencePlusTwoBonus
	}
}

func recommendationByScore(score int) string {
	switch {
	case score >= 85:
		return "strong_match"
	case score >= 70:
		return "good_match"
	case score >= 50:
		return "moderate_match"
	default:
		return "weak_match"
	}
}

func clamp(v, min, max float64) float64 {
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}

func round2(v float64) float64 {
	return math.Round(v*100) / 100
}

func round4(v float64) float64 {
	return math.Round(v*10000) / 10000
}
