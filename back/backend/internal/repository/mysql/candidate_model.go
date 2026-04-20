package mysql

import "time"

type CandidateProfileModel struct {
	UserID          uint64 `gorm:"primaryKey"`
	FullName        string `gorm:"size:255;not null"`
	ExperienceYears uint32 `gorm:"not null"`
	Location        string `gorm:"size:255"`
	WorkFormat      string `gorm:"type:enum('remote','hybrid','office','project');not null"`
	About           string `gorm:"type:text"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

func (CandidateProfileModel) TableName() string {
	return "candidate_profiles"
}

type CandidateSkillModel struct {
	CandidateID uint64 `gorm:"primaryKey"`
	SkillID     uint64 `gorm:"primaryKey"`
	Level       uint8  `gorm:"not null"`
	CreatedAt   time.Time
}

func (CandidateSkillModel) TableName() string {
	return "candidate_skills"
}