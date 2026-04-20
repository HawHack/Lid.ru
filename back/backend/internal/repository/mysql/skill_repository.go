package mysql

import (
	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"

	"gorm.io/gorm"
)

type skillRepository struct {
	db *gorm.DB
}

func NewSkillRepository(db *gorm.DB) repository.SkillRepository {
	return &skillRepository{db: db}
}

func (r *skillRepository) GetAll() ([]domain.Skill, error) {
	var models []SkillModel

	if err := r.db.Find(&models).Error; err != nil {
		return nil, err
	}

	var result []domain.Skill
	for _, m := range models {
		result = append(result, domain.Skill{
			ID:       m.ID,
			Name:     m.Name,
			Slug:     m.Slug,
			Category: m.Category,
		})
	}

	return result, nil
}

func (r *skillRepository) GetByID(id uint64) (*domain.Skill, error) {
	var m SkillModel

	if err := r.db.First(&m, id).Error; err != nil {
		return nil, err
	}

	return &domain.Skill{
		ID:       m.ID,
		Name:     m.Name,
		Slug:     m.Slug,
		Category: m.Category,
	}, nil
}