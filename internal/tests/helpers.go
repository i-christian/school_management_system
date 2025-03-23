package tests

import (
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"school_management_system/internal/server"

	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
)

type LoginInfo struct {
	Identifier string
	Password   string
}

// InitialiseClient function sets up the test server client
func InitialiseClient(cookieJar *cookiejar.Jar) *http.Client {
	// define a test client
	client := &http.Client{
		Jar: cookieJar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}

	return client
}

// SetUpTestServer function sets up the new test server for tests
func SetUpTestServer(t *testing.T) (*httptest.Server, testcontainers.Container) {
	t.Helper()

	postgresC := TestSetup(t)

	// Initialize server
	appServer, _ := server.NewServer()
	router := appServer.RegisterRoutes()

	// Start an HTTP test server using the server's router
	ts := httptest.NewServer(router)

	return ts, postgresC
}

// LoginHelper function is a helper that performs user login
func LoginHelper(t *testing.T, ts *httptest.Server, login *LoginInfo) (*http.Request, *cookiejar.Jar, error) {
	t.Helper()
	formData := url.Values{}
	formData.Set("identifier", login.Identifier)
	formData.Set("password", login.Password)

	cookieJar, _ := cookiejar.New(nil)
	req, err := http.NewRequest(http.MethodPost, ts.URL+"/login", strings.NewReader(formData.Encode()))

	require.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	return req, cookieJar, err
}
