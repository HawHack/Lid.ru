package mysql

import "time"

type ChatMessageModel struct {
	ID            uint64 `gorm:"primaryKey;autoIncrement"`
	ApplicationID uint64 `gorm:"index;not null"`
	SenderID      uint64 `gorm:"index;not null"`
	Message       string `gorm:"type:text;not null"`
	CreatedAt     time.Time
}

func (ChatMessageModel) TableName() string {
	return "chat_messages"
}