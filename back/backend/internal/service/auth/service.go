package auth

import (
	"errors"
	"time"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"
)

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type Service struct {
	refreshRepo repository.RefreshTokenRepository
	userRepo    repository.UserRepository
	jwtManager  *JWTManager
}

func NewService(
	userRepo repository.UserRepository,
	refreshRepo repository.RefreshTokenRepository,
	jwtManager *JWTManager,
) *Service {
	return &Service{
		userRepo:    userRepo,
		refreshRepo: refreshRepo,
		jwtManager:  jwtManager,
	}
}

func (s *Service) Register(email, password string, role domain.UserRole) (*domain.User, error) {
	existing, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return nil, err
	}

	if existing != nil {
		return nil, ErrEmailAlreadyExists
	}

	hash, err := HashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Email:        email,
		PasswordHash: hash,
		Role:         role,
		IsActive:     true,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *Service) Login(email, password string) (string, string, error) {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return "", "", err
	}

	if user == nil {
		return "", "", ErrInvalidCredentials
	}

	if err := CheckPassword(user.PasswordHash, password); err != nil {
		return "", "", ErrInvalidCredentials
	}

	if err := s.refreshRepo.DeleteByUserID(user.ID); err != nil {
		return "", "", err
	}

	accessToken, err := s.jwtManager.GenerateAccessToken(user.ID, string(user.Role))
	if err != nil {
		return "", "", err
	}

	refreshToken, err := s.jwtManager.GenerateRefreshToken(user.ID)
	if err != nil {
		return "", "", err
	}

	tokenHash := HashToken(refreshToken)
	expiresAt := time.Now().Add(7 * 24 * time.Hour)

	if err := s.refreshRepo.Save(user.ID, tokenHash, expiresAt); err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *Service) Refresh(refreshToken string) (string, string, error) {
	token, err := s.jwtManager.ParseRefreshToken(refreshToken)
	if err != nil {
		return "", "", err
	}

	userID := token.UserID
	tokenHash := HashToken(refreshToken)

	exists, err := s.refreshRepo.Exists(tokenHash)
	if err != nil {
		return "", "", err
	}

	if !exists {
		return "", "", ErrInvalidCredentials
	}

	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return "", "", err
	}

	if user == nil {
		return "", "", ErrInvalidCredentials
	}

	if err := s.refreshRepo.DeleteByUserID(userID); err != nil {
		return "", "", err
	}

	accessToken, err := s.jwtManager.GenerateAccessToken(userID, string(user.Role))
	if err != nil {
		return "", "", err
	}

	newRefreshToken, err := s.jwtManager.GenerateRefreshToken(userID)
	if err != nil {
		return "", "", err
	}

	newTokenHash := HashToken(newRefreshToken)
	expiresAt := time.Now().Add(7 * 24 * time.Hour)

	if err := s.refreshRepo.Save(userID, newTokenHash, expiresAt); err != nil {
		return "", "", err
	}

	return accessToken, newRefreshToken, nil
}

func (s *Service) Logout(refreshToken string) error {
	tokenHash := HashToken(refreshToken)
	return s.refreshRepo.Revoke(tokenHash)
}