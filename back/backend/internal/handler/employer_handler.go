package handler

import (
	"net/http"

	"hunter-platform/internal/service/employer"

	"github.com/gin-gonic/gin"
)

type EmployerHandler struct {
	service *employer.Service
}

func NewEmployerHandler(service *employer.Service) *EmployerHandler {
	return &EmployerHandler{service: service}
}
type createEmployerRequest struct {
	CompanyName string `json:"company_name" binding:"required"`
	INN         string `json:"inn" binding:"required"`
	Website     string `json:"website"`
	Description string `json:"description"`
}
// CreateEmployerProfile godoc
// @Summary Create employer profile
// @Tags employer
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body createEmployerRequest true "Employer data"
// @Success 201 {object} map[string]string
// @Router /employer/profile [post]
func (h *EmployerHandler) CreateProfile(c *gin.Context) {
	var req createEmployerRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDVal, _ := c.Get("user_id")
	roleVal, _ := c.Get("role")

	userID := userIDVal.(uint64)
	role := roleVal.(string)

	err := h.service.CreateProfile(
		userID,
		role,
		req.CompanyName,
		req.INN,
		req.Website,
		req.Description,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "employer profile created"})
}
func (h *EmployerHandler) GetProfile(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := userIDVal.(uint64)

	profile, err := h.service.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}
type updateEmployerRequest struct {
	CompanyName string `json:"company_name"`
	Website     string `json:"website"`
	Description string `json:"description"`
}

func (h *EmployerHandler) UpdateProfile(c *gin.Context) {
	var req updateEmployerRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := userIDVal.(uint64)

	err := h.service.UpdateProfile(
		userID,
		req.CompanyName,
		req.Website,
		req.Description,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "profile updated"})
}