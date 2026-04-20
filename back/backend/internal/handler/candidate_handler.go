package handler

import (
	"errors"
	"net/http"
	"strconv"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/service/candidate"

	"github.com/gin-gonic/gin"
)

type CandidateHandler struct {
	service *candidate.Service
}

func NewCandidateHandler(service *candidate.Service) *CandidateHandler {
	return &CandidateHandler{service: service}
}

type createProfileRequest struct {
	FullName        string `json:"full_name" binding:"required"`
	ExperienceYears uint32 `json:"experience_years"`
	Location        string `json:"location"`
	WorkFormat      string `json:"work_format" binding:"required"`
	About           string `json:"about"`
}

type skillRequest struct {
	SkillID uint64 `json:"skill_id" binding:"required"`
	Level   uint8  `json:"level" binding:"required"`
}

// CreateProfile godoc
// @Summary Create candidate profile
// @Tags candidate
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body createProfileRequest true "Profile data"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /candidate/profile [post]
func (h *CandidateHandler) CreateProfile(c *gin.Context) {
	var req createProfileRequest
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

	err := h.service.CreateProfile(
		userID,
		role,
		req.FullName,
		req.ExperienceYears,
		req.Location,
		domain.WorkFormat(req.WorkFormat),
		req.About,
	)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "profile created"})
}

// GetProfile godoc
// @Summary Get my profile
// @Tags candidate
// @Security BearerAuth
// @Produce json
// @Success 200 {object} domain.CandidateProfile
// @Failure 404 {object} map[string]string
// @Router /candidate/profile [get]
func (h *CandidateHandler) GetProfile(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	profile, err := h.service.GetProfile(userID)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, profile)
}

// UpsertSkill godoc
// @Summary Add or update skill
// @Tags candidate
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body skillRequest true "Skill data"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /candidate/skills [post]
func (h *CandidateHandler) UpsertSkill(c *gin.Context) {
	var req skillRequest
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

	if err := h.service.UpsertSkill(userID, req.SkillID, req.Level); err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "skill updated"})
}

// GetSkills godoc
// @Summary Get my skills
// @Tags candidate
// @Security BearerAuth
// @Produce json
// @Success 200 {array} domain.CandidateSkill
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /candidate/skills [get]
func (h *CandidateHandler) GetSkills(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	skills, err := h.service.GetSkills(userID)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, skills)
}

// DeleteSkill godoc
// @Summary Delete my skill
// @Tags candidate
// @Security BearerAuth
// @Produce json
// @Param id path int true "Skill ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /candidate/skills/{id} [delete]
func (h *CandidateHandler) DeleteSkill(c *gin.Context) {
	idStr := c.Param("id")
	skillID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid skill id"})
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.service.DeleteSkill(userID, skillID); err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "skill deleted"})
}

func (h *CandidateHandler) handleServiceError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, candidate.ErrForbidden):
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	case errors.Is(err, candidate.ErrProfileNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	case errors.Is(err, candidate.ErrProfileAlreadyExists),
		errors.Is(err, candidate.ErrInvalidSkillLevel):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}