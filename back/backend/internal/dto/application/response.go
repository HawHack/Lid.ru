package application

type VacancySummaryResponse struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Company     string `json:"company"`
	SalaryFrom  int    `json:"salaryFrom"`
	SalaryTo    int    `json:"salaryTo"`
	WorkFormat  string `json:"workFormat"`
	Status      string `json:"status"`
}

type CandidateSummaryResponse struct {
	UserID          int64    `json:"userId"`
	FullName        string   `json:"fullName"`
	About           string   `json:"about"`
	Location        string   `json:"location"`
	ExperienceYears int      `json:"experienceYears"`
	WorkFormat      string   `json:"workFormat"`
	Skills          []string `json:"skills"`
}

type SkillGapResponse struct {
	ID            int64  `json:"id"`
	Name          string `json:"name"`
	RequiredLevel int    `json:"requiredLevel"`
	IsRequired    bool   `json:"isRequired"`
}

type MatchSummaryResponse struct {
	Score          int                `json:"score"`
	Recommendation string             `json:"recommendation"`
	MissingSkills  []SkillGapResponse `json:"missingSkills"`
}

type CandidateApplicationItemResponse struct {
	ID        int64                  `json:"id"`
	Status    string                 `json:"status"`
	CreatedAt string                 `json:"createdAt"`
	Vacancy   VacancySummaryResponse `json:"vacancy"`
	Match     *MatchSummaryResponse  `json:"match,omitempty"`
}

type EmployerApplicationItemResponse struct {
	ID        int64                    `json:"id"`
	Status    string                   `json:"status"`
	CreatedAt string                   `json:"createdAt"`
	Candidate CandidateSummaryResponse `json:"candidate"`
	Match     *MatchSummaryResponse    `json:"match,omitempty"`
}

type ApplicationStatusResponse struct {
	ID     int64  `json:"id"`
	Status string `json:"status"`
}