package server

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// executeRequest runs the request against our server routes.
func executeRequest(req *http.Request, s *Server) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	s.RegisterRoutes().ServeHTTP(rr, req)
	return rr
}

// checkResponseCode compares the expected status code with the actual.
func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d", expected, actual)
	}
}

// Test basic endpoints using table-driven tests.
func TestRoutes(t *testing.T) {
	s := &Server{}

	tests := []struct {
		name           string
		method         string
		target         string
		expectedStatus int
	}{
		{
			name:           "Homepage GET",
			method:         http.MethodGet,
			target:         "/",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Homepage POST (method not allowed)",
			method:         http.MethodPost,
			target:         "/",
			expectedStatus: http.StatusMethodNotAllowed,
		},
		{
			name:           "Login GET (redirect if already authenticated)",
			method:         http.MethodGet,
			target:         "/login",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Non-existent route returns 404",
			method:         http.MethodGet,
			target:         "/nonexistent",
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "Static asset route (assets)",
			method:         http.MethodGet,
			target:         "/assets/somefile.css",
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, err := http.NewRequest(tt.method, tt.target, nil)
			if err != nil {
				t.Fatalf("Could not create %s request: %v", tt.method, err)
			}

			rr := executeRequest(req, s)
			checkResponseCode(t, tt.expectedStatus, rr.Code)
		})
	}
}

func TestProtectedRoutes(t *testing.T) {
	s := &Server{}

	protectedEndpoints := []struct {
		name           string
		method         string
		target         string
		expectedStatus int
	}{
		{
			name:           "User Details require auth",
			method:         http.MethodGet,
			target:         "/profile",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Dashboard require auth",
			method:         http.MethodGet,
			target:         "/dashboard",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Users require auth",
			method:         http.MethodGet,
			target:         "/users",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Academics require auth",
			method:         http.MethodGet,
			target:         "/academics",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Students require auth",
			method:         http.MethodGet,
			target:         "/students",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Grades require auth",
			method:         http.MethodGet,
			target:         "/grades",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Remarks require auth",
			method:         http.MethodGet,
			target:         "/remarks",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Discipline require auth",
			method:         http.MethodGet,
			target:         "/discipline",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Reports require auth",
			method:         http.MethodGet,
			target:         "/reports",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Promotions require auth",
			method:         http.MethodGet,
			target:         "/promotions",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Graduates require auth",
			method:         http.MethodGet,
			target:         "/graduates",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Fees require auth",
			method:         http.MethodGet,
			target:         "/fees",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Settings require auth",
			method:         http.MethodGet,
			target:         "/settings/user",
			expectedStatus: http.StatusUnauthorized,
		},
	}

	for _, tt := range protectedEndpoints {
		t.Run(tt.name, func(t *testing.T) {
			req, err := http.NewRequest(tt.method, tt.target, nil)
			if err != nil {
				t.Fatalf("Error creating request: %v", err)
			}

			rr := executeRequest(req, s)
			if rr.Code == http.StatusOK {
				t.Errorf("Expected non-OK status for protected route %s, got %d", tt.target, rr.Code)
			}
		})
	}
}
