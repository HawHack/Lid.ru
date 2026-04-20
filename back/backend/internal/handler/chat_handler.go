package handler

import (
	"errors"
	"net/http"
	"strconv"

	"hunter-platform/internal/service/chat"

	"github.com/gin-gonic/gin"
)

type ChatHandler struct {
	service *chat.Service
}

func NewChatHandler(service *chat.Service) *ChatHandler {
	return &ChatHandler{service: service}
}

type sendMessageRequest struct {
	Message string `json:"message" binding:"required"`
}

// Send godoc
// @Summary Send chat message
// @Tags chat
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Application ID"
// @Param request body sendMessageRequest true "Message"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /applications/{id}/chat [post]
func (h *ChatHandler) Send(c *gin.Context) {
	idStr := c.Param("id")
	appID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid application id"})
		return
	}

	var req sendMessageRequest
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

	if err := h.service.SendMessage(userID, appID, req.Message); err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "sent"})
}

// Get godoc
// @Summary Get chat messages
// @Tags chat
// @Security BearerAuth
// @Produce json
// @Param id path int true "Application ID"
// @Success 200 {array} domain.ChatMessage
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /applications/{id}/chat [get]
func (h *ChatHandler) Get(c *gin.Context) {
	idStr := c.Param("id")
	appID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid application id"})
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID, ok := userIDVal.(uint64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	msgs, err := h.service.GetMessages(userID, appID)
	if err != nil {
		h.handleServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, msgs)
}

func (h *ChatHandler) handleServiceError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, chat.ErrForbidden):
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	case errors.Is(err, chat.ErrApplicationNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}