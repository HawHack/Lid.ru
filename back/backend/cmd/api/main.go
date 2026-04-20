// @title Hunter Platform API
// @version 1.0
// @description Skill-first hiring platform backend.
// @host localhost:8080
// @BasePath /

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
package main

import (
	"log"

	"hunter-platform/internal/config"
	"hunter-platform/internal/database"
	"hunter-platform/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config load error: %v", err)
	}

	db, err := database.NewMySQL(cfg)
	if err != nil {
		log.Fatalf("database connection error: %v", err)
	}

	srv := server.New(cfg, db)

	if err := srv.Run(); err != nil {
		log.Fatalf("server run error: %v", err)
	}
}