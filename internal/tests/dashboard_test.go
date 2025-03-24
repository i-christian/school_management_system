package tests

import (
	"net/http"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestAdminDashboard(t *testing.T) {
	ts, postgresC := SetUpTestServer(t)
	defer func() {
		ts.Close()
		TestTeardown(t, postgresC)
	}()

	// Log in as the superuser to get session cookie
	loginReq, cookieJar, err := LoginHelper(t, ts, &LoginInfo{
		Identifier: os.Getenv("SUPERUSER_PHONE"),
		Password:   os.Getenv("SUPERUSER_PASSWORD"),
	})
	client := InitialiseClient(cookieJar)
	resp, err := client.Do(loginReq)
	require.NoError(t, err)
	defer resp.Body.Close()

	// Send GET request to /dashboard/userlist endpoint
	t.Run("User List", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, ts.URL+"/dashboard/userlist", nil)
		require.NoError(t, err)

		resp, err = client.Do(req)
		require.NoError(t, err)
		defer resp.Body.Close()
		require.Equal(t, http.StatusOK, resp.StatusCode, "Expected 200 OK with user list")
	})

	// Send Get request to /dashboard/total_users endpoint
	t.Run("User Count", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, ts.URL+"/dashboard/total_users", nil)
		require.NoError(t, err)

		resp, err = client.Do(req)
		require.NoError(t, err)
		defer resp.Body.Close()
		require.Equal(t, http.StatusOK, resp.StatusCode, "Expected 200 OK with users's count")
	})

	// Send Get request to /dashboard/total_students endpoint
	t.Run("Student's Count", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, ts.URL+"/dashboard/total_students", nil)
		require.NoError(t, err)

		resp, err = client.Do(req)
		require.NoError(t, err)
		defer resp.Body.Close()
		require.Equal(t, http.StatusOK, resp.StatusCode, "Expected 200 OK with student's count")
	})

	// Send Get request to /dashboard/calendar endpoint
	t.Run("Calendar", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, ts.URL+"/dashboard/calendar", nil)
		require.NoError(t, err)

		resp, err = client.Do(req)
		require.NoError(t, err)
		defer resp.Body.Close()
		require.Equal(t, http.StatusOK, resp.StatusCode, "Expected 200 OK with a calendar")
	})
}
