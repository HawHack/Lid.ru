package mysql

import (
	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"

	"gorm.io/gorm"
)

type applicationRepository struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) repository.ApplicationRepository {
	return &applicationRepository{db: db}
}

func (r *applicationRepository) Create(app *domain.Application) error {
	model := toApplicationModel(app)

	if err := r.db.Create(&model).Error; err != nil {
		return err
	}

	app.ID = model.ID
	app.CreatedAt = model.CreatedAt
	app.UpdatedAt = model.UpdatedAt

	return nil
}

func (r *applicationRepository) GetByID(id uint64) (*domain.Application, error) {
	var model ApplicationModel

	if err := r.db.First(&model, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return toApplicationDomain(&model), nil
}

func (r *applicationRepository) GetByCandidate(candidateID uint64) ([]domain.Application, error) {
	var models []ApplicationModel

	if err := r.db.
		Where("candidate_id = ?", candidateID).
		Order("created_at DESC").
		Find(&models).Error; err != nil {
		return nil, err
	}

	result := make([]domain.Application, 0, len(models))
	for _, model := range models {
		result = append(result, *toApplicationDomain(&model))
	}

	return result, nil
}

func (r *applicationRepository) GetByVacancy(vacancyID uint64) ([]domain.Application, error) {
	var models []ApplicationModel

	if err := r.db.
		Where("vacancy_id = ?", vacancyID).
		Order("created_at DESC").
		Find(&models).Error; err != nil {
		return nil, err
	}

	result := make([]domain.Application, 0, len(models))
	for _, model := range models {
		result = append(result, *toApplicationDomain(&model))
	}

	return result, nil
}

func (r *applicationRepository) Update(app *domain.Application) error {
	model := toApplicationModel(app)

	return r.db.Model(&ApplicationModel{}).
		Where("id = ?", app.ID).
		Updates(map[string]any{
			"candidate_id": model.CandidateID,
			"vacancy_id":   model.VacancyID,
			"status":       model.Status,
		}).Error
}

func toApplicationModel(a *domain.Application) ApplicationModel {
	return ApplicationModel{
		ID:          a.ID,
		CandidateID: a.CandidateID,
		VacancyID:   a.VacancyID,
		Status:      string(a.Status),
	}
}

func toApplicationDomain(m *ApplicationModel) *domain.Application {
	return &domain.Application{
		ID:          m.ID,
		CandidateID: m.CandidateID,
		VacancyID:   m.VacancyID,
		Status:      domain.ApplicationStatus(m.Status),
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
	}
}