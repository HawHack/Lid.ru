package handler

import (
	"errors"
	"net/http"
	"strconv"

	"hunter-platform/internal/domain"
	"hunter-platform/internal/service/application"

	"github.com/gin-gonic/gin"
)

type ApplicationHandler struct {
	service *application.Service
}

func NewApplicationHandler(service *application.Service) *ApplicationHandler {
	return &ApplicationHandler{service: service}
}

type updateStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

// Apply godoc
// @Summary Apply to vacancy
// @Tags application
// @Security BearerAuth
// @Produce json
// @Param id path int true "Vacancy ID"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /candidate/applications/{id} [post]
func (h *ApplicationHandler) Apply(c *gin.Context) {
	idStr := c.Param("id")
	vacancyID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid vacancy id"})
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

	if err := h.service.Apply(userID, role, vacancyID); err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "applied successfully"})
}

// GetMy godoc
// @Summary Get my applications
// @Tags application
// @Security BearerAuth
// @Produce json
// @Success 200 {array} application.CandidateApplicationItemResponse
// @Failure 500 {object} map[string]string
// @Router /candidate/applications [get]
func (h *ApplicationHandler) GetMy(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")

	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	apps, err := h.service.GetMyApplications(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load applications"})
		return
	}

	c.JSON(http.StatusOK, apps)
}

// GetByVacancy godoc
// @Summary Get applications by vacancy
// @Tags application
// @Security BearerAuth
// @Produce json
// @Param id path int true "Vacancy ID"
// @Success 200 {array} application.EmployerApplicationItemResponse
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /employer/vacancies/{id}/applications [get]
func (h *ApplicationHandler) GetByVacancy(c *gin.Context) {
	idStr := c.Param("id")
	vacancyID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid vacancy id"})
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	apps, err := h.service.GetByVacancy(userID, vacancyID)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, apps)
}

// UpdateStatus godoc
// @Summary Update application status
// @Tags application
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Application ID"
// @Param request body updateStatusRequest true "Status payload"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /employer/applications/{id}/status [put]
func (h *ApplicationHandler) UpdateStatus(c *gin.Context) {
	idStr := c.Param("id")
	appID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid application id"})
		return
	}

	var req updateStatusRequest
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

	status := domain.ApplicationStatus(req.Status)

	if err := h.service.UpdateStatus(userID, appID, status); err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "application status updated"})
}

func (h *ApplicationHandler) handleServiceError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, application.ErrForbidden):
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	case errors.Is(err, application.ErrVacancyNotFound),
		errors.Is(err, application.ErrApplicationNotFound),
		errors.Is(err, application.ErrProfileNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}