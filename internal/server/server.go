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

	"school_management_system/internal/cache"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/pressly/goose/v3"
	"golang.org/x/crypto/bcrypt"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
)

type Server struct {
	queries   *database.Queries
	conn      *pgxpool.Pool
	cache     *cache.Cache[string, any]
	SecretKey []byte
	port      int
}

//go:embed sql/schema/*.sql
var embedMigrations embed.FS

// Setup database migrations and closes database connection afterwards
func setUpMigration() {
	db, err := sql.Open(os.Getenv("GOOSE_DRIVER"), os.Getenv("DB_URL"))
	if err != nil {
		slog.Error("Failed to open database for migration", "msg", err.Error())
		return
	}

	defer db.Close()
	goose.SetBaseFS(embedMigrations)
	if err := goose.SetDialect("postgres"); err != nil {
		slog.Error("Failed to select postgres database", "msg", err.Error())
	}

	if err := goose.Up(db, os.Getenv("GOOSE_MIGRATION_DIR")); err != nil {
		slog.Error("Unable to run migrations:\n", "error", err.Error())
	}
}

// Checks if required env vars are all set during server startup
func validateEnvVars() {
	requiredVars := []string{"DB_URL", "PORT", "RANDOM_HEX", "DOMAIN", "RANDOM_HEX", "PROJECT_NAME", "GOOSE_DRIVER", "GOOSE_MIGRATION_DIR", "SUPERUSER_ROLE", "SUPERUSER_EMAIL", "SUPERUSER_PHONE", "SUPERUSER_PASSWORD", "ENV"}
	for _, v := range requiredVars {
		if os.Getenv(v) == "" {
			slog.Error(fmt.Sprintf("Environment variable %s is required", v))
			os.Exit(1)
		}
	}
}

// NewServer function initialises a new server
func NewServer() (*Server, *http.Server) {
	validateEnvVars()
	setUpMigration()

	SecretKey, err := hex.DecodeString(os.Getenv("RANDOM_HEX"))
	if err != nil {
		slog.Error(err.Error())
	}

	ctx := context.Background()
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	conn, err := pgxpool.New(ctx, os.Getenv("DB_URL"))
	if err != nil {
		slog.Error("Unable to connect to database: \n", "error", err.Error())
		os.Exit(1)
	}

	generatedQeries := database.New(conn)
	createSuperUser(ctx, generatedQeries)

	appCache := cache.New[string, any]()

	appServer := &Server{
		port:      port,
		conn:      conn,
		queries:   generatedQeries,
		cache:     appCache,
		SecretKey: SecretKey,
	}

	// set up cache
	appServer.setUpCache(ctx)

	// Declare Server config
	httpserver := &http.Server{
		Addr:         fmt.Sprintf(":%d", appServer.port),
		Handler:      appServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return appServer, httpserver
}

func createSuperUser(ctx context.Context, queries *database.Queries) {
	role := os.Getenv("SUPERUSER_ROLE")
	email := os.Getenv("SUPERUSER_EMAIL")
	phone := os.Getenv("SUPERUSER_PHONE")
	password := os.Getenv("SUPERUSER_PASSWORD")

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		slog.Error("Failed to hash password")
		os.Exit(1)
	}

	adminUser, err := queries.GetUserByPhone(ctx, pgtype.Text{String: phone, Valid: true})

	if adminUser.UserID != uuid.Nil {
		slog.Info("Superuser already exists")
		return
	}

	user := database.CreateUserParams{
		FirstName:   "Admin",
		LastName:    "Admin",
		PhoneNumber: pgtype.Text{String: phone, Valid: true},
		Email:       pgtype.Text{String: email, Valid: true},
		Gender:      "M",
		Password:    string(hashedPassword),
		Name:        role,
	}

	_, err = queries.CreateUser(ctx, user)
	if err != nil {
		slog.Error("Failed to create superuser:", "error", err.Error())
	} else {
		slog.Info("Superuser created successfully")
	}
}

// setUpCache on server restart
func (s *Server) setUpCache(ctx context.Context) {
	activeTerm, err := s.queries.GetCurrentTerm(ctx)
	if err != nil {
		slog.Error("no set active term", "error", err.Error())
	}

	if activeTerm.TermID != uuid.Nil {
		s.cache.Set(string(academicTermKey), CachedTerm{
			TermID:         activeTerm.TermID,
			PreviousTermID: activeTerm.PreviousTermID,
			AcademicTerm:   activeTerm.AcademicTerm,
			OpeningDate:    activeTerm.OpeningDate,
			ClosingDate:    activeTerm.ClosingDate,
			Active:         activeTerm.Active,
		})
	}

	activeYear, err := s.queries.GetCurrentAcademicYear(ctx)
	if err != nil {
		slog.Error("no set active academic year", "error", err.Error())
	}

	if activeYear.AcademicYearID != uuid.Nil {
		s.cache.Set(string(academicYearKey), CachedAcademicYear{
			AcademicYearID:  activeYear.AcademicYearID,
			GraduateClassID: activeYear.GraduateClassID,
			Name:            activeYear.Name,
			StartDate:       activeYear.StartDate,
			EndDate:         activeYear.EndDate,
			Active:          activeYear.Active,
		})
	}
}
