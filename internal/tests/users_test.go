package tests

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"

	"school_management_system/internal/server"

	"github.com/stretchr/testify/require"
)

func TestUserActions(t *testing.T) {
	ctx := context.Background()

	postgresC, dsn := setupPostgresContainer(t)
	defer postgresC.Terminate(ctx)

	setEnvVars(dsn)

	// Initialize server
	appServer, _ := server.NewServer()
	router := appServer.RegisterRoutes()

	// Start an HTTP test server using the server's router
	ts := httptest.NewServer(router)
	defer ts.Close()

	// Step 1: Log in as the superuser to get the session cookie
	loginReq, cookieJar, err := LoginHelper(t, ts, &LoginInfo{
		Identifier: os.Getenv("SUPERUSER_PHONE"),
		Password:   os.Getenv("SUPERUSER_PASSWORD"),
	})
	client := InitialiseClient(cookieJar)
	resp, err := client.Do(loginReq)
	require.NoError(t, err)
	defer resp.Body.Close()

	// Step 2: Register a new user
	newUserData := url.Values{}
	newUserData.Set("first_name", "Naruto")
	newUserData.Set("last_name", "Uzumaki")
	newUserData.Set("phone_number", "1234567890")
	newUserData.Set("email", "naruto@example.com")
	newUserData.Set("gender", "M")
	newUserData.Set("role", "teacher")

	// Send POST request to /users/ endpoint
	req, err := http.NewRequest(http.MethodPost, ts.URL+"/users/", strings.NewReader(newUserData.Encode()))
	require.NoError(t, err)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	for _, cookie := range cookieJar.Cookies(req.URL) {
		req.AddCookie(cookie)
	}

	resp, err = client.Do(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	require.Equal(t, http.StatusOK, resp.StatusCode, "Expected 200 OK after creating user")

	// Send Get to /profile endpoint to get user details
	req, err = http.NewRequest(http.MethodGet, ts.URL+"/profile", nil)
	require.NoError(t, err)
	for _, cookie := range cookieJar.Cookies(req.URL) {
		req.AddCookie(cookie)
	}

	resp, err = client.Do(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	require.Equal(t, http.StatusOK, resp.StatusCode, "Expected 200 OK with user information")

	// Send a Post to /logout endpoint to logout
	req, err = http.NewRequest(http.MethodPost, ts.URL+"/logout", nil)
	require.NoError(t, err)
	for _, cookie := range cookieJar.Cookies(req.URL) {
		req.AddCookie(cookie)
	}

	resp, err = client.Do(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	require.Equal(t, http.StatusFound, resp.StatusCode, "Expected 302 Found after logout")

	redirectURL, err := resp.Location()
	require.NoError(t, err, "Expected Location header")
	redirectReq, err := http.NewRequest(http.MethodGet, redirectURL.String(), nil)
	require.NoError(t, err)
	redirectResp, err := client.Do(redirectReq)
	require.NoError(t, err)
	defer redirectResp.Body.Close()

	require.Equal(t, http.StatusOK, redirectResp.StatusCode, "Expected 200 OK after redirect")
}
