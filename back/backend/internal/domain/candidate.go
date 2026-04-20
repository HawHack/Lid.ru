package domain

import "time"

type WorkFormat string

const (
	WorkRemote  WorkFormat = "remote"
	WorkHybrid  WorkFormat = "hybrid"
	WorkOffice  WorkFormat = "office"
	WorkProject WorkFormat = "project"
)

type CandidateProfile struct {
	UserID          uint64
	FullName        string
	ExperienceYears uint32
	Location        string
	WorkFormat      WorkFormat
	About           string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type CandidateSkill struct {
	CandidateID uint64
	SkillID     uint64
	Level       uint8
}