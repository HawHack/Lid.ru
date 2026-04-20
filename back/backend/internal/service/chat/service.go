package chat

import (
	"errors"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"
)

var (
	ErrForbidden           = errors.New("forbidden")
	ErrApplicationNotFound = errors.New("application not found")
)

type Service struct {
	chatRepo repository.ChatRepository
	appRepo  repository.ApplicationRepository
	vacRepo  repository.VacancyRepository
}

func NewService(
	chatRepo repository.ChatRepository,
	appRepo repository.ApplicationRepository,
	vacRepo repository.VacancyRepository,
) *Service {
	return &Service{
		chatRepo: chatRepo,
		appRepo:  appRepo,
		vacRepo:  vacRepo,
	}
}

func (s *Service) SendMessage(userID uint64, appID uint64, message string) error {
	app, err := s.appRepo.GetByID(appID)
	if err != nil {
		return err
	}
	if app == nil {
		return ErrApplicationNotFound
	}

	vac, err := s.vacRepo.GetByID(app.VacancyID)
	if err != nil {
		return err
	}
	if vac == nil {
		return ErrApplicationNotFound
	}

	if userID != app.CandidateID && userID != vac.EmployerID {
		return ErrForbidden
	}

	msg := &domain.ChatMessage{
		ApplicationID: appID,
		SenderID:      userID,
		Message:       message,
	}

	return s.chatRepo.Create(msg)
}

func (s *Service) GetMessages(userID uint64, appID uint64) ([]domain.ChatMessage, error) {
	app, err := s.appRepo.GetByID(appID)
	if err != nil {
		return nil, err
	}
	if app == nil {
		return nil, ErrApplicationNotFound
	}

	vac, err := s.vacRepo.GetByID(app.VacancyID)
	if err != nil {
		return nil, err
	}
	if vac == nil {
		return nil, ErrApplicationNotFound
	}

	if userID != app.CandidateID && userID != vac.EmployerID {
		return nil, ErrForbidden
	}

	return s.chatRepo.GetByApplication(appID)
}