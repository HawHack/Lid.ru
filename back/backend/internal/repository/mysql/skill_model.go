package mysql

type SkillModel struct {
	ID       uint64 `gorm:"primaryKey;autoIncrement"`
	Name     string `gorm:"size:100;unique;not null"`
	Slug     string `gorm:"size:100;unique;not null"`
	Category string `gorm:"size:100"`
}

func (SkillModel) TableName() string {
	return "skills"
}