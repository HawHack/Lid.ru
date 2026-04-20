package handler

import (
	"net/http"

	"hunter-platform/internal/repository"

	"github.com/gin-gonic/gin"
)

type SkillHandler struct {
	repo repository.SkillRepository
}

func NewSkillHandler(repo repository.SkillRepository) *SkillHandler {
	return &SkillHandler{repo: repo}
}

func (h *SkillHandler) GetAll(c *gin.Context) {
	skills, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}

	c.JSON(http.StatusOK, skills)
}