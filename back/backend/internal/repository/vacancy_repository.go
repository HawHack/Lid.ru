package repository

import "hunter-platform/internal/domain"

type VacancyRepository interface {
	Create(v *domain.Vacancy) error
	GetByID(id uint64) (*domain.Vacancy, error)
	GetByEmployer(employerID uint64) ([]domain.Vacancy, error)
	ListActive() ([]domain.Vacancy, error)
	Update(v *domain.Vacancy) error

	UpsertSkill(skill *domain.VacancySkill) error
	DeleteSkill(vacancyID uint64, skillID uint64) error
	GetSkills(vacancyID uint64) ([]domain.VacancySkill, error)
}