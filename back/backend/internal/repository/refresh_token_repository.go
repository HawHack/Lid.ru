package repository

import "time"

type RefreshTokenRepository interface {
	Save(userID uint64, tokenHash string, expiresAt time.Time) error
	Exists(tokenHash string) (bool, error)
	Revoke(tokenHash string) error
	DeleteByUserID(userID uint64) error
}