package domain

import "time"

type UserRole string

const (
	RoleCandidate UserRole = "candidate"
	RoleEmployer  UserRole = "employer"
	RoleAdmin     UserRole = "admin"
)

type User struct {
	ID           uint64
	Email        string
	PasswordHash string
	Role         UserRole
	IsActive     bool
	CreatedAt    time.Time
	UpdatedAt    time.Time
}