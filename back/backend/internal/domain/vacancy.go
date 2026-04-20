package domain

import "time"

type Vacancy struct {
	ID          uint64
	EmployerID  uint64
	Title       string
	Description string
	SalaryFrom  uint32
	SalaryTo    uint32
	WorkFormat  WorkFormat
	IsActive    bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type VacancySkill struct {
	VacancyID     uint64
	SkillID       uint64
	RequiredLevel uint8
	IsRequired    bool
}