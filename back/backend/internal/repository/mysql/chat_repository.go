package mysql

import (
	"hunter-platform/internal/domain"
	"hunter-platform/internal/repository"

	"gorm.io/gorm"
)

type chatRepository struct {
	db *gorm.DB
}

func NewChatRepository(db *gorm.DB) repository.ChatRepository {
	return &chatRepository{db: db}
}

func (r *chatRepository) Create(msg *domain.ChatMessage) error {
	model := ChatMessageModel{
		ApplicationID: msg.ApplicationID,
		SenderID:      msg.SenderID,
		Message:       msg.Message,
	}

	if err := r.db.Create(&model).Error; err != nil {
		return err
	}

	msg.ID = model.ID
	msg.CreatedAt = model.CreatedAt

	return nil
}

func (r *chatRepository) GetByApplication(applicationID uint64) ([]domain.ChatMessage, error) {
	var models []ChatMessageModel

	if err := r.db.
		Where("application_id = ?", applicationID).
		Order("created_at ASC").
		Find(&models).Error; err != nil {
		return nil, err
	}

	result := make([]domain.ChatMessage, 0, len(models))
	for _, m := range models {
		result = append(result, domain.ChatMessage{
			ID:            m.ID,
			ApplicationID: m.ApplicationID,
			SenderID:      m.SenderID,
			Message:       m.Message,
			CreatedAt:     m.CreatedAt,
		})
	}

	return result, nil
}