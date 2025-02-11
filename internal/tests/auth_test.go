package tests

import (
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
	"school_management_system/internal/server"
)

func TestLoginIntegration(t *testing.T) {
	// Setup common resources (e.g., Postgres container, environment variables)
	postgresC := TestSetup(t)
	defer TestTeardown(t, postgresC)

	appServer, _ := server.NewServer()
	router := appServer.RegisterRoutes()

	ts := httptest.NewServer(router)
	defer ts.Close()

	// Prepare form data for login
	formData := url.Values{}
	formData.Set("identifier", os.Getenv("SUPERUSER_PHONE"))
	formData.Set("password", os.Getenv("SUPERUSER_PASSWORD"))

	cookieJar, _ := cookiejar.New(nil)
	client := &http.Client{Jar: cookieJar, CheckRedirect: func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	}}

	req, err := http.NewRequest(http.MethodPost, ts.URL+"/login", strings.NewReader(formData.Encode()))
	require.NoError(t, err)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

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
