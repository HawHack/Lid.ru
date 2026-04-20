package repository

import "hunter-platform/internal/domain"

type ChatRepository interface {
	Create(message *domain.ChatMessage) error
	GetByApplication(applicationID uint64) ([]domain.ChatMessage, error)
}