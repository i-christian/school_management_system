package tests

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
	tc "github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
)

// setupPostgresContainer spins up a PostgreSQL container and returns its DSN.
func setupPostgresContainer(t *testing.T) (tc.Container, string) {
	ctx := context.Background()
	req := tc.ContainerRequest{
		Image:        "postgres:16",
		ExposedPorts: []string{"5432/tcp"},
		Env: map[string]string{
			"POSTGRES_USER":     "testuser",
			"POSTGRES_PASSWORD": "testpass",
			"POSTGRES_DB":       "school_app",
		},
		WaitingFor: wait.ForListeningPort("5432/tcp"),
	}
	postgresC, err := tc.GenericContainer(ctx, tc.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})
	require.NoError(t, err)

	host, err := postgresC.Host(ctx)
	require.NoError(t, err)
	port, err := postgresC.MappedPort(ctx, "5432")
	require.NoError(t, err)

	dsn := fmt.Sprintf("postgres://testuser:testpass@%s:%s/school_app?sslmode=disable", host, port.Port())
	return postgresC, dsn
}

// setEnvVars sets the environment variables required for server initialization.
func setEnvVars(dsn string) {
	os.Setenv("DB_URL", dsn)
	os.Setenv("GOOSE_DRIVER", "postgres")
	os.Setenv("GOOSE_MIGRATION_DIR", "sql/schema")
	os.Setenv("PORT", "8080")
	os.Setenv("RANDOM_HEX", "0123456789abcdef0123456789abcdef")
	os.Setenv("DOMAIN", "localhost")
	os.Setenv("SUPERUSER_ROLE", "admin")
	os.Setenv("SUPERUSER_EMAIL", "admin@example.com")
	os.Setenv("SUPERUSER_PHONE", "123456789012")
	os.Setenv("SUPERUSER_PASSWORD", "password123")
	os.Setenv("PROJECT_NAME", "TestSchool")
}
