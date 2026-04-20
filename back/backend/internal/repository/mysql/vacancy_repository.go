package mysql

import (
	"hunter-platform/internal/domain"

	"gorm.io/gorm"
)

type VacancyRepository struct {
	db *gorm.DB
}

func NewVacancyRepository(db *gorm.DB) *VacancyRepository {
	return &VacancyRepository{db: db}
}

func (r *VacancyRepository) Create(v *domain.Vacancy) error {
	return r.db.Create(v).Error
}

func (r *VacancyRepository) GetByID(id uint64) (*domain.Vacancy, error) {
	var v domain.Vacancy
	if err := r.db.First(&v, id).Error; err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *VacancyRepository) GetByEmployer(employerID uint64) ([]domain.Vacancy, error) {
	var vacancies []domain.Vacancy
	err := r.db.Where("employer_id = ?", employerID).Find(&vacancies).Error
	return vacancies, err
}

func (r *VacancyRepository) ListActive() ([]domain.Vacancy, error) {
	var vacancies []domain.Vacancy
	err := r.db.Where("is_active = ?", true).Find(&vacancies).Error
	return vacancies, err
}

func (r *VacancyRepository) Update(v *domain.Vacancy) error {
	return r.db.Save(v).Error
}

func (r *VacancyRepository) UpsertSkill(skill *domain.VacancySkill) error {
	var existing domain.VacancySkill

	err := r.db.
		Where("vacancy_id = ? AND skill_id = ?", skill.VacancyID, skill.SkillID).
		First(&existing).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return r.db.Create(skill).Error
		}
		return err
	}

	existing.RequiredLevel = skill.RequiredLevel
	existing.IsRequired = skill.IsRequired

	return r.db.Save(&existing).Error
}

func (r *VacancyRepository) DeleteSkill(vacancyID uint64, skillID uint64) error {
	return r.db.
		Where("vacancy_id = ? AND skill_id = ?", vacancyID, skillID).
		Delete(&domain.VacancySkill{}).Error
}

func (r *VacancyRepository) GetSkills(vacancyID uint64) ([]domain.VacancySkill, error) {
	var skills []domain.VacancySkill
	err := r.db.Where("vacancy_id = ?", vacancyID).Find(&skills).Error
	return skills, err
}