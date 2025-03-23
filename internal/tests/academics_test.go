package tests

import (
	"net/http"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/stretchr/testify/require"
)

func TestAcademics(t *testing.T) {
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
	var toggleURL string
	var redirectResp *http.Response
	var termRedirectResp *http.Response
	currentTime := time.Now()

	t.Run("Create an academic year", func(t *testing.T) {
		start := currentTime.Format(time.DateOnly)
		end := currentTime.AddDate(0, 12, 0).Format(time.DateOnly)
		newAcademicYear := url.Values{}
		newAcademicYear.Set("name", "2025/26 Academic Year")
		newAcademicYear.Set("start", start)
		newAcademicYear.Set("end", end)

		// Send a POST request to /academics/years endpoint
		req, err := http.NewRequest(http.MethodPost, ts.URL+"/academics/years", strings.NewReader(newAcademicYear.Encode()))
		require.NoError(t, err)
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

		for _, cookie := range cookieJar.Cookies(req.URL) {
			req.AddCookie(cookie)
		}

		resp, err = client.Do(req)
		require.NoError(t, err)
		defer resp.Body.Close()

		require.Equal(t, http.StatusFound, resp.StatusCode, "Expected 302 Found after creating an academic year")

		redirectURL, err := resp.Location()
		require.NoError(t, err, "Expected Location header")

		redirectReq, err := http.NewRequest(http.MethodGet, redirectURL.String(), nil)
		require.NoError(t, err)
		redirectResp, err = client.Do(redirectReq)
		require.NoError(t, err)
		require.Equal(t, http.StatusOK, redirectResp.StatusCode, "Expected 200 OK after redirect")
	})

	// Test toggle active academic year
	t.Run("Toggle Active academic year", func(t *testing.T) {
		doc, err := goquery.NewDocumentFromReader(redirectResp.Body)
		require.NoError(t, err)
		toggleURL, _ = doc.Find("#toggleAcademicID").Attr("hx-put")

		toggleYearReq, err := http.NewRequest(http.MethodPut, ts.URL+toggleURL, nil)

		require.NoError(t, err)
		toggleYearResp, err := client.Do(toggleYearReq)
		require.NoError(t, err)
		defer toggleYearResp.Body.Close()

		require.Equal(t, http.StatusFound, toggleYearResp.StatusCode, "Expected 302 Found after toggling an academic year")
	})

	// Test Create academic Term for an active academic year from the above test
	t.Run("Create a new academic term", func(t *testing.T) {
		parts := strings.Split(toggleURL, "/")
		newAcademicTerm := url.Values{}
		academicYearID := parts[3]
		startTerm := currentTime.Format(time.DateOnly)
		endTerm := currentTime.AddDate(0, 2, 0).Format(time.DateOnly)
		newAcademicTerm.Set("name", "First Term")
		newAcademicTerm.Set("start", startTerm)
		newAcademicTerm.Set("end", endTerm)

		req, err := http.NewRequest(http.MethodPost, ts.URL+"/academics/terms/"+academicYearID, strings.NewReader(newAcademicTerm.Encode()))
		require.NoError(t, err)
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

		resp, err = client.Do(req)
		require.NoError(t, err)
		defer resp.Body.Close()
		require.Equal(t, http.StatusFound, resp.StatusCode, "Expected 302 Found after toggling an academic year")

		redirectURL, err := resp.Location()
		require.NoError(t, err, "Expected Location header")

		redirectReq, err := http.NewRequest(http.MethodGet, redirectURL.String(), nil)
		require.NoError(t, err)
		termRedirectResp, err = client.Do(redirectReq)
		require.NoError(t, err)
		require.Equal(t, http.StatusOK, termRedirectResp.StatusCode, "Expected 200 OK after redirect")
	})

	// Test toggle active academic term
	t.Run("Toggle active term year", func(t *testing.T) {
		doc, err := goquery.NewDocumentFromReader(termRedirectResp.Body)
		defer termRedirectResp.Body.Close()

		require.NoError(t, err)
		toggleURL, _ = doc.Find("#AcademicTermsList").Attr("hx-get")

		getTermsReq, err := http.NewRequest(http.MethodGet, ts.URL+toggleURL, nil)
		require.NoError(t, err)

		getTermsResp, err := client.Do(getTermsReq)
		require.NoError(t, err)

		doc, err = goquery.NewDocumentFromReader(getTermsResp.Body)
		defer getTermsResp.Body.Close()
		require.NoError(t, err)
		toggleURL, _ = doc.Find("#toggleTermID").Attr("hx-put")

		toggleTermReq, err := http.NewRequest(http.MethodPut, ts.URL+toggleURL, nil)

		require.NoError(t, err)
		toggleTermResp, err := client.Do(toggleTermReq)
		require.NoError(t, err)

		require.Equal(t, http.StatusFound, toggleTermResp.StatusCode, "Expected 302 Found after toggling an academic term")
	})

	// Test currrent academic year and term
	t.Run("Get Current Academic Year and Term", func(t *testing.T) {
		getAcademicsReq, err := http.NewRequest(http.MethodGet, ts.URL+"/dashboard/academics", nil)
		require.NoError(t, err)

		getAcademicsResp, err := client.Do(getAcademicsReq)
		require.NoError(t, err)
		defer getAcademicsResp.Body.Close()

		require.Equal(t, http.StatusOK, getAcademicsResp.StatusCode, "Expect 200 OK after getting current year and term")
	})
}
