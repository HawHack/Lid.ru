package vacancy

type SkillResponse struct {
	ID            int64  `json:"id"`
	Name          string `json:"name"`
	RequiredLevel int    `json:"requiredLevel"`
	IsRequired    bool   `json:"isRequired"`
}

type MatchResponse struct {
	Score         int               `json:"score"`
	Recommendation string           `json:"recommendation"`
	MissingSkills []SkillResponse   `json:"missingSkills"`
}

type VacancyListItemResponse struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Company     string `json:"company"`
	Description string `json:"description"`
	SalaryFrom  int    `json:"salaryFrom"`
	SalaryTo    int    `json:"salaryTo"`
	WorkFormat  string `json:"workFormat"`
	Status      string `json:"status"`
}

type VacancyDetailResponse struct {
	ID          int64            `json:"id"`
	Title       string           `json:"title"`
	Company     string           `json:"company"`
	Description string           `json:"description"`
	SalaryFrom  int              `json:"salaryFrom"`
	SalaryTo    int              `json:"salaryTo"`
	WorkFormat  string           `json:"workFormat"`
	Status      string           `json:"status"`
	Skills      []SkillResponse  `json:"skills"`
	Match       *MatchResponse   `json:"match,omitempty"`
}