package mysql

import "time"

type EmployerProfileModel struct {
	UserID             uint64 `gorm:"primaryKey"`
	CompanyName        string `gorm:"size:255;not null"`
	INN                string `gorm:"size:12;uniqueIndex;not null"`
	Website            string `gorm:"size:255"`
	Description        string `gorm:"type:text"`
	Verified           bool   `gorm:"default:false"`
	VerificationStatus string `gorm:"type:enum('pending','approved','rejected');default:'pending'"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

func (EmployerProfileModel) TableName() string {
	return "employer_profiles"
}