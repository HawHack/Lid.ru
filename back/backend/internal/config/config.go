package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUser     string
	DBPassword string
	DBHost     string
	DBPort     string
	DBName     string
	JWTSecret  string
	HTTPPort   string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	return &Config{
		DBUser:     getEnv("DB_USER", "hunter"),
		DBPassword: getEnv("DB_PASSWORD", "hunter"),
		DBHost:     getEnv("DB_HOST", "127.0.0.1"),
		DBPort:     getEnv("DB_PORT", "3307"),
		DBName:     getEnv("DB_NAME", "hunter_platform"),
		JWTSecret:  getEnv("JWT_SECRET", "supersecret"),
		HTTPPort:   getEnv("HTTP_PORT", "8080"),
	}, nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
