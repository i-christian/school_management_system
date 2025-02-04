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

// Test that the secureHeaders middleware adds the expected security headers.
func TestSecureHeadersMiddleware(t *testing.T) {
	s := &Server{}
	req, _ := http.NewRequest(http.MethodGet, "/", nil)
	rr := executeRequest(req, s)

	// Check that the secure headers are present.
	headers := map[string]string{
		"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' data: fonts.gstatic.com",
		"Referrer-Policy":         "origin-when-cross-origin",
		"X-Content-Type-Options":  "nosniff",
		"X-Frame-Options":         "deny",
		"X-XSS-Protection":        "0",
	}
	for key, expected := range headers {
		actual := rr.Header().Get(key)
		if actual != expected {
			t.Errorf("Expected header %s to be '%s', got '%s'", key, expected, actual)
		}
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
			target:         "/details",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Dashboard require auth",
			method:         http.MethodGet,
			target:         "/dashboard",
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
