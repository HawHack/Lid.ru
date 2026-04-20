package mysql

import (
	"time"

	"hunter-platform/internal/repository"
	"gorm.io/gorm"
)

type refreshTokenRepository struct {
	db *gorm.DB
}

func NewRefreshTokenRepository(db *gorm.DB) repository.RefreshTokenRepository {
	return &refreshTokenRepository{db: db}
}

func (r *refreshTokenRepository) Save(userID uint64, tokenHash string, expiresAt time.Time) error {
	model := RefreshTokenModel{
		UserID:    userID,
		TokenHash: tokenHash,
		ExpiresAt: expiresAt,
		Revoked:   false,
	}
	return r.db.Create(&model).Error
}

func (r *refreshTokenRepository) Exists(tokenHash string) (bool, error) {
	var model RefreshTokenModel

	err := r.db.
		Where("token_hash = ? AND revoked = false AND expires_at > NOW()", tokenHash).
		First(&model).Error

	if err == gorm.ErrRecordNotFound {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func (r *refreshTokenRepository) Revoke(tokenHash string) error {
	return r.db.
		Model(&RefreshTokenModel{}).
		Where("token_hash = ?", tokenHash).
		Update("revoked", true).Error
}

func (r *refreshTokenRepository) DeleteByUserID(userID uint64) error {
	return r.db.
		Where("user_id = ?", userID).
		Delete(&RefreshTokenModel{}).Error
}