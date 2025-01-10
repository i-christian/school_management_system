package server

import (
	"context"
	"database/sql"
	"embed"
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
	queries *database.Queries
	port    int
}

//go:embed sql/schema/*.sql
var embedMigrations embed.FS

// Setup database migrations and closes database connection afterwards
func setUpMigration() {
	db, err := sql.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		slog.Error("Failed to open database for migration")
	}

	defer db.Close()
	goose.SetBaseFS(embedMigrations)
	if err := goose.SetDialect("postgres"); err != nil {
		slog.Error("Failed to select postgres database")
	}

	if err := goose.Up(db, "sql/schema"); err != nil {
		slog.Error("Unable to run migrations:\n", "Details", err)
	}
}

func NewServer() *http.Server {
	// Runs migrations and exits
	setUpMigration()

	ctx := context.Background()
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	conn, err := pgx.Connect(ctx, os.Getenv("DB_URL"))
	if err != nil {
		slog.Error("Unable to connect to database: \n", "detailed message", err)
		os.Exit(1)
	}

	defer conn.Close(ctx)
	generatedQeries := database.New(conn)

	NewServer := &Server{
		port:    port,
		queries: generatedQeries,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
