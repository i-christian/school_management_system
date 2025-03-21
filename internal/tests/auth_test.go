package tests

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"school_management_system/internal/server"

	"github.com/stretchr/testify/require"
)

func TestLoginIntegration(t *testing.T) {
	// Setup common resources (e.g., Postgres container, environment variables)
	postgresC := TestSetup(t)
	defer TestTeardown(t, postgresC)

	appServer, _ := server.NewServer()
	router := appServer.RegisterRoutes()

	ts := httptest.NewServer(router)
	defer ts.Close()

	req, cookieJar, err := LoginHelper(t, ts, &LoginInfo{
		Identifier: os.Getenv("SUPERUSER_PHONE"),
		Password:   os.Getenv("SUPERUSER_PASSWORD"),
	})

	client := InitialiseClient(cookieJar)
	resp, err := client.Do(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	require.Equal(t, http.StatusFound, resp.StatusCode, "Expected 302 Found after login")

	redirectURL, err := resp.Location()
	require.NoError(t, err, "Expected Location header")

	redirectReq, err := http.NewRequest(http.MethodGet, redirectURL.String(), nil)
	require.NoError(t, err)
	redirectResp, err := client.Do(redirectReq)
	require.NoError(t, err)
	defer redirectResp.Body.Close()

	require.Equal(t, http.StatusOK, redirectResp.StatusCode, "Expected 200 OK after redirect")
}
