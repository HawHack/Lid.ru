package repository

import "hunter-platform/internal/domain"

type CandidateRepository interface {
	CreateProfile(profile *domain.CandidateProfile) error
	GetProfileByUserID(userID uint64) (*domain.CandidateProfile, error)
	UpdateProfile(profile *domain.CandidateProfile) error

	UpsertSkill(skill *domain.CandidateSkill) error
	GetSkillsByUserID(userID uint64) ([]domain.CandidateSkill, error)
	DeleteSkill(userID uint64, skillID uint64) error
}