package repository

import "hunter-platform/internal/domain"

type ApplicationRepository interface {
	Create(app *domain.Application) error
	GetByID(id uint64) (*domain.Application, error)

	GetByCandidate(userID uint64) ([]domain.Application, error)
	GetByVacancy(vacancyID uint64) ([]domain.Application, error)

	Update(app *domain.Application) error
}