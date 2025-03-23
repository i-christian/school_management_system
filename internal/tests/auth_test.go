package tests

import (
	"net/http"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestLoginIntegration(t *testing.T) {
	ts, postgresC := SetUpTestServer(t)
	defer func() {
		ts.Close()
		TestTeardown(t, postgresC)
	}()

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
