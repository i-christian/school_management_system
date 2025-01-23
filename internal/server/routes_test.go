package server

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func executeRequest(req *http.Request, s *Server) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	s.RegisterRoutes().ServeHTTP(rr, req)

	return rr
}

func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d\n", expected, actual)
	}
}

func TestRoutes(t *testing.T) {
	t.Run("Test Homepage using GET", func(t *testing.T) {
		s := &Server{}
		s.RegisterRoutes()

		request, err := http.NewRequest(http.MethodGet, "/", nil)
		if err != nil {
			t.Errorf("Failed to send a request: got an error %v", err)
		}

		response := executeRequest(request, s).Result()

		checkResponseCode(t, http.StatusOK, response.StatusCode)
	})

	t.Run("Test Homepage using POST", func(t *testing.T) {
		s := &Server{}
		s.RegisterRoutes()

		request, err := http.NewRequest(http.MethodPost, "/", nil)
		if err != nil {
			t.Fatal(err)
		}

		response := executeRequest(request, s).Result()
		checkResponseCode(t, http.StatusMethodNotAllowed, response.StatusCode)
	})
}
