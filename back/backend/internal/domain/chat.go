package domain

import "time"

type ChatMessage struct {
	ID            uint64
	ApplicationID uint64
	SenderID      uint64
	Message       string
	CreatedAt     time.Time
}