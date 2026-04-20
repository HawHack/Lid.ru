package mysql

import (
	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"

	"gorm.io/gorm"
)

type employerRepository struct {
	db *gorm.DB
}

func NewEmployerRepository(db *gorm.DB) repository.EmployerRepository {
	return &employerRepository{db: db}
}
func (r *employerRepository) Create(profile *domain.EmployerProfile) error {
	model := toEmployerModel(profile)
	return r.db.Create(&model).Error
}

func (r *employerRepository) GetByUserID(userID uint64) (*domain.EmployerProfile, error) {
	var model EmployerProfileModel

	err := r.db.First(&model, "user_id = ?", userID).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return toEmployerDomain(&model), nil
}

func (r *employerRepository) Update(profile *domain.EmployerProfile) error {
	model := toEmployerModel(profile)
	return r.db.Model(&model).
		Where("user_id = ?", profile.UserID).
		Updates(model).Error
}
func toEmployerModel(p *domain.EmployerProfile) EmployerProfileModel {
	return EmployerProfileModel{
		UserID:             p.UserID,
		CompanyName:        p.CompanyName,
		INN:                p.INN,
		Website:            p.Website,
		Description:        p.Description,
		Verified:           p.Verified,
		VerificationStatus: string(p.VerificationStatus),
	}
}

func toEmployerDomain(m *EmployerProfileModel) *domain.EmployerProfile {
	return &domain.EmployerProfile{
		UserID:             m.UserID,
		CompanyName:        m.CompanyName,
		INN:                m.INN,
		Website:            m.Website,
		Description:        m.Description,
		Verified:           m.Verified,
		VerificationStatus: domain.VerificationStatus(m.VerificationStatus),
		CreatedAt:          m.CreatedAt,
		UpdatedAt:          m.UpdatedAt,
	}
}