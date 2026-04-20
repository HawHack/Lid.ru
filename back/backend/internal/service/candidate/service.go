package candidate

import (
	"errors"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"
)

var (
	ErrProfileAlreadyExists = errors.New("profile already exists")
	ErrProfileNotFound      = errors.New("profile not found")
	ErrInvalidSkillLevel    = errors.New("skill level must be between 1 and 5")
	ErrForbidden            = errors.New("forbidden")
)

type Service struct {
	candidateRepo repository.CandidateRepository
}

func NewService(repo repository.CandidateRepository) *Service {
	return &Service{
		candidateRepo: repo,
	}
}
func (s *Service) CreateProfile(
	userID uint64,
	role string,
	fullName string,
	experience uint32,
	location string,
	workFormat domain.WorkFormat,
	about string,
) error {

	if role != string(domain.RoleCandidate) {
		return ErrForbidden
	}

	existing, err := s.candidateRepo.GetProfileByUserID(userID)
	if err != nil {
		return err
	}

	if existing != nil {
		return ErrProfileAlreadyExists
	}

	profile := &domain.CandidateProfile{
		UserID:          userID,
		FullName:        fullName,
		ExperienceYears: experience,
		Location:        location,
		WorkFormat:      workFormat,
		About:           about,
	}

	return s.candidateRepo.CreateProfile(profile)
}
func (s *Service) GetProfile(userID uint64) (*domain.CandidateProfile, error) {
	profile, err := s.candidateRepo.GetProfileByUserID(userID)
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
	fullName string,
	experience uint32,
	location string,
	workFormat domain.WorkFormat,
	about string,
) error {

	profile, err := s.candidateRepo.GetProfileByUserID(userID)
	if err != nil {
		return err
	}

	if profile == nil {
		return ErrProfileNotFound
	}

	profile.FullName = fullName
	profile.ExperienceYears = experience
	profile.Location = location
	profile.WorkFormat = workFormat
	profile.About = about

	return s.candidateRepo.UpdateProfile(profile)
}
func (s *Service) UpsertSkill(userID uint64, skillID uint64, level uint8) error {

	if level < 1 || level > 5 {
		return ErrInvalidSkillLevel
	}

	profile, err := s.candidateRepo.GetProfileByUserID(userID)
	if err != nil {
		return err
	}

	if profile == nil {
		return ErrProfileNotFound
	}

	skill := &domain.CandidateSkill{
		CandidateID: userID,
		SkillID:     skillID,
		Level:       level,
	}

	return s.candidateRepo.UpsertSkill(skill)
}
func (s *Service) GetSkills(userID uint64) ([]domain.CandidateSkill, error) {
	return s.candidateRepo.GetSkillsByUserID(userID)
}

func (s *Service) DeleteSkill(userID uint64, skillID uint64) error {
	profile, err := s.candidateRepo.GetProfileByUserID(userID)
	if err != nil {
		return err
	}
	if profile == nil {
		return ErrProfileNotFound
	}

	return s.candidateRepo.DeleteSkill(userID, skillID)
}