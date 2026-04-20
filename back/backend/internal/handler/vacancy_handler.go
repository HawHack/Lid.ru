package handler

import (
	"errors"
	"net/http"
	"strconv"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/service/vacancy"

	"github.com/gin-gonic/gin"
)

type VacancyHandler struct {
	service *vacancy.Service
}

func NewVacancyHandler(service *vacancy.Service) *VacancyHandler {
	return &VacancyHandler{service: service}
}

type createVacancyRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	SalaryFrom  uint32 `json:"salary_from" binding:"required"`
	SalaryTo    uint32 `json:"salary_to" binding:"required"`
	WorkFormat  string `json:"work_format" binding:"required"`
}

type updateVacancyRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	SalaryFrom  uint32 `json:"salary_from" binding:"required"`
	SalaryTo    uint32 `json:"salary_to" binding:"required"`
	WorkFormat  string `json:"work_format" binding:"required"`
	IsActive    bool   `json:"is_active"`
}

type vacancySkillRequest struct {
	SkillID    uint64 `json:"skill_id" binding:"required"`
	Level      uint8  `json:"level" binding:"required"`
	IsRequired bool   `json:"is_required"`
}

// Create godoc
// @Summary Create vacancy
// @Tags vacancy
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body createVacancyRequest true "Vacancy data"
// @Success 201 {object} domain.Vacancy
// @Failure 400 {object} map[string]string
// @Router /employer/vacancies [post]
func (h *VacancyHandler) Create(c *gin.Context) {
	var req createVacancyRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDVal, _ := c.Get("user_id")
	roleVal, _ := c.Get("role")

	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	role, ok := roleVal.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	v, err := h.service.Create(
		userID,
		role,
		req.Title,
		req.Description,
		req.SalaryFrom,
		req.SalaryTo,
		domain.WorkFormat(req.WorkFormat),
	)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusCreated, v)
}

// GetPublicList godoc
// @Summary List public vacancies
// @Tags vacancy
// @Produce json
// @Success 200 {array} vacancy.VacancyListItemResponse
// @Failure 500 {object} map[string]string
// @Router /vacancies [get]
func (h *VacancyHandler) GetPublicList(c *gin.Context) {
	vacancies, err := h.service.GetPublicVacancies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load vacancies"})
		return
	}

	c.JSON(http.StatusOK, vacancies)
}

// GetPublicByID godoc
// @Summary Get vacancy details
// @Tags vacancy
// @Produce json
// @Param id path int true "Vacancy ID"
// @Success 200 {object} vacancy.VacancyDetailResponse
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /vacancies/{id} [get]
func (h *VacancyHandler) GetPublicByID(c *gin.Context) {
	vacancyID, ok := parseUint64Param(c, "id")
	if !ok {
		return
	}

	var candidateUserID *uint64

	userIDVal, userExists := c.Get("user_id")
	roleVal, roleExists := c.Get("role")

	if userExists && roleExists {
		if userID, ok := userIDVal.(uint64); ok {
			if role, ok := roleVal.(string); ok && role == string(domain.RoleCandidate) {
				candidateUserID = &userID
			}
		}
	}

	v, err := h.service.GetPublicVacancyByID(vacancyID, candidateUserID)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, v)
}

func (h *VacancyHandler) GetMy(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	vacancies, err := h.service.GetByEmployer(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load vacancies"})
		return
	}

	c.JSON(http.StatusOK, vacancies)
}

func (h *VacancyHandler) Update(c *gin.Context) {
	vacancyID, ok := parseUint64Param(c, "id")
	if !ok {
		return
	}

	var req updateVacancyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	err := h.service.Update(
		userID,
		vacancyID,
		req.Title,
		req.Description,
		req.SalaryFrom,
		req.SalaryTo,
		domain.WorkFormat(req.WorkFormat),
		req.IsActive,
	)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "vacancy updated"})
}

func (h *VacancyHandler) UpsertSkill(c *gin.Context) {
	vacancyID, ok := parseUint64Param(c, "id")
	if !ok {
		return
	}

	var req vacancySkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	err := h.service.UpsertSkill(
		userID,
		vacancyID,
		req.SkillID,
		req.Level,
		req.IsRequired,
	)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "vacancy skill updated"})
}

func (h *VacancyHandler) DeleteSkill(c *gin.Context) {
	vacancyID, ok := parseUint64Param(c, "id")
	if !ok {
		return
	}

	skillID, ok := parseUint64Param(c, "skillId")
	if !ok {
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	err := h.service.DeleteSkill(userID, vacancyID, skillID)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "vacancy skill deleted"})
}

func (h *VacancyHandler) GetSkills(c *gin.Context) {
	vacancyID, ok := parseUint64Param(c, "id")
	if !ok {
		return
	}

	skills, err := h.service.GetSkills(vacancyID)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, skills)
}

func (h *VacancyHandler) handleServiceError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, vacancy.ErrForbidden):
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	case errors.Is(err, vacancy.ErrVacancyNotFound), errors.Is(err, vacancy.ErrEmployerNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	case errors.Is(err, vacancy.ErrInvalidSalaryRange), errors.Is(err, vacancy.ErrInvalidSkillLevel):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}

func parseUint64Param(c *gin.Context, name string) (uint64, bool) {
	value := c.Param(name)
	id, err := strconv.ParseUint(value, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid " + name})
		return 0, false
	}

	return id, true
}