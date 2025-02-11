package tests

import (
	"context"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"

	"school_management_system/internal/server"

	"github.com/stretchr/testify/require"
)

func TestLoginIntegration(t *testing.T) {
	ctx := context.Background()

	postgresC, dsn := setupPostgresContainer(t)
	defer postgresC.Terminate(ctx)

	setEnvVars(dsn)

	appServer, _ := server.NewServer()
	router := appServer.RegisterRoutes()

	// Start an HTTP test server using the server's router.
	ts := httptest.NewServer(router)
	defer ts.Close()

	formData := url.Values{}
	formData.Set("identifier", os.Getenv("SUPERUSER_PHONE"))
	formData.Set("password", os.Getenv("SUPERUSER_PASSWORD"))

	// Send a POST request to the /login endpoint.
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

	t.Logf("Redirect Response Status: %s", redirectResp.Status)
	t.Logf("Redirect Response Headers: %+v", redirectResp.Header)

	require.Equal(t, http.StatusOK, redirectResp.StatusCode, "Expected 200 OK after redirect")
}
