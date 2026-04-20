package mysql

import "time"

type ApplicationModel struct {
	ID          uint64 `gorm:"primaryKey;autoIncrement"`
	CandidateID uint64 `gorm:"index;not null"`
	VacancyID   uint64 `gorm:"index;not null"`
	Status      string `gorm:"type:enum('applied','interview','offer','rejected');default:'applied'"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (ApplicationModel) TableName() string {
	return "applications"
}