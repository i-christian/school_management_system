package server

import (
	"context"
	"database/sql"
	"embed"
	"encoding/hex"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"time"

	"school_management_system/internal/database"

	"github.com/pressly/goose/v3"

	"github.com/jackc/pgx/v5"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
)

type Server struct {
	queries   *database.Queries
	conn      *pgx.Conn
	SecretKey []byte
	port      int
}

//go:embed sql/schema/*.sql
var embedMigrations embed.FS

// Setup database migrations and closes database connection afterwards
func setUpMigration() {
	db, err := sql.Open(os.Getenv("GOOSE_DRIVER"), os.Getenv("DB_URL"))
	if err != nil {
		slog.Error("Failed to open database for migration")
		return
	}

	defer db.Close()
	goose.SetBaseFS(embedMigrations)
	if err := goose.SetDialect("postgres"); err != nil {
		slog.Error("Failed to select postgres database")
	}

	if err := goose.Up(db, os.Getenv("GOOSE_MIGRATION_DIR")); err != nil {
		slog.Error("Unable to run migrations:\n", "Details", err)
	}
}

// Checks if required env vars are all set during server startup
func validateEnvVars() {
	requiredVars := []string{"DB_URL", "PORT", "RANDOM_HEX", "DOMAIN", "RANDOM_HEX", "PROJECT_NAME", "GOOSE_DRIVER", "GOOSE_MIGRATION_DIR"}
	for _, v := range requiredVars {
		if os.Getenv(v) == "" {
			slog.Error(fmt.Sprintf("Environment variable %s is required", v))
			os.Exit(1)
		}
	}
}

func NewServer() (*Server, *http.Server) {
	validateEnvVars()
	setUpMigration()

	SecretKey, err := hex.DecodeString(os.Getenv("RANDOM_HEX"))
	if err != nil {
		slog.Error(err.Error())
	}

	ctx := context.Background()
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	conn, err := pgx.Connect(ctx, os.Getenv("DB_URL"))
	if err != nil {
		slog.Error("Unable to connect to database: \n", "detailed message", err)
		os.Exit(1)
	}

	generatedQeries := database.New(conn)

	AppServer := &Server{
		port:      port,
		conn:      conn,
		queries:   generatedQeries,
		SecretKey: SecretKey,
	}

	// Declare Server config
	httpserver := &http.Server{
		Addr:         fmt.Sprintf(":%d", AppServer.port),
		Handler:      AppServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return AppServer, httpserver
}
