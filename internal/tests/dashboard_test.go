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

	// Log in as the superuser to get the session cookie
	loginReq, cookieJar, err := LoginHelper(t, ts, &LoginInfo{
		Identifier: os.Getenv("SUPERUSER_PHONE"),
		Password:   os.Getenv("SUPERUSER_PASSWORD"),
	})
	client := InitialiseClient(cookieJar)
	resp, err := client.Do(loginReq)
	require.NoError(t, err)
	defer resp.Body.Close()

	// Send GET request to /dashboard/userlist endpoint
	req, err := http.NewRequest(http.MethodGet, ts.URL+"/dashboard/userlist", nil)
	require.NoError(t, err)

	resp, err = client.Do(req)
	require.NoError(t, err)
	defer resp.Body.Close()
	require.Equal(t, http.StatusOK, resp.StatusCode, "Expected 200 OK with user list")
}
