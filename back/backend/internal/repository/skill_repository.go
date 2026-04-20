package repository

import "hunter-platform/internal/domain"

type SkillRepository interface {
	GetAll() ([]domain.Skill, error)
	GetByID(id uint64) (*domain.Skill, error)
}