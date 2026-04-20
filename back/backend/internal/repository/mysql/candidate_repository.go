package mysql

import (
	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"
	"gorm.io/gorm/clause"

	"gorm.io/gorm"
)

type candidateRepository struct {
	db *gorm.DB
}

func NewCandidateRepository(db *gorm.DB) repository.CandidateRepository {
	return &candidateRepository{db: db}
}
func (r *candidateRepository) CreateProfile(profile *domain.CandidateProfile) error {
	model := toProfileModel(profile)
	return r.db.Create(&model).Error
}

func (r *candidateRepository) GetProfileByUserID(userID uint64) (*domain.CandidateProfile, error) {
	var model CandidateProfileModel

	err := r.db.First(&model, "user_id = ?", userID).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return toProfileDomain(&model), nil
}

func (r *candidateRepository) UpdateProfile(profile *domain.CandidateProfile) error {
	model := toProfileModel(profile)
	return r.db.Model(&model).
		Where("user_id = ?", profile.UserID).
		Updates(model).Error
}

func (r *candidateRepository) UpsertSkill(skill *domain.CandidateSkill) error {
	model := CandidateSkillModel{
		CandidateID: skill.CandidateID,
		SkillID:     skill.SkillID,
		Level:       skill.Level,
	}

	return r.db.Clauses(clause.OnConflict{
		Columns: []clause.Column{
			{Name: "candidate_id"},
			{Name: "skill_id"},
		},
		DoUpdates: clause.AssignmentColumns([]string{"level"}),
	}).Create(&model).Error
}

func (r *candidateRepository) GetSkillsByUserID(userID uint64) ([]domain.CandidateSkill, error) {
	var models []CandidateSkillModel

	if err := r.db.
		Where("candidate_id = ?", userID).
		Find(&models).Error; err != nil {
		return nil, err
	}

	var result []domain.CandidateSkill
	for _, m := range models {
		result = append(result, domain.CandidateSkill{
			CandidateID: m.CandidateID,
			SkillID:     m.SkillID,
			Level:       m.Level,
		})
	}

	return result, nil
}

func (r *candidateRepository) DeleteSkill(userID uint64, skillID uint64) error {
	return r.db.
		Where("candidate_id = ? AND skill_id = ?", userID, skillID).
		Delete(&CandidateSkillModel{}).Error
}

func toProfileModel(p *domain.CandidateProfile) CandidateProfileModel {
	return CandidateProfileModel{
		UserID:          p.UserID,
		FullName:        p.FullName,
		ExperienceYears: p.ExperienceYears,
		Location:        p.Location,
		WorkFormat:      string(p.WorkFormat),
		About:           p.About,
	}
}

func toProfileDomain(m *CandidateProfileModel) *domain.CandidateProfile {
	return &domain.CandidateProfile{
		UserID:          m.UserID,
		FullName:        m.FullName,
		ExperienceYears: m.ExperienceYears,
		Location:        m.Location,
		WorkFormat:      domain.WorkFormat(m.WorkFormat),
		About:           m.About,
		CreatedAt:       m.CreatedAt,
		UpdatedAt:       m.UpdatedAt,
	}
}