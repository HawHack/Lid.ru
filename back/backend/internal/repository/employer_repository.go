package repository

import "hunter-platform/internal/domain"

type EmployerRepository interface {
	Create(profile *domain.EmployerProfile) error
	GetByUserID(userID uint64) (*domain.EmployerProfile, error)
	Update(profile *domain.EmployerProfile) error
}