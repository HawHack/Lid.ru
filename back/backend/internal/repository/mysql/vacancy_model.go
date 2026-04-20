package mysql

import "time"

type VacancyModel struct {
	ID          uint64 `gorm:"primaryKey;autoIncrement"`
	EmployerID  uint64 `gorm:"index;not null"`
	Title       string `gorm:"size:255;not null"`
	Description string `gorm:"type:text;not null"`
	SalaryFrom  uint32 `gorm:"not null"`
	SalaryTo    uint32 `gorm:"not null"`
	WorkFormat  string `gorm:"type:enum('remote','hybrid','office','project');not null"`
	IsActive    bool   `gorm:"default:true"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (VacancyModel) TableName() string {
	return "vacancies"
}

type VacancySkillModel struct {
	VacancyID     uint64 `gorm:"primaryKey"`
	SkillID       uint64 `gorm:"primaryKey"`
	RequiredLevel uint8  `gorm:"not null"`
	IsRequired    bool   `gorm:"default:true"`
	CreatedAt     time.Time
}

func (VacancySkillModel) TableName() string {
	return "vacancy_skills"
}