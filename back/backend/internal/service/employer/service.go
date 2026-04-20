package employer

import (
	"errors"
	"regexp"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"
)

var (
	ErrProfileAlreadyExists = errors.New("profile already exists")
	ErrProfileNotFound      = errors.New("profile not found")
	ErrInvalidINN           = errors.New("invalid INN format")
	ErrForbidden            = errors.New("forbidden")
)

type Service struct {
	repo repository.EmployerRepository
}

func NewService(repo repository.EmployerRepository) *Service {
	return &Service{repo: repo}
}
func validateINN(inn string) bool {
	matched, _ := regexp.MatchString(`^\d{10}$|^\d{12}$`, inn)
	return matched
}
func (s *Service) CreateProfile(
	userID uint64,
	role string,
	companyName string,
	inn string,
	website string,
	description string,
) error {

	if role != string(domain.RoleEmployer) {
		return ErrForbidden
	}

	existing, err := s.repo.GetByUserID(userID)
	if err != nil {
		return err
	}
	if existing != nil {
		return ErrProfileAlreadyExists
	}

	if !validateINN(inn) {
		return ErrInvalidINN
	}

	profile := &domain.EmployerProfile{
		UserID:             userID,
		CompanyName:        companyName,
		INN:                inn,
		Website:            website,
		Description:        description,
		Verified:           false,
		VerificationStatus: domain.VerificationPending,
	}

	return s.repo.Create(profile)
}
func (s *Service) GetProfile(userID uint64) (*domain.EmployerProfile, error) {
	profile, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	if profile == nil {
		return nil, ErrProfileNotFound
	}

	return profile, nil
}
func (s *Service) UpdateProfile(
	userID uint64,
	companyName string,
	website string,
	description string,
) error {

	profile, err := s.repo.GetByUserID(userID)
	if err != nil {
		return err
	}
	if profile == nil {
		return ErrProfileNotFound
	}

	profile.CompanyName = companyName
	profile.Website = website
	profile.Description = description

	return s.repo.Update(profile)
}