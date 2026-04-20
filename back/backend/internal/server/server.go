package server

import (
	"fmt"
	"net/http"

	_ "hunter-platform/docs"
	"hunter-platform/internal/config"
	"hunter-platform/internal/handler"
	"hunter-platform/internal/matching"
	"hunter-platform/internal/middleware"
	"hunter-platform/internal/repository/mysql"
	"hunter-platform/internal/service/application"
	"hunter-platform/internal/service/auth"
	"hunter-platform/internal/service/candidate"
	"hunter-platform/internal/service/chat"
	"hunter-platform/internal/service/employer"
	"hunter-platform/internal/service/vacancy"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
)

type Server struct {
	cfg *config.Config
	db  *gorm.DB
}

func New(cfg *config.Config, db *gorm.DB) *Server {
	return &Server{
		cfg: cfg,
		db:  db,
	}
}

func (s *Server) Run() error {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	userRepo := mysql.NewUserRepository(s.db)
	refreshRepo := mysql.NewRefreshTokenRepository(s.db)
	skillRepo := mysql.NewSkillRepository(s.db)
	candidateRepo := mysql.NewCandidateRepository(s.db)
	employerRepo := mysql.NewEmployerRepository(s.db)
	vacancyRepo := mysql.NewVacancyRepository(s.db)
	applicationRepo := mysql.NewApplicationRepository(s.db)
	chatRepo := mysql.NewChatRepository(s.db)

	jwtManager := auth.NewJWTManager(s.cfg.JWTSecret)
	matchingSvc := matching.NewDefaultService()

	authService := auth.NewService(userRepo, refreshRepo, jwtManager)
	candidateService := candidate.NewService(candidateRepo)
	employerService := employer.NewService(employerRepo)
	vacancyService := vacancy.NewService(
		vacancyRepo,
		employerRepo,
		skillRepo,
		candidateRepo,
		matchingSvc,
	)
	applicationService := application.NewService(
		applicationRepo,
		vacancyRepo,
		candidateRepo,
		employerRepo,
		skillRepo,
		matchingSvc,
	)
	chatService := chat.NewService(chatRepo, applicationRepo, vacancyRepo)

	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler()
	candidateHandler := handler.NewCandidateHandler(candidateService)
	skillHandler := handler.NewSkillHandler(skillRepo)
	employerHandler := handler.NewEmployerHandler(employerService)
	vacancyHandler := handler.NewVacancyHandler(vacancyService)
	applicationHandler := handler.NewApplicationHandler(applicationService)
	chatHandler := handler.NewChatHandler(chatService)

	r.GET("/skills", skillHandler.GetAll)

	r.GET("/vacancies", vacancyHandler.GetPublicList)
	r.GET("/vacancies/:id", middleware.OptionalJWTAuth(jwtManager), vacancyHandler.GetPublicByID)

	r.POST("/applications/:id/chat", middleware.JWTAuth(jwtManager), chatHandler.Send)
	r.GET("/applications/:id/chat", middleware.JWTAuth(jwtManager), chatHandler.Get)

	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/refresh", authHandler.Refresh)
		authGroup.POST("/logout", authHandler.Logout)
	}

	protected := r.Group("/user")
	protected.Use(middleware.JWTAuth(jwtManager))
	{
		protected.GET("/me", userHandler.Me)
	}

	candidateGroup := r.Group("/candidate")
	candidateGroup.Use(middleware.JWTAuth(jwtManager))
	candidateGroup.Use(middleware.RequireRole("candidate"))
	{
		candidateGroup.POST("/profile", candidateHandler.CreateProfile)
		candidateGroup.GET("/profile", candidateHandler.GetProfile)

		candidateGroup.POST("/skills", candidateHandler.UpsertSkill)
		candidateGroup.GET("/skills", candidateHandler.GetSkills)
		candidateGroup.DELETE("/skills/:id", candidateHandler.DeleteSkill)

		candidateGroup.POST("/applications/:id", applicationHandler.Apply)
		candidateGroup.GET("/applications", applicationHandler.GetMy)
	}

	employerGroup := r.Group("/employer")
	employerGroup.Use(middleware.JWTAuth(jwtManager))
	employerGroup.Use(middleware.RequireRole("employer"))
	{
		employerGroup.POST("/profile", employerHandler.CreateProfile)
		employerGroup.GET("/profile", employerHandler.GetProfile)
		employerGroup.PUT("/profile", employerHandler.UpdateProfile)

		employerGroup.POST("/vacancies", vacancyHandler.Create)
		employerGroup.GET("/vacancies", vacancyHandler.GetMy)
		employerGroup.PUT("/vacancies/:id", vacancyHandler.Update)

		employerGroup.POST("/vacancies/:id/skills", vacancyHandler.UpsertSkill)
		employerGroup.DELETE("/vacancies/:id/skills/:skillId", vacancyHandler.DeleteSkill)
		employerGroup.GET("/vacancies/:id/applications", applicationHandler.GetByVacancy)

		employerGroup.PUT("/applications/:id/status", applicationHandler.UpdateStatus)
	}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return r.Run(fmt.Sprintf(":%s", s.cfg.HTTPPort))
}
