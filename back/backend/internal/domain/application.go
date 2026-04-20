package domain

import "time"

type ApplicationStatus string

const (
	StatusApplied   ApplicationStatus = "applied"
	StatusInterview ApplicationStatus = "interview"
	StatusOffer     ApplicationStatus = "offer"
	StatusRejected  ApplicationStatus = "rejected"
)

type Application struct {
	ID          uint64
	CandidateID uint64
	VacancyID   uint64
	Status      ApplicationStatus
	CreatedAt   time.Time
	UpdatedAt   time.Time
}