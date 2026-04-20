package domain

import "time"

type VerificationStatus string

const (
	VerificationPending  VerificationStatus = "pending"
	VerificationApproved VerificationStatus = "approved"
	VerificationRejected VerificationStatus = "rejected"
)

type EmployerProfile struct {
	UserID             uint64
	CompanyName        string
	INN                string
	Website            string
	Description        string
	Verified           bool
	VerificationStatus VerificationStatus
	CreatedAt          time.Time
	UpdatedAt          time.Time
}