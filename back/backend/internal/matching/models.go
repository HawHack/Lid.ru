package matching

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

// WorkFormat описывает формат работы кандидата/вакансии.
// Значения должны совпадать с тем, что уже используется в основном проекте.
type WorkFormat string

const (
	WorkFormatRemote  WorkFormat = "remote"
	WorkFormatHybrid  WorkFormat = "hybrid"
	WorkFormatOffice  WorkFormat = "office"
	WorkFormatProject WorkFormat = "project"
)

// CandidateProfile — минимальная доменная модель кандидата,
// которую требует matching-движок.
// Важно: движок намеренно не зависит от ORM и БД.
type CandidateProfile struct {
	ID              uint             `json:"id"`
	ExperienceYears int              `json:"experience_years"`
	WorkFormat      WorkFormat       `json:"work_format"`
	Skills          []CandidateSkill `json:"skills"`
}

// CandidateSkill — навык кандидата.
// Level ожидается в диапазоне 1..5, но движок переживет и другие значения.
type CandidateSkill struct {
	SkillID uint   `json:"skill_id"`
	Name    string `json:"name"`
	Level   int    `json:"level"`
}

// Vacancy — минимальная доменная модель вакансии для matching.
type Vacancy struct {
	ID                uint                      `json:"id"`
	MinExperience     int                       `json:"min_experience"`
	WorkFormat        WorkFormat                `json:"work_format"`
	SkillRequirements []VacancySkillRequirement `json:"skill_requirements"`
}

// VacancySkillRequirement — требование вакансии к конкретному навыку.
type VacancySkillRequirement struct {
	SkillID       uint    `json:"skill_id"`
	SkillName     string  `json:"skill_name"`
	RequiredLevel int     `json:"required_level"`
	Weight        float64 `json:"weight"`
	IsRequired    bool    `json:"is_required"`
	IsCritical    bool    `json:"is_critical"`
}

// MatchResult — explainable результат matching.
type MatchResult struct {
	CandidateID    uint           `json:"candidate_id"`
	VacancyID      uint           `json:"vacancy_id"`
	MatchScore     int            `json:"match_score"`
	MatchedSkills  []MatchedSkill `json:"matched_skills"`
	MissingSkills  []MissingSkill `json:"missing_skills"`
	Breakdown      MatchBreakdown `json:"breakdown"`
	Recommendation string         `json:"recommendation"`
}

// MatchedSkill — подробности по навыку, который найден у кандидата.
type MatchedSkill struct {
	SkillID        uint    `json:"skill_id"`
	SkillName      string  `json:"skill_name"`
	RequiredLevel  int     `json:"required_level"`
	CandidateLevel int     `json:"candidate_level"`
	Weight         float64 `json:"weight"`
	Coverage       float64 `json:"coverage"`
	BaseScore      float64 `json:"base_score"`
	BonusScore     float64 `json:"bonus_score"`
	TotalScore     float64 `json:"total_score"`
	IsRequired     bool    `json:"is_required"`
}

// MissingSkill — подробности по навыку, которого у кандидата нет.
type MissingSkill struct {
	SkillID       uint    `json:"skill_id"`
	SkillName     string  `json:"skill_name"`
	RequiredLevel int     `json:"required_level"`
	Penalty       float64 `json:"penalty"`
	IsRequired    bool    `json:"is_required"`
	IsCritical    bool    `json:"is_critical"`
}

// MatchBreakdown — прозрачное объяснение итогового score.
// Это пригодится и для UI, и для логирования, и для будущей ML-модели.
type MatchBreakdown struct {
	SkillScore      float64 `json:"skill_score"`
	LevelBonus      float64 `json:"level_bonus"`
	MissingPenalty  float64 `json:"missing_penalty"`
	WorkFormatBonus float64 `json:"work_format_bonus"`
	ExperienceBonus float64 `json:"experience_bonus"`
	NormalizedScore float64 `json:"normalized_score"`
	RawScore        float64 `json:"raw_score"`
	FinalScore      int     `json:"final_score"`
	TotalWeight     float64 `json:"total_weight"`
	MatchedRequired int     `json:"matched_required"`
	MissingRequired int     `json:"missing_required"`
	MissingCritical int     `json:"missing_critical"`
	AppliedHardCap  int     `json:"applied_hard_cap"`
}

// Config — набор коэффициентов алгоритма.
// Вынесен отдельно, чтобы было легко:
// 1) тюнить формулу,
// 2) тестировать разные варианты,
// 3) заменить rule-based логику позже.
type Config struct {
	MissingRequiredPenaltyFactor float64
	MissingCriticalPenaltyFactor float64
	ExcessLevelBonusPerStep      float64
	ExcessLevelBonusCapFactor    float64
	WorkFormatExactBonus         float64
	WorkFormatPartialBonus       float64
	ExperienceExactBonus         float64
	ExperiencePlusOneBonus       float64
	ExperiencePlusTwoBonus       float64
	HardCapWithOneCriticalMiss   int
	HardCapWithTwoRequiredMisses int
}

// DefaultConfig — дефолтная конфигурация для MVP.
func DefaultConfig() Config {
	return Config{
		MissingRequiredPenaltyFactor: 0.50,
		MissingCriticalPenaltyFactor: 0.90,
		ExcessLevelBonusPerStep:      0.05,
		ExcessLevelBonusCapFactor:    0.15,
		WorkFormatExactBonus:         5.0,
		WorkFormatPartialBonus:       2.5,
		ExperienceExactBonus:         4.0,
		ExperiencePlusOneBonus:       6.0,
		ExperiencePlusTwoBonus:       8.0,
		HardCapWithOneCriticalMiss:   40,
		HardCapWithTwoRequiredMisses: 60,
	}
}

// JSONB — generic helper для хранения структур в MySQL JSON через GORM.
// Название оставлено нейтральным, хотя в MySQL это JSON, а не PostgreSQL JSONB.
type JSONB[T any] struct {
	Data T
}

func (j JSONB[T]) Value() (driver.Value, error) {
	b, err := json.Marshal(j.Data)
	if err != nil {
		return nil, err
	}
	return string(b), nil
}

func (j *JSONB[T]) Scan(value any) error {
	if value == nil {
		var zero T
		j.Data = zero
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("unsupported JSON scan type")
	}

	return json.Unmarshal(bytes, &j.Data)
}

// MatchSnapshot — GORM-модель для сохранения snapshot результата в MySQL 8.
// Можно использовать как отдельную таблицу логов или как основу под feature logging.
type MatchSnapshot struct {
	ID                uint                  `gorm:"primaryKey"`
	CandidateID       uint                  `gorm:"not null;index"`
	VacancyID         uint                  `gorm:"not null;index"`
	MatchScore        int                   `gorm:"not null;index"`
	Recommendation    string                `gorm:"type:varchar(32);not null"`
	MatchedSkillsJSON JSONB[[]MatchedSkill] `gorm:"type:json;not null"`
	MissingSkillsJSON JSONB[[]MissingSkill] `gorm:"type:json;not null"`
	BreakdownJSON     JSONB[MatchBreakdown] `gorm:"type:json;not null"`
	CreatedAt         time.Time
	UpdatedAt         time.Time
}
