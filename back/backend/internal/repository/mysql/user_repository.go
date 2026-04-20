package mysql

import (
	"errors"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) repository.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *domain.User) error {
	model := toModel(user)

	if err := r.db.Create(&model).Error; err != nil {
		return err
	}

	user.ID = model.ID
	user.CreatedAt = model.CreatedAt
	user.UpdatedAt = model.UpdatedAt

	return nil
}

func (r *userRepository) GetByEmail(email string) (*domain.User, error) {
	var model UserModel

	if err := r.db.Where("email = ?", email).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	user := toDomain(&model)
	return user, nil
}

func (r *userRepository) GetByID(id uint64) (*domain.User, error) {
	var model UserModel

	if err := r.db.First(&model, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	user := toDomain(&model)
	return user, nil
}
func toModel(user *domain.User) UserModel {
	return UserModel{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Role:         string(user.Role),
		IsActive:     user.IsActive,
	}
}

func toDomain(model *UserModel) *domain.User {
	return &domain.User{
		ID:           model.ID,
		Email:        model.Email,
		PasswordHash: model.PasswordHash,
		Role:         domain.UserRole(model.Role),
		IsActive:     model.IsActive,
		CreatedAt:    model.CreatedAt,
		UpdatedAt:    model.UpdatedAt,
	}
}